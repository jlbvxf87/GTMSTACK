import { inngest } from "../client";
import { JOB_EVENTS, OrderCreatedPayload } from "../events";

export const thirtyDayCheckin = inngest.createFunction(
  { id: "thirty-day-checkin", name: "30-day check-in" },
  { event: JOB_EVENTS.ORDER_CREATED },
  async ({ event, step }) => {
    const payload = OrderCreatedPayload.parse(event.data);

    await step.sleep("wait-30-days", "30d");

    await step.run("send-checkin", async () => {
      // eslint-disable-next-line no-console
      console.log("[thirty-day-checkin] →", payload.customerEmail);
      // TODO(7c): pull current brand_voice + draft 30-day check-in via @gtmstack/ai
      return { sent: true };
    });

    return { customerEmail: payload.customerEmail };
  },
);
