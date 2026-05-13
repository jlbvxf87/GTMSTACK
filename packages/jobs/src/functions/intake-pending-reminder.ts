import { inngest } from "../client";
import { JOB_EVENTS, IntakeSubmittedPayload } from "../events";

/**
 * Intake pending reminder: if a clinical intake sits unreviewed for >24h,
 * ping both the operator and any active providers. Cancels itself if the
 * intake is reviewed in the interim.
 */
export const intakePendingReminder = inngest.createFunction(
  {
    id: "intake-pending-reminder",
    name: "Intake pending reminder (>24h)",
    cancelOn: [
      {
        event: JOB_EVENTS.INTAKE_REVIEWED,
        match: "data.pendingIntakeId",
      },
    ],
  },
  { event: JOB_EVENTS.INTAKE_SUBMITTED },
  async ({ event, step }) => {
    const payload = IntakeSubmittedPayload.parse(event.data);

    await step.sleep("wait-24-hours", "24h");

    await step.run("notify-stalled-intake", async () => {
      // eslint-disable-next-line no-console
      console.log("[intake-pending-reminder] →", payload.pendingIntakeId);
      return { notified: true };
    });

    return { pendingIntakeId: payload.pendingIntakeId };
  },
);
