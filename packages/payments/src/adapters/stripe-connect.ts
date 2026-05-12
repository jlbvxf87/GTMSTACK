/**
 * Stripe Connect adapter.
 *
 * In dev without real keys (the default until a GTMStack platform Stripe
 * account is created), every method routes through `mock.ts` so the rest of
 * the system behaves identically. Swapping in real `sk_test_...` keys
 * activates the real Stripe SDK with zero other code changes.
 *
 * Doctrine: `application_fee_amount` carries the platform fee. Operator's
 * connected account (`acct_...`) is the destination. GTMStack never holds the
 * funds — they land in the operator's Stripe balance with the platform fee
 * routed to the GTMStack platform account atomically.
 */

import Stripe from "stripe";

import {
  isMockMode,
  mockCheckoutSession,
  mockConnectOnboardingLink,
  mockRefund,
} from "../mock";
import type {
  CheckoutIntent,
  CheckoutSession,
  ConnectOnboardingLink,
  PaymentAdapter,
  PaymentEvent,
  RefundResult,
} from "../types";

// ---------------------------------------------------------------------------
// Lazy Stripe client (no client instantiated in mock mode).
// ---------------------------------------------------------------------------

let stripeSingleton: Stripe | null = null;

function getStripe(): Stripe {
  if (stripeSingleton) return stripeSingleton;
  const key = process.env.STRIPE_PLATFORM_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_PLATFORM_SECRET_KEY missing. Set a real `sk_test_...` key or rely on mock mode.",
    );
  }
  stripeSingleton = new Stripe(key, {
    apiVersion: "2024-06-20",
    typescript: true,
  });
  return stripeSingleton;
}

// ---------------------------------------------------------------------------
// Platform fee policy.
// ---------------------------------------------------------------------------

/**
 * Platform fee in basis points (1 bp = 0.01%). Sprint 5 default = 500 bps = 5%.
 * Sprint 6 makes this tier-aware (Starter 8%, Growth 5%, Pro 4%, Clinical 6%).
 */
function platformFeeBps(operatorPlan: string | undefined): number {
  switch (operatorPlan) {
    case "starter":
      return 800;
    case "pro":
      return 400;
    case "clinical":
      return 600;
    case "growth":
    default:
      return 500;
  }
}

function feeFor(amount: number, plan: string | undefined): number {
  return Math.round((amount * platformFeeBps(plan)) / 10_000);
}

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

export class StripeConnectAdapter implements PaymentAdapter {
  readonly kind = "stripe-connect" as const;

