import { IntakeField, IntakeShell, primeWellness } from "@gtmstack/ui";

import { submitAccount } from "../actions";
import { INTAKE_STEPS, completedKeys, readIntakeState } from "../state";

export default async function AccountStep({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const state = await readIntakeState();
  const sp = (await searchParams) ?? {};
  const error = sp.error ? "Check the highlighted fields and try again." : undefined;

  return (
    <IntakeShell
      brandName={primeWellness.name}
      steps={INTAKE_STEPS}
      currentStep="account"
      completedSteps={completedKeys(state)}
      eyebrow="Step 4 of 5"
      headline="Where should we send things?"
      subhead="An email confirms your intake and an account; phone is optional and only used if you choose SMS for check-ins."
      backHref="/start/preferences"
    >
      <form action={submitAccount} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <IntakeField
            name="firstName"
            label="First name"
            required
            autoComplete="given-name"
            defaultValue={state.account?.firstName}
          />
          <IntakeField
            name="lastName"
            label="Last name"
            required
            autoComplete="family-name"
            defaultValue={state.account?.lastName}
          />
        </div>

        <IntakeField
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.account?.email}
          helperText="We send your confirmation and a coach intro here."
          error={error}
        />

        <IntakeField
          name="phone"
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          defaultValue={state.account?.phone}
          helperText="Only used if you picked SMS check-ins."
        />

        <div className="mt-4 flex justify-between gap-3">
          <a
            href="/start/preferences"
            className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-muted"
          >
            Back
          </a>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
          >
            Review
          </button>
        </div>
      </form>
    </IntakeShell>
  );
}
