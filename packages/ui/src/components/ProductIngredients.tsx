import type { Ingredient } from "./types";

export type ProductIngredientsProps = {
  eyebrow?: string;
  headline?: string;
  /** Optional supporting paragraph above the table. */
  subhead?: string;
  ingredients: Ingredient[];
  /** Footer note rendered under the table (e.g. "Third-party tested, batch #..."). */
  footnote?: string;
};

/**
 * ProductIngredients — transparent ingredient panel. Server component.
 *
 * Renders a table of ingredient name / per-serving dose / role. No proprietary
 * blends — every ingredient shows its dose. Source / standardization can be
 * included as a second line under the name when set.
 */
export function ProductIngredients({
  eyebrow,
  headline,
  subhead,
  ingredients,
  footnote,
}: ProductIngredientsProps) {
  return (
    <section className="w-full bg-muted text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-section md:px-10">
        <header className="mb-12">
          {eyebrow ? (
            <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          {headline ? (
            <h2 className="font-display text-h1 text-foreground">{headline}</h2>
          ) : null}
          {subhead ? (
            <p className="mt-stack text-h3 text-muted-foreground">{subhead}</p>
          ) : null}
        </header>

        <div className="overflow-hidden rounded-card border-card border-border bg-background shadow-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th
                  scope="col"
                  className="px-6 py-4 font-mono text-small uppercase tracking-[0.16em] text-muted-foreground"
                >
                  Ingredient
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-mono text-small uppercase tracking-[0.16em] text-muted-foreground"
                >
                  Per serving
                </th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, i) => (
                <tr
                  key={ing.id}
                  className={
                    i === ingredients.length - 1 ? "" : "border-b border-border"
                  }
                >
                  <td className="px-6 py-5 align-top">
                    <div className="font-display text-h3 leading-tight text-foreground">
                      {ing.name}
                    </div>
                    {ing.source ? (
                      <div className="mt-1 text-small text-muted-foreground">{ing.source}</div>
                    ) : null}
                    {ing.role ? (
                      <p className="mt-stack max-w-prose text-body text-muted-foreground">
                        {ing.role}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <span className="font-display text-h3 text-foreground">{ing.dose}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {footnote ? (
          <p className="mt-6 text-small leading-[1.7] text-muted-foreground">{footnote}</p>
        ) : null}
      </div>
    </section>
  );
}
