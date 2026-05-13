import "server-only";
import { NextResponse, type NextRequest } from "next/server";

import {
  isMockMode,
  PaymentEventSchema,
  stripeConnectAdapter,
  type PaymentEvent,
} from "@gtmstack/payments";
import {
  createAdminClient,
  findOrganizationIdBySlug,
  insertEvent,
  insertOrder,
  insertSubscription,
  updateSubscriptionStatus,
} from "@gtmstack/database-core";

/**
 * POST /api/webhooks/stripe
 *
 * Live mode: verifies the Stripe-Signature header, delegates parsing to the
 * adapter, and dispatches canonical events.
 *
 * Mock mode: accepts a raw `application/json` body with a canonical
 * `PaymentEvent` payload (used by the /dev/checkout page to simulate a
 * successful purchase).
 *
 * For each canonical event we:
 *   - persist the raw event to public.events (audit + dashboard feed)
 *   - if it's an order.created: look up org by slug → find/skip customer
 *     by email → insert orders row (+ subscriptions row if mode=subscription)
 *   - if subscription.canceled: flip subscriptions.status
 *
 * All writes use the service-role admin client because the webhook callback
 * runs anonymously.
 */

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let events: PaymentEvent[] = [];

  if (isMockMode()) {
    try {
      const parsed = JSON.parse(rawBody);
      const candidate = parsed.event ?? parsed;
      const result = PaymentEventSchema.safeParse(candidate);
      if (result.success) events = [result.data];
    } catch {
      // empty events array means nothing to do
    }
  } else {
    try {
      events = await stripeConnectAdapter.handleWebhook({ rawBody, signature });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[stripe webhook] verification or parse failed:", message);
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  for (const event of events) {
    await dispatchEvent(event);
  }

  return NextResponse.json({ received: events.length });
}

async function dispatchEvent(event: PaymentEvent): Promise<void> {
  console.log(`[payments-event] ${event.type}`, event);

  const admin = createAdminClient();
  if (!admin) {
    console.warn(
      "[payments-event] admin client unavailable — Supabase env not configured. Event logged only.",
    );
    return;
  }

  // Resolve operator slug → organization id (skipped for events without an
  // operatorId).
  const operatorSlug =
    "operatorId" in event && typeof event.operatorId === "string"
      ? event.operatorId
      : null;
  const organizationId = operatorSlug
    ? await findOrganizationIdBySlug(admin, operatorSlug)
    : null;

  // Always persist the raw event for audit + dashboard feed.
  await insertEvent(admin, {
    organizationId,
    type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });

  if (!organizationId) {
    if (operatorSlug) {
      console.warn(
        `[payments-event] could not resolve organization for operator slug '${operatorSlug}' — event logged but no order/subscription write`,
      );
    }
    return;
  }

  if (event.type === "order.created") {
    await handleOrderCreated(admin, event, organizationId);
  } else if (event.type === "subscription.canceled") {
    await updateSubscriptionStatus(admin, event.subscriptionId, "canceled");
  }
}

async function handleOrderCreated(
  admin: ReturnType<typeof createAdminClient>,
  event: Extract<PaymentEvent, { type: "order.created" }>,
  organizationId: string,
): Promise<void> {
  if (!admin) return;

  // Find the customer for this order. Anonymous purchases (no email, or no
  // matching customers row) skip the order write — they'd need to claim the
  // purchase by signing up with the same email later. For V1 we accept this
  // gap; production should require signup before checkout.
  const email = event.customerEmail;
  if (!email) {
    console.warn(`[payments-event] order ${event.orderId} has no customer email — skipping orders/subscriptions write`);
    return;
  }

  const { data: customer } = await admin
    .from("customers")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("email", email)
    .maybeSingle();

  if (!customer) {
    console.warn(
      `[payments-event] no customers row for ${email} @ org ${organizationId} — skipping orders/subscriptions write. Customer can claim by signing up with the same email.`,
    );
    return;
  }

  const customerId = (customer as { id: string }).id;

  const order = await insertOrder(admin, {
    organizationId,
    customerId,
    productSlug: event.productSlug,
    amountCents: event.amount,
    mode: event.mode,
    stripeSessionId: event.orderId,
  });

  if (!order) return;

  if (event.mode === "subscription") {
    await insertSubscription(admin, {
      organizationId,
      customerId,
      productSlug: event.productSlug,
      amountCents: event.amount,
      stripeSubscriptionId: event.orderId, // mock: session id; live: real sub id
    });
  }
}
