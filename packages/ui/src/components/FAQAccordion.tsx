import type { FAQItem } from "./types";

export type FAQAccordionProps = {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  items: FAQItem[];
  /** If true, emit FAQPage JSON-LD for search engines. Defaults to true. */
  emitJsonLd?: boolean;
};

/**
 * FAQAccordion — server component. Uses the native HTML `<details>` / `<summary>`
 * for expand/collapse so there's no client JS and a11y comes for free.
 *
 * Optionally emits FAQPage JSON-LD so the section is search-discoverable.
 */
export function FAQAccordion({
  eyebrow,
  headline,
  subhead,
  items,
  emitJsonLd = true,
}: FAQAccordionProps) {
  return (
    <section className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-section md:px-10">
        <header className="mb-12">
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

        <ul role="list" className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <li key={item.id}>
              <details className="group py-6">
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-h3 text-foreground transition-colors duration-DEFAULT ease-themed hover:text-brand [&::-webkit-details-marker]:hidden"
                >
                  <span>{item.question}</span>
                  <Chevron />
                </summary>
                <p className="mt-stack max-w-prose text-body leading-[1.7] text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>

      {emitJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />
      ) : null}
    </section>
  );
}

function Chevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-muted-foreground transition-transform duration-DEFAULT ease-themed group-open:rotate-180 group-open:text-foreground"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
