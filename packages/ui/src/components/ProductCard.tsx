import type { Money, Product } from "./types";

export type ProductCardProps = {
  product: Product;
  /** Override default href; defaults to `/products/${product.slug}` when omitted. */
  href?: string;
};

/**
 * ProductCard — single product surface. Used by `FeatureGrid` and `RelatedProducts`.
 *
 * Server component. The whole card is a clickable link to the product page so the
 * inner CTA is visual-only (announces the action but doesn't double up the nav).
 */
export function ProductCard({ product, href }: ProductCardProps) {
  const detailHref = href ?? `/products/${product.slug}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border-card border-border bg-background shadow-card transition-[transform,box-shadow] duration-DEFAULT ease-themed hover:-translate-y-[2px]">
      <a href={detailHref} className="block" aria-label={`View ${product.name}`}>
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
      </a>

      <div className="flex flex-1 flex-col gap-stack p-6">
        {product.eyebrow ? (
          <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
            {product.eyebrow}
          </p>
        ) : null}

        <h3 className="font-display text-h3 text-foreground">
          <a href={detailHref} className="hover:text-brand transition-colors duration-DEFAULT ease-themed">
            {product.name}
          </a>
        </h3>

        {product.description ? (
          <p className="text-body text-muted-foreground">{product.description}</p>
        ) : null}

        <PriceBlock price={product.price} />

        <a
          href={detailHref}
          className="mt-2 inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,background-color,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {product.ctaLabel ?? "View program"}
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
