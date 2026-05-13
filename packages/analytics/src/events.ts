/**
 * Canonical analytics event names. One source of truth — PostHog dashboards
 * and Inngest job triggers both pull from this list so typos can't fork the
 * funnel.
 *
 * Mirror of @gtmstack/jobs/events.ts (jobs use them as background-work
 * triggers; analytics use them as funnel markers). Keep them in sync. The
 * payload shapes deliberately do NOT match — jobs need strict typed payloads,
 * analytics carry whatever properties the call site wants to surface.
 */
export const ANALYTICS_EVENTS = {
  PAGE_VIEWED: "page.viewed",
  PRODUCT_VIEWED: "product.viewed",
  CHECKOUT_STARTED: "checkout.started",
  ORDER_CREATED: "order.created",
  SUBSCRIPTION_CREATED: "subscription.created",
  SUBSCRIPTION_CANCELED: "subscription.canceled",
  INTAKE_STARTED: "intake.started",
  INTAKE_SUBMITTED: "intake.submitted",
  INTAKE_REVIEWED: "intake.reviewed",
  BRAND_VOICE_GENERATED: "brand_voice.generated",
  OPERATOR_ONBOARDED: "operator.onboarded",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type TrackProperties = Record<string, string | number | boolean | null>;
