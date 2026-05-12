import type { ReactNode } from "react";

export type BrandHeroCta = {
  label: string;
  href: string;
};

export type BrandHeroBrand = {
  /** Display name. */
  name: string;
  /** Optional logo URL — if provided, rendered above the eyebrow. */
  logoUrl?: string;
};

export type BrandHeroProps = {
  brand: BrandHeroBrand;
  eyebrow?: string;
  headline: string;
  subhead?: ReactNode;
  primaryCta: BrandHeroCta;
  secondaryCta?: BrandHeroCta;
  /** Optional hero image. Square / portrait / landscape — the aspect comes from the active theme. */
  imageUrl?: string;
  imageAlt?: string;
};

/**
 * BrandHero — Sprint 1 deliverable. Server component, theme-aware via tokens only.
 *
 * Visual differentiation across clinical / wellness / community is achieved entirely through
 * the token system (radius, type scale, spacing, colors, motion). No theme-name branches.
 */
export function BrandHero({
  brand,
  eyebrow,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  imageUrl,
  imageAlt,
}: BrandHeroProps) {
  return (
    <section className="w-full bg-background text-foreground">
      <div className="mx-auto grid max-w-container grid-cols-1 gap-stack px-6 py-section md:grid-cols-12 md:gap-10 md:px-10">
        <div className="md:col-span-7 md:pr-8 flex flex-col justify-center">
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              className="mb-stack h-8 w-auto self-start"
            />
          ) : null}

          {eyebrow ? (
            <p className="mb-stack text-small font-mono uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="font-display text-display text-foreground">
            {headline}
          </h1>

          {subhead ? (
            <p className="mt-stack max-w-prose text-h3 text-muted-foreground">
              {subhead}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-inline">
            <a
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,background-color,box-shadow,filter] duration-DEFAULT ease-themed hover:brightness-[1.05] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {primaryCta.label}
            </a>
            {secondaryCta ? (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {secondaryCta.label}
              </a>
            ) : null}
          </div>

          <p className="mt-8 text-small text-muted-foreground">
            {brand.name}
          </p>
        </div>

        <div className="md:col-span-5 flex items-center">
          <div className="w-full overflow-hidden rounded-image border border-border bg-muted shadow-card aspect-hero">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageAlt ?? ""}
                className="h-full w-full object-cover [filter:var(--filter-image)]"
              />
            ) : (
              <div
                aria-hidden
                className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgb(var(--color-brand)/0.18),transparent_60%),radial-gradient(circle_at_70%_70%,rgb(var(--color-accent)/0.18),transparent_60%)]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
