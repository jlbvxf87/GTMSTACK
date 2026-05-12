/**
 * Onboarding steps — single source of truth for the operator setup flow.
 * Mirrors apps/marketing's intake steps shape so the stepper component is
 * shared.
 */

import type { IntakeStep, IntakeStepKey } from "@gtmstack/ui";

/**
 * We reuse @gtmstack/ui's IntakeStepKey type but only the first four keys
 * match our operator flow; we override labels at render time.
 */
export type OnboardingStepKey = "vertical" | "brand" | "catalog" | "plan" | "launch";

/** Use a separate set of constants — the operator stepper passes mapped IntakeStep[] in. */
export const ONBOARDING_STEPS: { key: OnboardingStepKey; label: string; hint: string; href: string }[] = [
  { key: "vertical", label: "Vertical", hint: "What you sell", href: "/onboarding/vertical" },
  { key: "brand",    label: "Brand",    hint: "Your voice, generated", href: "/onboarding/brand" },
  { key: "catalog",  label: "Catalog",  hint: "What you list", href: "/onboarding/catalog" },
  { key: "plan",     label: "Plan",     hint: "Payouts + tier", href: "/onboarding/plan" },
  { key: "launch",   label: "Launch",   hint: "Go live", href: "/onboarding/launch" },
];

/**
 * Adapter for the existing IntakeStepper component — re-uses its UI by
 * mapping our onboarding keys onto IntakeStepKey slots. The stepper doesn't
 * care about the semantics of "goals"/"health"/etc; it just renders the
 * label and uses the key for completion tracking.
 */
const STEP_KEY_BY_INDEX: IntakeStepKey[] = [
  "goals",
  "health",
  "preferences",
  "account",
  "review",
];

export function intakeStepsForOperator(): IntakeStep[] {
  return ONBOARDING_STEPS.map((s, i) => ({
    key: STEP_KEY_BY_INDEX[i]!,
    label: s.label,
    hint: s.hint,
  }));
}

export function currentIntakeKey(key: OnboardingStepKey): IntakeStepKey {
  const idx = ONBOARDING_STEPS.findIndex((s) => s.key === key);
  return STEP_KEY_BY_INDEX[idx] ?? "goals";
}

export function completedIntakeKeysFor(
  completed: OnboardingStepKey[],
): IntakeStepKey[] {
  return completed.map((k) => {
    const idx = ONBOARDING_STEPS.findIndex((s) => s.key === k);
    return STEP_KEY_BY_INDEX[idx]!;
  });
}

export function nextStepHref(current: OnboardingStepKey): string {
  const idx = ONBOARDING_STEPS.findIndex((s) => s.key === current);
  if (idx === -1 || idx === ONBOARDING_STEPS.length - 1) return "/dashboard";
  return ONBOARDING_STEPS[idx + 1]!.href;
}
