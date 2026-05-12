/**
 * Canonical event names emitted by the payments layer.
 *
 * Adapters parse processor-specific webhooks into these events. Everything
 * downstream (apps/operator, apps/admin, @gtmstack/jobs, @gtmstack/ai) consumes
 * THIS shape — so swapping Stripe for CarePlug for Square Connect later
 * touches only the adapter, never the consumers.
 *
 * The schema lives in `./types.ts` (PaymentEventSchema); this file is a thin
 * re-export to make event names self-documenting at the import site.
 */

export const PaymentEvents = {
  OrderCreated: "order.created",
  SubscriptionRenewed: "subscription.renewed",
  SubscriptionCanceled: "subscription.canceled",
  RefundCompleted: "refund.completed",
  PaymentFailed: "payment.failed",
  IntakePendingReview: "intake.pending_review",
  ConnectAccountUpdated: "connect.account_updated",
} as const;

export type PaymentEventName = (typeof PaymentEvents)[keyof typeof PaymentEvents];

export { PaymentEventSchema, type PaymentEvent } from "./types";
