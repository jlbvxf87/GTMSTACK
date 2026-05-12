import { redirect } from "next/navigation";
import {
  IntakeReviewSummary,
  IntakeShell,
  primeWellness,
  type IntakeReviewSection,
} from "@gtmstack/ui";

import { submitReview } from "../actions";
import {
  ACTIVITY_LEVEL_OPTIONS,
  AGE_OPTIONS,
  CADENCE_OPTIONS,
  COACHING_OPTIONS,
  COMMS_OPTIONS,
  FOCUS_AREA_OPTIONS,
  INTAKE_STEPS,
  PRIMARY_GOAL_OPTIONS,
  SLEEP_OPTIONS,
  completedKeys,
  labelOf,
  labelsOf,
  readIntakeState,
} from "../state";

export default async function ReviewStep() {
  const state = await readIntakeState();

  // Guard: only render review if all prior steps are complete.
  const done = completedKeys(state);
  if (!done.includes("account")) redirect("/start/account?error=1");

  const sections: IntakeReviewSection[] = [
    {
      stepKey: "goals",
      label: "Goals",
      editHref: "/start",
      fields: [
        {
          label: "Primary goal",
          value: labelOf(PRIMARY_GOAL_OPTIONS, state.goals?.primaryGoal),
        },
        {
          label: "Focus areas",
          value: labelsOf(FOCUS_AREA_OPTIONS, state.goals?.goals),
        },
      ],
    },
    {
      stepKey: "health",
      label: "Health snapshot",
      editHref: "/start/health",
      fields: [
        { label: "Age range", value: labelOf(AGE_OPTIONS, state.health?.age) },
        {
          label: "Activity",
          value: labelOf(ACTIVITY_LEVEL_OPTIONS, state.health?.activityLevel),
        },
        { label: "Sleep", value: labelOf(SLEEP_OPTIONS, state.health?.sleepQuality) },
        { label: "Notes", value: state.health?.medicalNotes ?? "" },
      ],
    },
    {
      stepKey: "preferences",
      label: "Preferences",
      editHref: "/start/preferences",
      fields: [
        {
          label: "Coaching",
          value: labelOf(COACHING_OPTIONS, state.preferences?.coachingFrequency),
        },
        {
          label: "Shipping",
          value: labelOf(CADENCE_OPTIONS, state.preferences?.deliveryCadence),
        },
        {
          label: "Channel",
          value: labelOf(COMMS_OPTIONS, state.preferences?.communicationChannel),
        },
      ],
    },
    {
      stepKey: "account",
      label: "Account",
      editHref: "/start/account",
      fields: [
        {
          label: "Name",
          value: `${state.account?.firstName ?? ""} ${state.account?.lastName ?? ""}`.trim(),
        },
        { label: "Email", value: state.account?.email ?? "" },
        { label: "Phone", value: state.account?.phone ?? "" },
      ],
    },
  ];

  return (
    <IntakeShell
      brandName={primeWellness.name}
      steps={INTAKE_STEPS}
      currentStep="review"
      completedSteps={done}
      eyebrow="Step 5 of 5"
      headline="Look right?"
      subhead="Edit any section before you submit. After submission your coach reaches out within one business day."
      backHref="/start/account"
    >
      <div className="flex flex-col gap-8">
        <IntakeReviewSummary sections={sections} />

        <form action={submitReview} className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
          >
            Submit intake
          </button>
        </form>
      </div>
    </IntakeShell>
  );
}
