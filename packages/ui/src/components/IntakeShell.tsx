import type { ReactNode } from "react";
import { IntakeStepper } from "./IntakeStepper";
import type { IntakeStep, IntakeStepKey } from "./types";

export type IntakeShellProps = {
  /** Brand mark / company name shown at the top. */
  brandName: string;
  /** Link href for the brand mark. Defaults to "/". */
  brandHref?: string;
  /** Full list of steps. */
  steps: IntakeStep[];
  /** Active step. */
  currentStep: IntakeStepKey;
  /** Keys of completed steps. */
  completedSteps?: IntakeStepKey[];
  /** Title above the current step's content. */
  headline: string;
  /** Optional eyebrow above the title. */
  eyebrow?: string;
  /** Optional supporting paragraph under the title. */
  subhead?: ReactNode;
  /** Optional back-link target (e.g. previous step). */
  backHref?: string;
  children: ReactNode;
};

/**
 * IntakeShell — page chrome for every step. Server component.
 *
 * Layout: brand strip (top), stepper, narrow content column with title + form
 * area. Mobile collapses to a single column; the stepper switches to a compact
 * progress indicator. No site-wide nav or footer — intake is intentionally
 * focused.
 */
export function IntakeShell({
  brandName,
  brandHref = "/",
  steps,
  currentStep,
  completedSteps,
  headline,
  eyebrow,
  subhead,
  backHref,
  children,
}: IntakeShellProps) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-container items-center justify-between gap-inline px-6 py-5 md:px-10">
          <a href={brandHref} className="flex items-center gap-3" aria-label={`${brandName} home`}>
            <span className="font-display text-h3 leading-none text-foreground">{brandName}</span>
          </a>
          <a
            href={brandHref}
            className="font-body text-small text-muted-foreground transition-colors duration-DEFAULT ease-themed hover:text-foreground"
          >
            Save & exit
          </a>
        </div>
      </header>

      <div className="border-b border-border bg-muted">
        <div className="mx-auto max-w-container px-6 py-6 md:px-10 md:py-8">
          <IntakeStepper steps={steps} currentStep={currentStep} completedSteps={completedSteps} />
        </div>
      </div>

      <main>
        <div className="mx-auto max-w-3xl px-6 py-section md:px-10">
          {backHref ? (
            <a
              href={backHref}
              className="mb-stack inline-flex items-center gap-2 font-mono text-small uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-DEFAULT ease-themed hover:text-foreground"
            >
              <BackArrow />
              Back
            </a>
          ) : null}

          {eyebrow ? (
            <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="font-display text-h1 text-foreground">{headline}</h1>

          {subhead ? (
            <p className="mt-stack max-w-prose text-h3 text-muted-foreground">{subhead}</p>
          ) : null}

          <div className="mt-12">{children}</div>
        </div>
      </main>
    </div>
  );
}

function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