  async createCheckoutSession(intent: CheckoutIntent): Promise<CheckoutSession> {
    if (isMockMode()) return mockCheckoutSession(intent);

    const stripe = getStripe();

    const unitAmount =
      intent.mode === "subscription"
        ? intent.product.price.subscription?.monthly.amount
        : intent.product.price.oneTime?.amount;
    if (typeof unitAmount !== "number") {
      throw new Error(
        `Product ${intent.product.slug} missing price for mode=${intent.mode}.`,
      );
    }
    const quantity = intent.quantity ?? 1;
    const subtotal = unitAmount * quantity;
    const fee = feeFor(subtotal, intent.operator.plan);

    if (!intent.operator.stripeAccountId) {
      throw new Error(
        `Operator ${intent.operator.id} has no stripeAccountId. Run Connect onboarding first.`,
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: intent.mode === "subscription" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: intent.product.name,
              metadata: { product_slug: intent.product.slug },
            },
            ...(intent.mode === "subscription"
              ? { recurring: { interval: "month" } }
              : {}),
          },
          quantity,
        },
      ],
      customer_email: intent.customerEmail,
      success_url: `${intent.origin}/start/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${intent.origin}/products/${intent.product.slug}`,
      metadata: {
        operator_id: intent.operator.id,
        product_slug: intent.product.slug,
      },
      ...(intent.mode === "payment"
        ? {
            payment_intent_data: {
              application_fee_amount: fee,
              transfer_data: { destination: intent.operator.stripeAccountId },
              metadata: {
                operator_id: intent.operator.id,
                product_slug: intent.product.slug,
              },
            },
          }
        : {
            subscription_data: {
              application_fee_percent: platformFeeBps(intent.operator.plan) / 100,
              transfer_data: { destination: intent.operator.stripeAccountId },
              metadata: {
                operator_id: intent.operator.id,
                product_slug: intent.product.slug,
              },
            },
          }),
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");

    return { id: session.id, url: session.url };
  }

  async createConnectOnboardingLink({
    operatorId,
    returnUrl,
    refreshUrl,
  }: {
    operatorId: string;
    returnUrl: string;
    refreshUrl: string;
  }): Promise<ConnectOnboardingLink> {
    if (isMockMode()) {
      return mockConnectOnboardingLink({ operatorId, returnUrl });
    }

    const stripe = getStripe();

    // Create an Express connected account scoped to the operator. In production
    // we look up an existing account first; for Sprint 5 we always create one.
    const account = await stripe.accounts.create({
      type: "express",
      metadata: { operator_id: operatorId },
    });

    const link = await stripe.accountLinks.create({
      account: account.id,
      return_url: `${returnUrl}?stripe_account_id=${account.id}&operator_id=${operatorId}`,
      refresh_url: refreshUrl,
      type: "account_onboarding",
    });

    return { url: link.url, mock: false };
  }

  async refund({
    externalOrderId,
    amount,
  }: {
    externalOrderId: string;
    amount?: number;
  }): Promise<RefundResult> {
    if (isMockMode()) return mockRefund({ externalOrderId, amount });

    const stripe = getStripe();
    const refund = await stripe.refunds.create({
      payment_intent: externalOrderId,
      amount,
    });
    return {
      id: refund.id,
      amount: refund.amount ?? amount ?? 0,
      status: (refund.status as RefundResult["status"]) ?? "succeeded",
    };
  }

  async handleWebhook({
    rawBody,
    signature,
  }: {
    rawBody: string;
    signature: string | null;
  }): Promise<PaymentEvent[]> {
    if (isMockMode()) {
      // In mock mode the webhook receiver also accepts raw canonical events
      // posted by /dev/checkout. The receiver itself does the work; this
      // adapter has nothing to verify.
      return [];
    }

    const stripe = getStripe();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET missing.");
    if (!signature) throw new Error("Missing Stripe signature header.");

    const event = stripe.webhooks.constructEvent(rawBody, signature, secret);
    return mapStripeEventToCanonical(event);
  }
}

// ---------------------------------------------------------------------------
// Stripe event mapping. Each branch returns 0..n canonical events.
// ---------------------------------------------------------------------------

function mapStripeEventToCanonical(event: Stripe.Event): PaymentEvent[] {
  const at = new Date(event.created * 1000).toISOString();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      return [
        {
          type: "order.created",
          orderId: session.id,
          operatorId: String(session.metadata?.operator_id ?? "unknown"),
          customerEmail: session.customer_details?.email ?? undefined,
          productSlug: String(session.metadata?.product_slug ?? "unknown"),
          amount: session.amount_total ?? 0,
          currency: "USD",
          mode: session.mode === "subscription" ? "subscription" : "payment",
          occurredAt: at,
        },
      ];
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.billing_reason !== "subscription_cycle") return [];
      return [
        {
          type: "subscription.renewed",
          subscriptionId: String(invoice.subscription),
          operatorId: String(invoice.metadata?.operator_id ?? "unknown"),
          amount: invoice.amount_paid ?? 0,
          currency: "USD",
          occurredAt: at,
        },
      ];
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      return [
        {
          type: "subscription.canceled",
          subscriptionId: sub.id,
          operatorId: String(sub.metadata?.operator_id ?? "unknown"),
          occurredAt: at,
        },
      ];
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      return [
        {
          type: "refund.completed",
          orderId: typeof charge.payment_intent === "string" ? charge.payment_intent : charge.id,
          operatorId: String(charge.metadata?.operator_id ?? "unknown"),
          amount: charge.amount_refunded ?? 0,
          occurredAt: at,
        },
      ];
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      return [
        {
          type: "payment.failed",
          orderId: pi.id,
          operatorId: String(pi.metadata?.operator_id ?? "unknown"),
          reason: pi.last_payment_error?.message ?? "unknown",
          occurredAt: at,
        },
      ];
    }

    case "account.updated": {
      const acct = event.data.object as Stripe.Account;
      return [
        {
          type: "connect.account_updated",
          operatorId: String(acct.metadata?.operator_id ?? "unknown"),
          stripeAccountId: acct.id,
          detailsSubmitted: acct.details_submitted ?? false,
          chargesEnabled: acct.charges_enabled ?? false,
          occurredAt: at,
        },
      ];
    }

    default:
      return [];
  }
}

/** Singleton for the route handlers to import without re-instantiating. */
export const stripeConnectAdapter = new StripeConnectAdapter();
