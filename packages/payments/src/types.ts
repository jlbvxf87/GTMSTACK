/**
 * @gtmstack/payments core types.
 *
 * Every payment processor implements `PaymentAdapter`. The router picks the
 * right adapter per (product, operator) pair. Downstream consumers (email,
 * dashboard, AI, jobs) read only the canonical `PaymentEvent` shape — they
 * never know which processor fired the original webhook.
 *
 * This file is processor-agnostic and contains no Stripe / CarePlug imports.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Money / pricing
// ---------------------------------------------------------------------------

export type Currency = "USD";

export type AmountInCents = number;

// ---------------------------------------------------------------------------
// Operator + connected-account context
// ---------------------------------------------------------------------------

/**
 * Operator pricing tiers. Higher tiers unlock clinical products + lower
 * transaction fees. Enforcement (gating clinical products to clinical tier)
 * is in the router; surfacing this in UI is Sprint 6.
 */
export type OperatorPlan = "starter" | "growth" | "pro" | "clinical";

export type Operator = {
  id: string;
  plan: OperatorPlan;
  /** The operator's connected Stripe account (`acct_...`). Undefined until they finish Connect onboarding. */
  stripeAccountId?: string;
  /** Operator's bank state — drives state-rules eligibility for clinical products. */
  state?: string;
};

// ---------------------------------------------------------------------------
// Inputs from the storefront
// ---------------------------------------------------------------------------

/**
 * A customer's intent to buy. The route handler constructs this from the
 * product slug + URL + cookie context and hands it to the router.
 */
export type CheckoutIntent = {
  operator: Operator;
  product: CheckoutProduct;
  /** Subscription = recurring monthly; payment = one-time. */
  mode: "subscription" | "payment";
  /** Quantity (defaults to 1). */
  quantity?: number;
  /** Origin URL for `success_url` and `cancel_url`. */
  origin: string;
  /** Optional customer email if known (e.g. from intake account step). */
  customerEmail?: string;
};

/**
 * Subset of `Product` needed for checkout. Lives here so the payments package
 * doesn't depend on `@gtmstack/ui`.
 */
export type CheckoutProduct = {
  id: string;
  slug: string;
  name: string;
  tier: "wellness" | "clinical";
  requiresProviderReview?: boolean;
  price: {
    oneTime?: { amount: AmountInCents; currency: Currency };
    subscription?: {
      monthly: { amount: AmountInCents; currency: Currency };
    };
  };
};

// ---------------------------------------------------------------------------
// PaymentAdapter — every processor implements this.
// ---------------------------------------------------------------------------

export type CheckoutSession = {
  /** External provider session id (e.g. Stripe `cs_test_...`). */
  id: string;
  /** Where to redirect the customer to complete the purchase. */
  url: string;
};

export type ConnectOnboardingLink = {
  /** Where the operator goes to onboard. */
  url: string;
  /** Whether this is real or a synthesized dev link. */
  mock: boolean;
};

export type RefundResult = {
  id: string;
  amount: AmountInCents;
  status: "succeeded" | "pending" | "failed";
};

export interface PaymentAdapter {
  readonly kind: string;

  /** Create a hosted checkout session (Stripe Checkout, CarePlug hosted, etc.). */
  createCheckoutSession(intent: CheckoutIntent): Promise<CheckoutSession>;

  /** Return a URL the operator visits to onboard / connect their account. */
  createConnectOnboardingLink(args: {
    operatorId: string;
    returnUrl: string;
    refreshUrl: string;
  }): Promise<ConnectOnboardingLink>;

  /** Refund all or part of an order. */
  refund(args: { externalOrderId: string; amount?: AmountInCents }): Promise<RefundResult>;

  /**
   * Verify and parse a webhook payload. Returns canonical events the rest of
   * the system can consume. May return an empty array for events we don't care
   * about (so the receiver can still 200 them).
   */
  handleWebhook(args: {
    rawBody: string;
    signature: string | null;
  }): Promise<PaymentEvent[]>;
}

// ---------------------------------------------------------------------------
// Canonical events. Adapters EMIT these. Apps CONSUME these.
// Schema-validated so a misbehaving adapter can't poison the downstream.
// ---------------------------------------------------------------------------

export const PaymentEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("order.created"),
    orderId: z.string(),
    operatorId: z.string(),
    customerEmail: z.string().email().optional(),
    productSlug: z.string(),
    amount: z.number().int(),
    currency: z.literal("USD"),
    mode: z.enum(["subscription", "payment"]),
    occurredAt: z.string(),
  }),
  z.object({
    type: z.literal("subscription.renewed"),
    subscriptionId: z.string(),
    operatorId: z.string(),
    amount: z.number().int(),
    currency: z.literal("USD"),
    occurredAt: z.string(),
  }),
  z.object({
    type: z.literal("subscription.canceled"),
    subscriptionId: z.string(),
    operatorId: z.string(),
    occurredAt: z.string(),
  }),
  z.object({
    type: z.literal("refund.completed"),
    orderId: z.string(),
    operatorId: z.string(),
    amount: z.number().int(),
    occurredAt: z.string(),
  }),
  z.object({
    type: z.literal("payment.failed"),
    orderId: z.string().optional(),
    operatorId: z.string(),
    reason: z.string(),
    occurredAt: z.string(),
  }),
  z.object({
    type: z.literal("intake.pending_review"),
    pendingOrderId: z.string(),
    operatorId: z.string(),
    productSlug: z.string(),
    customerEmail: z.string().email().optional(),
    occurredAt: z.string(),
  }),
  z.object({
    type: z.literal("connect.account_updated"),
    operatorId: z.string(),
    stripeAccountId: z.string(),
    detailsSubmitted: z.boolean(),
    chargesEnabled: z.boolean(),
    occurredAt: z.string(),
  }),
]);

export type PaymentEvent = z.infer<typeof PaymentEventSchema>;
