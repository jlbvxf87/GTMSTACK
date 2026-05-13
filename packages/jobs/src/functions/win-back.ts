import { inngest } from "../client";
import { JOB_EVENTS, SubscriptionCanceledPayload } from "../events";

/**
 * Win-back: two-touch sequence after cancellation. Day 3 = "we'd love to hear
 * why", day 14 = "here's 20% off if you want to try again". Both drafted by
 * Claude using current brand_voice to avoid sounding desperate.
 */
export const winBack = inngest.createFunction(
  { id: "win-back", name: "Win-back (2-touch)" },
  { event: JOB_EVENTS.SUBSCRIPTION_CANCELED },
  async ({ event, step }) => {
    const payload = SubscriptionCanceledPayload.parse(event.data);

    await step.sleep("wait-3-days", "3d");

    await step.run("send-feedback-ask", async () => {
      // eslint-disable-next-line no-console
      console.log("[win-back] feedback ask →", payload.customerEmail);
      return { sent: true };
    });

    await step.sleep("wait-11-more-days", "11d");

    await step.run("send-comeback-offer", async () => {
      // eslint-disable-next-line no-console
      console.log("[win-back] comeback offer →", payload.customerEmail);
      return { sent: true };
    });

    return { subscriptionId: payload.subscriptionId };
  },
);
