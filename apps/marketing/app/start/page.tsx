import { IntakeChoiceGroup, IntakeShell, primeWellness } from "@gtmstack/ui";

import { submitGoals } from "./actions";
import {
  FOCUS_AREA_OPTIONS,
  INTAKE_STEPS,
  PRIMARY_GOAL_OPTIONS,
  completedKeys,
  readIntakeState,
} from "./state";

export default async function GoalsStep({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const state = await readIntakeState();
  const sp = (await searchParams) ?? {};
  const error = sp.error ? "Pick a primary goal and at least one focus area." : undefined;

  return (
    <IntakeShell
      brandName={primeWellness.name}
      steps={INTAKE_STEPS}
      currentStep="goals"
      completedSteps={completedKeys(state)}
      eyebrow="Step 1 of 5"
      headline="What do you want from the program?"
      subhead="There's no wrong answer. We'll tune your stack and coach cadence to whatever you pick — and you can adjust anytime."
    >
      <form action={submitGoals} className="flex flex-col gap-8">
        <IntakeChoiceGroup
          name="primaryGoal"
          legend="Pick one primary goal"
          required
          options={PRIMARY_GOAL_OPTIONS}
          defaultValue={state.goals?.primaryGoal}
          columns={2}
        />

        <IntakeChoiceGroup
          name="goals"
          legend="Other focus areas (pick any)"
          multiple
          helperText="We use these to round out the program around your primary goal."
          options={FOCUS_AREA_OPTIONS}
          defaultValue={state.goals?.goals}
          columns={3}
          error={error}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Continue
          </button>
        </div>
      </form>
    </IntakeShell>
  );
}
