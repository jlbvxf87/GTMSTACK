import type { ProgramStep } from "./types";

export type ProgramDetailsProps = {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  steps: ProgramStep[];
};

/**
 * ProgramDetails — "how it works" / value-props section. Server component.
 *
 * Renders a row of numbered steps. Steps lay out in a single column on mobile,
 * 2-up on tablet, full row on desktop. The large step `label` is rendered in
 * the display family so the theme's typography choice is unmistakable.
 */
export function ProgramDetails({ eyebrow, headline, subhead, steps }: ProgramDetailsProps) {
  return (
    <section className="w-full bg-muted text-foreground">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <header className="mb-12 max-w-3xl">
          {eyebrow ? (
            <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-h1 text-foreground">{headline}</h2>
          {subhead ? (
            <p className="mt-stack text-h3 text-muted-foreground">{subhead}</p>
          ) : null}
        </header>

        <ol
          role="list"
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <li
              key={step.id}
              className="flex flex-col gap-stack rounded-card border-card border-border bg-background p-6 shadow-card"
            >
              <span
                aria-hidden
                className="font-display text-h1 leading-none text-brand"
              >
                {step.label}
              </span>
              <h3 className="font-display text-h3 text-foreground">{step.title}</h3>
              <p className="text-body text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
