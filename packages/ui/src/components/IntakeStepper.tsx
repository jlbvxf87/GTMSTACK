import type { IntakeStep, IntakeStepKey } from "./types";

export type IntakeStepperProps = {
  steps: IntakeStep[];
  /** Key of the active step. */
  currentStep: IntakeStepKey;
  /** Keys of completed steps (rendered with a checkmark). */
  completedSteps?: IntakeStepKey[];
};

/**
 * IntakeStepper — top progress indicator. Server component.
 *
 * Renders one row per step on desktop, a compact "Step N of M" + dotted progress
 * on mobile. Tokens drive every color so it works in any theme.
 */
export function IntakeStepper({ steps, currentStep, completedSteps = [] }: IntakeStepperProps) {
  const completed = new Set(completedSteps);
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <nav aria-label="Intake progress" className="w-full">
      {/* Desktop / tablet */}
      <ol role="list" className="hidden gap-3 md:flex md:items-center">
        {steps.map((step, i) => {
          const state = stateOf(step.key, currentStep, completed);
          return (
            <li key={step.key} className="flex items-center gap-3">
              <Pill index={i + 1} state={state} label={step.label} hint={step.hint} />
              {i < steps.length - 1 ? (
                <span
                  aria-hidden
                  className={[
                    "h-px w-8 transition-colors duration-DEFAULT ease-themed",
                    completed.has(step.key) ? "bg-brand" : "bg-border",
                  ].join(" ")}
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      {/* Mobile */}
      <div className="md:hidden">
        <p className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
          Step {currentIndex + 1} of {steps.length}
        </p>
        <p className="mt-1 font-display text-h3 text-foreground">{steps[currentIndex]?.label}</p>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={currentIndex + 1}
          className="mt-3 flex gap-1.5"
        >
          {steps.map((step, i) => (
            <span
              key={step.key}
              className={[
                "h-1 flex-1 rounded-full transition-colors duration-DEFAULT ease-themed",
                i <= currentIndex || completed.has(step.key) ? "bg-brand" : "bg-border",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

function stateOf(
  key: IntakeStepKey,
  current: IntakeStepKey,
  completed: Set<IntakeStepKey>,
): "current" | "completed" | "upcoming" {
  if (key === current) return "current";
  if (completed.has(key)) return "completed";
  return "upcoming";
}

function Pill({
  index,
  state,
  label,
  hint,
}: {
  index: number;
  state: "current" | "completed" | "upcoming";
  label: string;
  hint?: string;
}) {
  return (
    <span className="flex items-center gap-3">
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-card transition-colors duration-DEFAULT ease-themed",
          state === "current"
            ? "border-brand bg-brand text-brand-foreground"
            : state === "completed"
              ? "border-brand/40 bg-brand/10 text-brand"
              : "border-border bg-background text-muted-foreground",
        ].join(" ")}
        aria-hidden
      >
        {state === "completed" ? <CheckIcon /> : <span className="font-mono text-small">{index}</span>}
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={[
            "font-body text-body transition-colors duration-DEFAULT ease-themed",
            state === "current" ? "text-foreground font-medium" : "text-muted-foreground",
          ].join(" ")}
        >
          {label}
        </span>
        {hint ? <span className="font-mono text-small text-muted-foreground">{hint}</span> : null}
      </span>
    </span>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12l5 5 9-11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
