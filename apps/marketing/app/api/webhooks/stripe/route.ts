import "server-only";
import { NextResponse, type NextRequest } from "next/server";

import {
  isMockMode,
  PaymentEventSchema,
  stripeConnectAdapter,
  type PaymentEvent,
} from "@gtmstack/payments";

/**
 * POST /api/webhooks/stripe
 *
 * In live mode: verifies the Stripe-Signature header, delegates parsing to the
 * adapter, and dispatches canonical events.
 *
 * In mock mode: accepts a raw `application/json` body with a canonical
 * `PaymentEvent` payload (used by the /dev/checkout page to simulate a
 * successful purchase). The adapter handleWebhook returns [] in mock mode, so
 * we read the body directly.
 *
 * Sprint 5 dispatches events to the console + an in-memory log so the rest of
 * the platform has a single entry point. Sprint 6 wires this to Inngest +
 * Supabase writes via @gtmstack/jobs.
 */

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let events: PaymentEvent[] = [];

  if (isMockMode()) {
    // Accept either { event } or a single event object.
    try {
      const parsed = JSON.parse(rawBody);
      const candidate = parsed.event ?? parsed;
      const result = PaymentEventSchema.safeParse(candidate);
      if (result.success) events = [result.data];
    } catch {
      // ignore — empty events array means "nothing to do"
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
    dispatchEvent(event);
  }

  return NextResponse.json({ received: events.length });
}

/**
 * Single dispatch point — log to the server console for Sprint 5. Sprint 6
 * swaps this body for `inngest.send(event)` so background jobs (email,
 * dashboard updates, AI retention) consume the same canonical event stream.
 */
function dispatchEvent(event: PaymentEvent): void {
  console.log(`[payments-event] ${event.type}`, event);
  // TODO(sprint-6): inngest.send({ name: event.type, data: event });
  // TODO(sprint-6): persist to core.events table for audit + dashboard.
}
