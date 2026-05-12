import type { FooterLinkGroup, NavLink } from "./types";

export type SiteFooterProps = {
  brandName: string;
  logoUrl?: string;
  /** One-sentence brand tagline rendered under the brand mark. */
  tagline?: string;
  /** Column-based link groups. 3–5 columns recommended. */
  linkGroups: FooterLinkGroup[];
  /** Legal / utility links shown in the small bar at the bottom. */
  legalLinks?: NavLink[];
  /**
   * Compliance disclaimer text. Per doctrine: storefront operator owns brand /
   * acquisition; licensed partners handle dispensing / fulfillment / regulated
   * review. This wording MUST be reviewed by compliance before customer-facing launch.
   * TODO(compliance): review.
   */
  disclaimer?: string;
};

/**
 * SiteFooter — universal site footer. Server component.
 *
 * Sections:
 * - Brand block (logo + tagline + optional social row in the future).
 * - 3–5 link columns.
 * - Compliance disclaimer (operator / partner role separation).
 * - Legal bar (copyright + small links).
 */
export function SiteFooter({
  brandName,
  logoUrl,
  tagline,
  linkGroups,
  legalLinks,
  disclaimer,
}: SiteFooterProps) {
  return (
    <footer className="w-full border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt={`${brandName} logo`} className="h-8 w-auto" />
              ) : null}
              <span className="font-display text-h3 leading-none text-foreground">{brandName}</span>
            </div>
            {tagline ? (
              <p className="mt-stack max-w-xs text-body text-muted-foreground">{tagline}</p>
            ) : null}
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 md:grid-cols-4"
          >
            {linkGroups.map((group) => (
              <div key={group.heading}>
                <h3 className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
                  {group.heading}
                </h3>
                <ul role="list" className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-body text-foreground/80 transition-colors duration-DEFAULT ease-themed hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {disclaimer ? (
          <p className="mt-12 max-w-3xl text-small leading-[1.7] text-muted-foreground">
            {disclaimer}
          </p>
        ) : null}

        <div className="mt-12 flex flex-col items-start justify-between gap-stack border-t border-border pt-8 md:flex-row md:items-center">
          <p className="text-small text-muted-foreground">
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          {legalLinks?.length ? (
            <ul role="list" className="flex flex-wrap gap-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-small text-muted-foreground transition-colors duration-DEFAULT ease-themed hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
