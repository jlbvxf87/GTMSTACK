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
 * Prime Wellness storefront preview at `/preview/prime-wellness`.
 *
 * This is the demo operator storefront. Moved here from `/` once apps/marketing
 * became the real GTMStack pitch page. When apps/storefront ships (Sprint 7),
 * this content moves there and lives at `primewellness.gtmstack.shop` instead.
 */
export default function PrimeWellnessPreview() {
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
