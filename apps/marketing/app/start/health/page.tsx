import { IntakeChoiceGroup, IntakeField, IntakeShell, primeWellness } from "@gtmstack/ui";

import { submitHealth } from "../actions";
import {
  ACTIVITY_LEVEL_OPTIONS,
  AGE_OPTIONS,
  INTAKE_STEPS,
  SLEEP_OPTIONS,
  completedKeys,
  readIntakeState,
} from "../state";

export default async function HealthStep({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const state = await readIntakeState();
  const sp = (await searchParams) ?? {};
  const error = sp.error ? "Please fill out the required fields." : undefined;

  return (
    <IntakeShell
      brandName={primeWellness.name}
      steps={INTAKE_STEPS}
      currentStep="health"
      completedSteps={completedKeys(state)}
      eyebrow="Step 2 of 5"
      headline="A quick snapshot of you."
      subhead="This isn't a medical intake — just enough context that the coach can recommend the right starting cadence."
      backHref="/start"
    >
      <form action={submitHealth} className="flex flex-col gap-8">
        <IntakeChoiceGroup
          name="age"
          legend="Age range"
          required
          columns={3}
          options={AGE_OPTIONS}
          defaultValue={state.health?.age}
        />

        <IntakeChoiceGroup
          name="activityLevel"
          legend="Activity level"
          required
          columns={3}
          options={ACTIVITY_LEVEL_OPTIONS}
          defaultValue={state.health?.activityLevel}
        />

        <IntakeChoiceGroup
          name="sleepQuality"
          legend="Sleep, on most nights"
          required
          columns={1}
          options={SLEEP_OPTIONS}
          defaultValue={state.health?.sleepQuality}
        />

        <IntakeField
          name="medicalNotes"
          label="Anything we should know? (optional)"
          multiline
          rows={4}
          helperText="Allergies, current medications, conditions. Coach review only — never shared."
          defaultValue={state.health?.medicalNotes}
          error={error}
          maxLength={1000}
        />

        <div className="flex justify-between gap-3">
          <a
            href="/start"
            className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-muted"
          >
            Back
          </a>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
          >
            Continue
          </button>
        </div>
      </form>
    </IntakeShell>
  );
}
