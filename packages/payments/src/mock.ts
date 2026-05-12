/**
 * Mock-mode helpers — used by the Stripe Connect adapter when no real Stripe
 * keys are configured. Lets the whole purchase flow be testable end-to-end in
 * dev without anyone signing up for Stripe.
 *
 * Toggle: `STRIPE_PLATFORM_SECRET_KEY` is missing OR starts with `sk_test_mock_`.
 *
 * Production code path is unchanged — real keys take over and these helpers
 * are never called.
 */

import type {
  CheckoutIntent,
  CheckoutSession,
  ConnectOnboardingLink,
  PaymentEvent,
  RefundResult,
} from "./types";

export function isMockMode(): boolean {
  const key = process.env.STRIPE_PLATFORM_SECRET_KEY?.trim();
  if (!key) return true;
  if (key.startsWith("sk_test_mock_")) return true;
  if (key === "REPLACE_ME") return true;
  return false;
}

/** Synthesize a mock checkout session. The URL points at the dev fake-checkout page. */
export function mockCheckoutSession(intent: CheckoutIntent): CheckoutSession {
  const id = `cs_mock_${cryptoRandom()}`;
  const amount =
    intent.mode === "subscription"
      ? intent.product.price.subscription?.monthly.amount ?? 0
      : intent.product.price.oneTime?.amount ?? 0;
  const params = new URLSearchParams({
    session_id: id,
    operator_id: intent.operator.id,
    product_slug: intent.product.slug,
    product_name: intent.product.name,
    amount: String(amount),
    mode: intent.mode,
  });
  return {
    id,
    url: `${intent.origin}/dev/checkout?${params.toString()}`,
  };
}

/** Synthesize a mock onboarding link. Routes to /connect/callback?mock=1. */
export function mockConnectOnboardingLink({
  operatorId,
  returnUrl,
}: {
  operatorId: string;
  returnUrl: string;
}): ConnectOnboardingLink {
  const url = new URL(returnUrl);
  url.searchParams.set("mock", "1");
  url.searchParams.set("operator_id", operatorId);
  url.searchParams.set("stripe_account_id", `acct_mock_${cryptoRandom()}`);
  return { url: url.toString(), mock: true };
}

export function mockRefund(args: {
  externalOrderId: string;
  amount?: number;
}): RefundResult {
  return {
    id: `re_mock_${cryptoRandom()}`,
    amount: args.amount ?? 0,
    status: "succeeded",
  };
}

/**
 * Synthesize the `order.created` event the dev /api/webhooks/stripe handler
 * fires when the mock checkout page's "Pay" button is clicked. Lives here so
 * the shape stays in sync with the real Stripe adapter's emission.
 */
export function mockOrderCreatedEvent(args: {
  sessionId: string;
  operatorId: string;
  productSlug: string;
  amount: number;
  mode: "subscription" | "payment";
  customerEmail?: string;
}): PaymentEvent {
  return {
    type: "order.created",
    orderId: args.sessionId,
    operatorId: args.operatorId,
    productSlug: args.productSlug,
    amount: args.amount,
    currency: "USD",
    mode: args.mode,
    customerEmail: args.customerEmail,
    occurredAt: new Date().toISOString(),
  };
}

function cryptoRandom(): string {
  // 16 random hex chars — sufficient for dev session ids.
  const bytes = new Uint8Array(8);
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
