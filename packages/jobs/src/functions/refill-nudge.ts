import { inngest } from "../client";
import { JOB_EVENTS, SubscriptionRenewedPayload } from "../events";

/**
 * Refill nudge: fires 5 days before `current_period_end`. We model this by
 * sleeping `current_period_end - 5d` after a `subscription.renewed` event.
 * If the customer cancels in the interim the sleep is cancelled by Inngest's
 * `cancelOn` clause.
 */
export const refillNudge = inngest.createFunction(
  {
    id: "refill-nudge",
    name: "Refill nudge (5d before renewal)",
    cancelOn: [
      {
        event: JOB_EVENTS.SUBSCRIPTION_CANCELED,
        match: "data.subscriptionId",
      },
    ],
  },
  { event: JOB_EVENTS.SUBSCRIPTION_RENEWED },
  async ({ event, step }) => {
    const payload = SubscriptionRenewedPayload.parse(event.data);
    const periodEnd = new Date(payload.currentPeriodEnd);
    const fireAt = new Date(periodEnd.getTime() - 5 * 24 * 60 * 60 * 1000);

    await step.sleepUntil("wait-until-5d-before-renewal", fireAt);

    await step.run("send-refill-nudge", async () => {
      // eslint-disable-next-line no-console
      console.log("[refill-nudge] →", payload.customerEmail);
      return { sent: true };
    });

    return { subscriptionId: payload.subscriptionId };
  },
);
