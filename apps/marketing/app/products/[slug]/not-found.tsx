import { primeWellness, SiteFooter, SiteHeader } from "@gtmstack/ui";

export default function NotFound() {
  return (
    <>
      <SiteHeader
        brandName={primeWellness.name}
        links={primeWellness.nav}
        cta={primeWellness.navCta}
      />
      <main className="w-full bg-background text-foreground">
        <div className="mx-auto max-w-container px-6 py-section md:px-10">
          <p className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            404
          </p>
          <h1 className="mt-stack font-display text-h1 text-foreground">
            That program isn't on the shelf.
          </h1>
          <p className="mt-stack max-w-prose text-h3 text-muted-foreground">
            The product you're looking for either moved or never existed. Browse the current
            lineup from the homepage.
          </p>
          <a
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
          >
            Back to all programs
          </a>
        </div>
      </main>
      <SiteFooter
        brandName={primeWellness.name}
        tagline={primeWellness.tagline}
        linkGroups={primeWellness.footerGroups}
        legalLinks={primeWellness.footerLegal}
        disclaimer={primeWellness.footerDisclaimer}
      />
    </>
  );
}
