import { BrandHero, ThemeProvider } from "@gtmstack/ui";

import { BrowserFrame } from "./BrowserFrame";

/**
 * Three live BrandHero mini-previews, one per theme family, rendered inside
 * stylized browser frames. Each preview uses nested ThemeProvider scopes so
 * the inner content renders in its theme's tokens while the outer page stays
 * in GTMStack's (wellness) theme.
 *
 * This is the section that replaces the previous text-only template cards.
 */
const PREVIEWS = [
  {
    name: "Clinical Performance",
    eyebrow: "Provider-supervised",
    body: "Dark backgrounds, electric accents, sharp typography. For hormone, peptide, and longevity brands competing on outcomes.",
    theme: "clinical" as const,
    brandName: "ApexRX",
    hero: {
      eyebrow: "Performance · Hormone · Longevity",
      headline: "Clinical-grade protocols, delivered.",
      subhead:
        "Provider-supervised hormone and recovery protocols. Every prescription reviewed by a licensed physician.",
    },
    previewHref: "/preview/prime-wellness",
    url: "apexrx.gtmstack.shop",
  },
  {
    name: "Wellness",
    eyebrow: "Editorial · warm",
    body: "Cream backgrounds, sage accents, serif headlines. For clinician-formulated supplement brands competing on trust.",
    theme: "wellness" as const,
    brandName: "Prime Wellness",
    hero: {
      eyebrow: "Recovery · Energy · Daily Performance",
      headline: "Built for the way real lives recover.",
      subhead:
        "A clinician-designed wellness stack delivered monthly. Subscribe once, track results, adjust with your coach.",
    },
    previewHref: "/preview/prime-wellness",
    url: "primewellness.gtmstack.shop",
  },
  {
    name: "Community",
    eyebrow: "Athlete · direct",
    body: "Bold colors, condensed type, dense layouts. For gyms, training communities, athlete-led brands.",
    theme: "community" as const,
    brandName: "Iron Reserve",
    hero: {
      eyebrow: "Built · Tested · Earned",
      headline: "Fuel the work. Earn the result.",
      subhead:
        "Honest panels, transparent dosing, batch-by-batch testing. No proprietary blends.",
    },
    previewHref: "/preview/prime-wellness",
    url: "ironreserve.gtmstack.shop",
  },
];

export function TemplatePreviewGrid() {
  return (
    <section id="templates" className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <header className="mb-12 max-w-3xl">
          <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            One codebase, three brand languages
          </p>
          <h2 className="font-display text-h1 text-foreground">
            Templates that feel like different companies.
          </h2>
          <p className="mt-stack text-h3 text-muted-foreground">
            Same conversion architecture, three theme families. Pick one in setup, switch anytime.
            Tokens drive every color, font, radius, and motion.
          </p>
        </header>

        <ul role="list" className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {PREVIEWS.map((p) => (
            <li key={p.name} className="flex h-full flex-col gap-4">
              <ThemeProvider theme={p.theme} as="div">
                <BrowserFrame url={p.url}>
                  <div className="origin-top-left scale-[0.62] sm:scale-[0.55] lg:scale-[0.5] xl:scale-[0.55] [transform-origin:top_left] w-[180%] sm:w-[182%] lg:w-[200%] xl:w-[182%]">
                    <BrandHero
                      brand={{ name: p.brandName }}
                      eyebrow={p.hero.eyebrow}
                      headline={p.hero.headline}
                      subhead={p.hero.subhead}
                      primaryCta={{ label: "Start program", href: "#" }}
                      secondaryCta={{ label: "Learn more", href: "#" }}
                    />
                  </div>
                </BrowserFrame>
              </ThemeProvider>

              <div className="flex flex-col gap-1">
                <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                  {p.eyebrow}
                </p>
                <h3 className="font-display text-h3 text-foreground">{p.name}</h3>
                <p className="text-body text-muted-foreground">{p.body}</p>
                <a
                  href={p.previewHref}
                  className="mt-1 inline-flex w-fit items-center font-mono text-small uppercase tracking-[0.16em] text-brand transition-colors duration-DEFAULT ease-themed hover:brightness-[0.85]"
                >
                  See it live →
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
