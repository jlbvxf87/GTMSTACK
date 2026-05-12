import type { ProductDetailSection } from "./types";

export type ProductDetailsBlockProps = {
  eyebrow?: string;
  headline?: string;
  sections: ProductDetailSection[];
};

/**
 * ProductDetailsBlock — long-form product content. Server component.
 *
 * Renders an array of `{title, body}` sections stacked vertically inside a
 * narrow column for readability. The brief intentionally rejects tabbed UI
 * (would need client JS) in favor of a stacked layout that's more scannable
 * and gives operators free SEO weight on every section.
 */
export function ProductDetailsBlock({ eyebrow, headline, sections }: ProductDetailsBlockProps) {
  return (
    <section className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-section md:px-10">
        {eyebrow ? (
          <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        {headline ? (
          <h2 className="mb-12 font-display text-h1 text-foreground">{headline}</h2>
        ) : null}

        <div className="space-y-12">
          {sections.map((section) => (
            <article key={section.id}>
              <h3 className="font-display text-h2 text-foreground">{section.title}</h3>
              <p className="mt-stack max-w-prose text-body leading-[1.7] text-muted-foreground">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
