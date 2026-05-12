import type { NavLink } from "./types";

export type SiteHeaderProps = {
  /** Brand name shown as text mark. If `logoUrl` provided, the image replaces text. */
  brandName: string;
  logoUrl?: string;
  /** Primary nav links. Render order preserved. */
  links: NavLink[];
  /** Right-aligned primary CTA. */
  cta: NavLink;
  /** Optional announcement bar text rendered above the nav. */
  announcement?: string;
  /** Stick to viewport top on scroll. Defaults to true. */
  sticky?: boolean;
};

/**
 * SiteHeader — universal top navigation. Server component, no interactive state.
 *
 * Mobile: nav links are hidden on `< md`; only brand + CTA remain. The hamburger
 * menu is intentionally out of scope until Sprint 6 (operator config) when nav
 * structure becomes operator-configurable and needs a client-side menu anyway.
 */
export function SiteHeader({
  brandName,
  logoUrl,
  links,
  cta,
  announcement,
  sticky = true,
}: SiteHeaderProps) {
  return (
    <header
      className={[
        "z-40 w-full border-b border-border bg-background/95 backdrop-blur",
        sticky ? "sticky top-0" : "",
      ].join(" ")}
    >
      {announcement ? (
        <div className="border-b border-border bg-muted">
          <div className="mx-auto max-w-container px-6 py-2 text-center font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            {announcement}
          </div>
        </div>
      ) : null}
      <div className="mx-auto flex max-w-container items-center justify-between gap-inline px-6 py-4 md:px-10">
        <a href="/" className="flex items-center gap-3" aria-label={`${brandName} home`}>
          {logoUrl ? (
            <img src={logoUrl} alt={`${brandName} logo`} className="h-8 w-auto" />
          ) : null}
          <span className="font-display text-h3 leading-none text-foreground">{brandName}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-body text-foreground/80 transition-colors duration-DEFAULT ease-themed hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={cta.href}
          className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,background-color,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {cta.label}
        </a>
      </div>
    </header>
  );
}
