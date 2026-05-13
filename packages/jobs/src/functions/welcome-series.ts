import { inngest } from "../client";
import { JOB_EVENTS, OrderCreatedPayload } from "../events";

/**
 * Welcome series — 3 touchpoints over 7 days after first order.
 *
 * V1: each step is a console.log + an outbound webhook to whatever your
 * transactional email provider is. The body itself is drafted by Claude via
 * @gtmstack/ai (see drafts/welcome-step-N below) so the message lands in the
 * operator's brand voice, not a generic template.
 */
export const welcomeSeries = inngest.createFunction(
  { id: "welcome-series", name: "Welcome series (3-step)" },
  { event: JOB_EVENTS.ORDER_CREATED },
  async ({ event, step }) => {
    const payload = OrderCreatedPayload.parse(event.data);

    await step.run("send-step-1-welcome", async () => {
      // eslint-disable-next-line no-console
      console.log("[welcome-series] step 1 →", payload.customerEmail);
      // TODO(7c): wire @gtmstack/ai/drafts/welcome-step-1.ts here
      return { sent: true };
    });

    await step.sleep("wait-3-days", "3d");

    await step.run("send-step-2-how-to-use", async () => {
      // eslint-disable-next-line no-console
      console.log("[welcome-series] step 2 →", payload.customerEmail);
      return { sent: true };
    });

    await step.sleep("wait-4-more-days", "4d");

    await step.run("send-step-3-check-in", async () => {
      // eslint-disable-next-line no-console
      console.log("[welcome-series] step 3 →", payload.customerEmail);
      return { sent: true };
    });

    return { customerEmail: payload.customerEmail, completed: true };
  },
);
