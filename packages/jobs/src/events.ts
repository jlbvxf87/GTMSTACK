import { z } from "zod";

/**
 * Canonical job event names. Used both for `inngest.send()` callers and as
 * triggers for the function definitions in ./functions.
 */
export const JOB_EVENTS = {
  ORDER_CREATED: "order.created",
  SUBSCRIPTION_CANCELED: "subscription.canceled",
  SUBSCRIPTION_RENEWED: "subscription.renewed",
  INTAKE_SUBMITTED: "intake.submitted",
  INTAKE_REVIEWED: "intake.reviewed",
} as const;

export type JobEventName = (typeof JOB_EVENTS)[keyof typeof JOB_EVENTS];

// ---------------------------------------------------------------------------
// Payload schemas. Strict so a bad dispatch fails loudly at the boundary,
// not silently inside a retention email.
// ---------------------------------------------------------------------------

export const OrderCreatedPayload = z.object({
  organizationId: z.string(),
  customerId: z.string(),
  customerEmail: z.string(),
  productSlug: z.string(),
  amountCents: z.number().int().nonnegative(),
  storefrontSlug: z.string(),
});
export type OrderCreatedPayload = z.infer<typeof OrderCreatedPayload>;

export const SubscriptionCanceledPayload = z.object({
  organizationId: z.string(),
  customerId: z.string(),
  customerEmail: z.string(),
  subscriptionId: z.string(),
  productSlug: z.string(),
});
export type SubscriptionCanceledPayload = z.infer<typeof SubscriptionCanceledPayload>;

export const SubscriptionRenewedPayload = z.object({
  organizationId: z.string(),
  customerId: z.string(),
  customerEmail: z.string(),
  subscriptionId: z.string(),
  productSlug: z.string(),
  currentPeriodEnd: z.string(),
});
export type SubscriptionRenewedPayload = z.infer<typeof SubscriptionRenewedPayload>;

export const IntakeSubmittedPayload = z.object({
  organizationId: z.string(),
  pendingIntakeId: z.string(),
  customerEmail: z.string(),
  productSlug: z.string(),
});
export type IntakeSubmittedPayload = z.infer<typeof IntakeSubmittedPayload>;

export const IntakeReviewedPayload = z.object({
  organizationId: z.string(),
  pendingIntakeId: z.string(),
  customerEmail: z.string(),
  decision: z.enum(["approved", "declined", "more_info"]),
  providerId: z.string(),
});
export type IntakeReviewedPayload = z.infer<typeof IntakeReviewedPayload>;

export type JobPayloadByName = {
  [JOB_EVENTS.ORDER_CREATED]: OrderCreatedPayload;
  [JOB_EVENTS.SUBSCRIPTION_CANCELED]: SubscriptionCanceledPayload;
  [JOB_EVENTS.SUBSCRIPTION_RENEWED]: SubscriptionRenewedPayload;
  [JOB_EVENTS.INTAKE_SUBMITTED]: IntakeSubmittedPayload;
  [JOB_EVENTS.INTAKE_REVIEWED]: IntakeReviewedPayload;
};
