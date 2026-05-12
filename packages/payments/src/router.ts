/**
 * Payment router.
 *
 * Picks the right `PaymentAdapter` per (product, operator). Encapsulates the
 * three rules that decide:
 *
 *   1. Operator-plan gating  — clinical-tier products require a clinical plan.
 *   2. Provider-review gating — `requiresProviderReview` short-circuits to a
 *      review-pending decision instead of any payment call.
 *   3. Processor selection   — wellness → Stripe Connect; clinical → CarePlug
 *                              Pay (stubbed until partners signed).
 *
 * Returns a discriminated `RouterDecision` so route handlers can act
 * appropriately without an exception-driven flow.
 */

import { carePlugPayAdapter } from "./adapters/careplug-pay";
import { stripeConnectAdapter } from "./adapters/stripe-connect";
import { isMockMode } from "./mock";
import type { CheckoutProduct, Operator, PaymentAdapter } from "./types";

export type RouterDecision =
  | { kind: "process"; adapter: PaymentAdapter }
  | { kind: "gate"; reason: GateReason };

export type GateReason =
  | { code: "requires_provider_review"; productSlug: string }
  | { code: "plan_insufficient"; required: "clinical"; current: string }
  | { code: "no_connected_account"; operatorId: string }
  | { code: "missing_partner_integration"; processor: string };

export function route(product: CheckoutProduct, operator: Operator): RouterDecision {
  // Rule 2 — provider review gates EVERYTHING for that product.
  if (product.requiresProviderReview) {
    return {
      kind: "gate",
      reason: { code: "requires_provider_review", productSlug: product.slug },
    };
  }

  // Rule 1 — clinical products require clinical plan.
  if (product.tier === "clinical" && operator.plan !== "clinical") {
    return {
      kind: "gate",
      reason: { code: "plan_insufficient", required: "clinical", current: operator.plan },
    };
  }

  // Rule 3 — pick the processor.
  const adapter =
    product.tier === "clinical" ? carePlugPayAdapter : stripeConnectAdapter;

  // Stripe Connect requires the operator to have completed onboarding.
  // Mock mode short-circuits this so the dev purchase flow works without an
  // actual connect onboarding session having run.
  if (adapter.kind === "stripe-connect" && !operator.stripeAccountId && !isMockMode()) {
    return {
      kind: "gate",
      reason: { code: "no_connected_account", operatorId: operator.id },
    };
  }

  return { kind: "process", adapter };
}
