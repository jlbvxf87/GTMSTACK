import type { Money, Product } from "./types";

export type ProductHeroProps = {
  product: Product;
  /** Short trust bullets rendered under the CTA. */
  trustLines?: string[];
  /** Primary CTA label (defaults to product.ctaLabel ?? "Add to program"). */
  ctaLabel?: string;
  /** Primary CTA href (defaults to product.ctaHref). */
  ctaHref?: string;
};

/**
 * ProductHero — the page's conversion surface. Server component.
 *
 * Two-column layout: gallery (left) + buy box (right) on desktop, stacked on mobile.
 *
 * Subscribe-vs-one-time is presented as native radio cards so users can change
 * selection without JS. Reactive price-on-toggle is intentionally deferred to
 * Sprint 5 when checkout state lands; for V1 the static price block shows the
 * subscription price first (doctrine: subscription is the default).
 */
export function ProductHero({ product, trustLines, ctaLabel, ctaHref }: ProductHeroProps) {
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : null;
  const heroImage = gallery?.[0]?.url ?? product.imageUrl;
  const heroAlt = gallery?.[0]?.alt ?? product.imageAlt ?? product.name;

  return (
    <section className="w-full bg-background text-foreground">
      <div className="mx-auto grid max-w-container grid-cols-1 gap-stack px-6 py-section md:grid-cols-12 md:gap-12 md:px-10">
        <Gallery
          heroImage={heroImage}
          heroAlt={heroAlt}
          thumbs={gallery ?? []}
          productName={product.name}
        />

        <BuyBox
          product={product}
          trustLines={trustLines}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
        />
      </div>
    </section>
  );
}

function Gallery({
  heroImage,
  heroAlt,
  thumbs,
  productName,
}: {
  heroImage: string | undefined;
  heroAlt: string;
  thumbs: NonNullable<Product["gallery"]>;
  productName: string;
}) {
  return (
    <div className="md:col-span-7">
      <div className="aspect-hero w-full overflow-hidden rounded-image border border-border bg-muted shadow-card">
        {heroImage ? (
          <img
            src={heroImage}
            alt={heroAlt}
            className="h-full w-full object-cover [filter:var(--filter-image)]"
          />
        ) : (
          <div
            aria-hidden
            className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgb(var(--color-brand)/0.22),transparent_60%),radial-gradient(circle_at_70%_70%,rgb(var(--color-accent)/0.22),transparent_60%)]"
          />
        )}
      </div>

      {thumbs.length > 1 ? (
        <ul role="list" className="mt-4 grid grid-cols-4 gap-3">
          {thumbs.slice(0, 4).map((img, i) => (
            <li key={img.url}>
              <div className="aspect-square w-full overflow-hidden rounded-image border border-border bg-muted">
                <img
                  src={img.url}
                  alt={img.alt ?? `${productName} view ${i + 1}`}
                  className="h-full w-full object-cover [filter:var(--filter-image)]"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function BuyBox({
  product,
  trustLines,
  ctaLabel,
  ctaHref,
}: {
  product: Product;
  trustLines?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const sub = product.price.subscription;
  const one = product.price.oneTime;
  const hasReviews = (product.reviewCount ?? product.reviews?.length ?? 0) > 0;
  const averageRating =
    product.averageRating ??
    (product.reviews?.length
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : undefined);
  const reviewCount = product.reviewCount ?? product.reviews?.length ?? 0;

  return (
    <div className="flex flex-col md:col-span-5">
      {product.eyebrow ? (
        <p className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
          {product.eyebrow}
        </p>
      ) : null}

      <h1 className="mt-stack font-display text-h1 text-foreground">{product.name}</h1>

      {hasReviews && typeof averageRating === "number" ? (
        <div className="mt-stack flex items-center gap-3">
          <StarRow rating={averageRating} />
          <span className="text-small text-muted-foreground">
            {averageRating.toFixed(1)} · {reviewCount} review{reviewCount === 1 ? "" : "s"}
          </span>
        </div>
      ) : null}

      {product.description ? (
        <p className="mt-stack max-w-prose text-h3 text-muted-foreground">{product.description}</p>
      ) : null}

      <fieldset className="mt-8 flex flex-col gap-3">
        <legend className="sr-only">Choose purchase option</legend>

        {sub ? (
          <PurchaseOption
            id="opt-sub"
            name="purchase-option"
            defaultChecked
            label="Subscribe & save"
            price={sub.monthly}
            cadence="/mo"
            note={
              sub.savingsPct ? `Save ${sub.savingsPct}% · pause anytime` : "Pause or cancel anytime"
            }
            badge="Recommended"
          />
        ) : null}

        {one ? (
          <PurchaseOption
            id="opt-one"
            name="purchase-option"
            defaultChecked={!sub}
            label="One-time"
            price={one}
            note="Single shipment"
          />
        ) : null}
      </fieldset>

      <a
        href={ctaHref ?? product.ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,background-color,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {ctaLabel ?? product.ctaLabel ?? "Add to program"}
      </a>

      {trustLines?.length ? (
        <ul role="list" className="mt-6 space-y-2 text-small text-muted-foreground">
          {trustLines.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <Check />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function PurchaseOption({
  id,
  name,
  defaultChecked,
  label,
  price,
  cadence,
  note,
  badge,
}: {
  id: string;
  name: string;
  defaultChecked?: boolean;
  label: string;
  price: Money;
  cadence?: string;
  note?: string;
  badge?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="group relative flex cursor-pointer items-start gap-4 rounded-card border-card border-border bg-background p-4 transition-colors duration-DEFAULT ease-themed has-[:checked]:border-brand has-[:checked]:bg-muted/40"
    >
      <input
        id={id}
        name={name}
        type="radio"
        defaultChecked={defaultChecked}
        className="peer mt-1 h-4 w-4 shrink-0 cursor-pointer accent-brand"
      />
      <span className="flex flex-1 flex-col gap-1">
        <span className="flex items-center justify-between gap-3">
          <span className="font-body font-medium text-foreground">{label}</span>
          {badge ? (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-small uppercase tracking-[0.16em] text-accent">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="flex items-baseline gap-2">
          <span className="font-display text-h3 text-foreground">
            {formatMoney(price)}
            {cadence ? (
              <span className="text-h3 text-muted-foreground">{cadence}</span>
            ) : null}
          </span>
        </span>
        {note ? <span className="text-small text-muted-foreground">{note}</span> : null}
      </span>
    </label>
  );
}

function StarRow({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div role="img" aria-label={`${clamped} out of 5 stars`} className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} filled={i < clamped} />
      ))}
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className={filled ? "text-accent" : "text-border"}>
      <path
        fill="currentColor"
        d="M12 17.27l5.18 3.04-1.64-5.81L20 9.97l-5.91-.51L12 4l-2.09 5.46L4 9.97l4.46 4.53-1.64 5.81L12 17.27z"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-[3px] shrink-0 text-brand">
      <path
        d="M5 12l5 5 9-11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatMoney({ amount, currency }: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}
