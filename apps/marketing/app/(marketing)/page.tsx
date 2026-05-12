import {
  BrandHero,
  FAQAccordion,
  FeatureGrid,
  ProgramDetails,
  SiteFooter,
  SiteHeader,
  SocialProof,
  primeWellness,
} from "@gtmstack/ui";

/**
 * Marketing home — composes all seven Sprint 2 universal sections in order.
 *
 * For Sprint 1/2 we render Prime Wellness branding here so the marketing site
 * doubles as a visible demo of the universal section library. Once apps/storefront
 * is scaffolded and Prime Wellness lives at primewellness.gtmstack.shop, this
 * page pivots to the actual gtmstack.com narrative (operator-type pitches,
 * template gallery, pricing). For now the goal is: see a complete operator
 * storefront, end to end, in the wellness theme.
 */
export default function MarketingHome() {
  const b = primeWellness;

  return (
    <>
      <SiteHeader brandName={b.name} links={b.nav} cta={b.navCta} />

      <main>
        <BrandHero
          brand={{ name: b.name }}
          eyebrow={b.eyebrow}
          headline={b.headline}
          subhead={b.subhead}
          primaryCta={b.primaryCta}
          secondaryCta={b.secondaryCta}
        />

        <FeatureGrid {...b.productSection} products={b.products} />

        <ProgramDetails {...b.programSection} />

        <SocialProof {...b.proofSection} />

        <FAQAccordion {...b.faqSection} />
      </main>

      <SiteFooter
        brandName={b.name}
        tagline={b.tagline}
        linkGroups={b.footerGroups}
        legalLinks={b.footerLegal}
        disclaimer={b.footerDisclaimer}
      />
    </>
  );
}
