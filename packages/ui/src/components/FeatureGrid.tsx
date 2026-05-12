import type { Money, Product } from "./types";

export type FeatureGridProps = {
  /** Section eyebrow above the headline. */
  eyebrow?: string;
  headline: string;
  /** Optional supporting paragraph below the headline. */
  subhead?: string;
  products: Product[];
};

/**
 * FeatureGrid — the canonical product / program grid. Server component.
 *
 * Visual differentiation across themes happens entirely through token-driven classes:
 * `rounded-card`, `border-card`, `shadow-card`, `aspect-hero`, etc.
 */
export function FeatureGrid({ eyebrow, headline, subhead, products }: FeatureGridProps) {
  return (
    <section className="w-full bg-background text-foreground">
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

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <li key={product.id} className="contents">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border-card border-border bg-background shadow-card transition-[transform,box-shadow] duration-DEFAULT ease-themed hover:-translate-y-[2px]">
      <div className="aspect-hero w-full overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.imageAlt ?? product.name}
            className="h-full w-full object-cover [filter:var(--filter-image)]"
          />
        ) : (
          <div
            aria-hidden
            className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgb(var(--color-brand)/0.18),transparent_60%),radial-gradient(circle_at_70%_70%,rgb(var(--color-accent)/0.18),transparent_60%)]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-stack p-6">
        {product.eyebrow ? (
          <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
            {product.eyebrow}
          </p>
        ) : null}

        <h3 className="font-display text-h3 text-foreground">{product.name}</h3>

        {product.description ? (
          <p className="text-body text-muted-foreground">{product.description}</p>
        ) : null}

        <PriceBlock price={product.price} />

        <a
          href={product.ctaHref}
          className="mt-2 inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,background-color,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {product.ctaLabel ?? "Add to program"}
        </a>
      </div>
    </article>
  );
}

function PriceBlock({ price }: { price: Product["price"] }) {
  // Doctrine: subscription is the default. If subscription exists, lead with it.
  const sub = price.subscription;
  const one = price.oneTime;

  return (
    <div className="mt-auto flex items-baseline gap-3 pt-2">
      {sub ? (
        <>
          <span className="font-display text-h2 text-foreground">
            {formatMoney(sub.monthly)}
            <span className="text-h3 text-muted-foreground">/mo</span>
          </span>
          {one ? (
            <span className="text-small text-muted-foreground line-through">
              {formatMoney(one)} one-time
            </span>
          ) : null}
        </>
      ) : one ? (
        <span className="font-display text-h2 text-foreground">{formatMoney(one)}</span>
      ) : null}
    </div>
  );
}

function formatMoney({ amount, currency }: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}
