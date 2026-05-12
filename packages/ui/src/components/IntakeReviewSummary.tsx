import type { IntakeReviewSection } from "./types";

export type IntakeReviewSummaryProps = {
  sections: IntakeReviewSection[];
};

/**
 * IntakeReviewSummary — final-step review screen. Server component.
 *
 * Renders a card per prior step with an "Edit" link back to that step. Used
 * exactly once at `/start/review` before submission.
 */
export function IntakeReviewSummary({ sections }: IntakeReviewSummaryProps) {
  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <article
          key={section.stepKey}
          className="rounded-card border-card border-border bg-background p-6 shadow-card"
        >
          <header className="mb-stack flex items-center justify-between gap-stack">
            <h2 className="font-display text-h3 text-foreground">{section.label}</h2>
            <a
              href={section.editHref}
              className="font-mono text-small uppercase tracking-[0.16em] text-brand transition-colors duration-DEFAULT ease-themed hover:brightness-[0.85]"
            >
              Edit
            </a>
          </header>

          <dl className="grid grid-cols-1 gap-stack sm:grid-cols-[max-content_1fr] sm:gap-x-6">
            {section.fields.map((field) => (
              <div key={field.label} className="contents">
                <dt className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                  {field.label}
                </dt>
                <dd className="text-body text-foreground">{field.value || "—"}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}
