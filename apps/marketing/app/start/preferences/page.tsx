import { IntakeChoiceGroup, IntakeShell, primeWellness } from "@gtmstack/ui";

import { submitPreferences } from "../actions";
import {
  CADENCE_OPTIONS,
  COACHING_OPTIONS,
  COMMS_OPTIONS,
  INTAKE_STEPS,
  completedKeys,
  readIntakeState,
} from "../state";

export default async function PreferencesStep({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const state = await readIntakeState();
  const sp = (await searchParams) ?? {};
  const error = sp.error ? "Please choose an option for each row." : undefined;

  return (
    <IntakeShell
      brandName={primeWellness.name}
      steps={INTAKE_STEPS}
      currentStep="preferences"
      completedSteps={completedKeys(state)}
      eyebrow="Step 3 of 5"
      headline="How should we work together?"
      subhead="Pick what feels right. You can change any of this from your dashboard later."
      backHref="/start/health"
    >
      <form action={submitPreferences} className="flex flex-col gap-8">
        <IntakeChoiceGroup
          name="coachingFrequency"
          legend="Coach check-in cadence"
          required
          columns={1}
          options={COACHING_OPTIONS}
          defaultValue={state.preferences?.coachingFrequency}
        />

        <IntakeChoiceGroup
          name="deliveryCadence"
          legend="Shipping cadence"
          required
          columns={2}
          options={CADENCE_OPTIONS}
          defaultValue={state.preferences?.deliveryCadence}
        />

        <IntakeChoiceGroup
          name="communicationChannel"
          legend="How should we reach you?"
          required
          columns={3}
          options={COMMS_OPTIONS}
          defaultValue={state.preferences?.communicationChannel}
        />

        {error ? <p className="text-small text-destructive">{error}</p> : null}

        <div className="flex justify-between gap-3">
          <a
            href="/start/health"
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
