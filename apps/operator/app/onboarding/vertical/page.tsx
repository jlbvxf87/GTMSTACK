import { redirect } from "next/navigation";
import { IntakeChoiceGroup, IntakeShell } from "@gtmstack/ui";

import { requireOperator, writeOperatorSession } from "../../../lib/operator-session";
import {
  completedIntakeKeysFor,
  currentIntakeKey,
  intakeStepsForOperator,
  nextStepHref,
} from "../../../lib/onboarding-steps";

/**
 * Step 1 — pick vertical / template family. Drives every later step:
 * theme tokens, AI brand voice tone, default product catalog, available
 * SaaS tiers (clinical-only products require the clinical plan).
 */
export default async function VerticalStep({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await requireOperator();
  const sp = (await searchParams) ?? {};
  const error = sp.error ? "Pick a vertical to continue." : undefined;

  return (
    <IntakeShell
      brandName={session.brandName ?? "GTMStack"}
      brandHref="/dashboard"
      steps={intakeStepsForOperator()}
      currentStep={currentIntakeKey("vertical")}
      completedSteps={completedIntakeKeysFor([])}
      eyebrow="Step 1 of 5"
      headline="Which vertical fits your brand?"
      subhead="Pick the template family. This drives the design system, AI brand voice tone, and which products you can list. You can revisit this in settings later."
    >
      <form action={submit} className="flex flex-col gap-8">
        <IntakeChoiceGroup
          name="theme"
          legend="Pick one"
          required
          columns={1}
          defaultValue={session.theme}
          options={[
            {
              value: "wellness",
              label: "Wellness",
              description:
                "Supplements, daily routines, recovery stacks. Warm editorial design, serif headlines. No prescription products. Lowest compliance complexity.",
            },
            {
              value: "clinical",
              label: "Clinical Performance",
              description:
                "Hormone protocols, peptides, GLP-1, longevity diagnostics. Provider-supervised, 503A-fulfilled. Requires Clinical tier + signed partner.",
            },
            {
              value: "community",
              label: "Community",
              description:
                "Athletes, gyms, fitness communities. Bold direct design, transparent dosing. Subscription staples and crew programming.",
            },
          ]}
          error={error}
        />

        <div className="flex justify-between gap-3">
          <a
            href="/signup"
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

async function submit(formData: FormData): Promise<void> {
  "use server";
  const theme = String(formData.get("theme") ?? "");
  if (theme !== "wellness" && theme !== "clinical" && theme !== "community") {
    redirect("/onboarding/vertical?error=1");
  }
  await writeOperatorSession({ theme });
  redirect(nextStepHref("vertical"));
}
