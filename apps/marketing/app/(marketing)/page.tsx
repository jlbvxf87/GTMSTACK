import {
  BrandHero,
  FeatureGrid,
  SiteFooter,
  SiteHeader,
} from "@gtmstack/ui";

/**
 * Marketing home. Composed from the universal section library so the same
 * sequence works for any operator theme — wellness here (Prime Wellness as
 * the canonical demo brand per docs/CLAUDE.md).
 *
 * Sprint 2 in-flight: header, hero, feature grid, footer in place.
 * Sprint 2 remaining: ProgramDetails, SocialProof, FAQAccordion.
 */
export default function MarketingHome() {
  const brand = { name: "Prime Wellness" } as const;

  return (
    <>
      <SiteHeader
        brandName={brand.name}
        links={[
          { label: "Programs", href: "#programs" },
          { label: "How it works", href: "#how" },
          { label: "Science", href: "#science" },
          { label: "Stories", href: "#stories" },
        ]}
        cta={{ label: "Start Your Program", href: "#start" }}
      />

      <main>
        <BrandHero
          brand={brand}
          eyebrow="Recovery · Energy · Daily Performance"
          headline="Recovery, energy, and daily performance — in one program."
          subhead="A clinician-designed wellness stack delivered monthly. Subscribe once, track results, adjust with your coach."
          primaryCta={{ label: "Start Your Program", href: "#start" }}
          secondaryCta={{ label: "How it works", href: "#how" }}
        />

        <FeatureGrid
          eyebrow="The Programs"
          headline="Built for the way real lives recover."
          subhead="Three stacks. One subscription. Each formulation reviewed by our clinical advisors and shipped to your door."
          products={[
            {
              id: "daily-greens",
              name: "Daily Greens",
              eyebrow: "Daily foundation",
              description:
                "Adaptogenic greens blend with B-complex, magnesium glycinate, and a clinical-dose ashwagandha.",
              price: {
                oneTime: { amount: 4900, currency: "USD" },
                subscription: {
                  monthly: { amount: 3900, currency: "USD" },
                  savingsPct: 20,
                },
              },
              ctaHref: "#daily-greens",
            },
            {
              id: "sleep-stack",
              name: "Sleep Stack",
              eyebrow: "Recovery evenings",
              description:
                "Glycine, l-theanine, and magnesium threonate for nights that actually restore. Coach check-ins included.",
              price: {
                subscription: { monthly: { amount: 7900, currency: "USD" } },
              },
              ctaHref: "#sleep-stack",
            },
            {
              id: "recovery-kit",
              name: "Recovery Kit",
              eyebrow: "Training-day support",
              description:
                "Collagen peptides, electrolyte mineral matrix, and a creatine + tart cherry recovery blend.",
              price: {
                oneTime: { amount: 12900, currency: "USD" },
                subscription: { monthly: { amount: 9900, currency: "USD" } },
              },
              ctaHref: "#recovery-kit",
            },
          ]}
        />
      </main>

      <SiteFooter
        brandName={brand.name}
        tagline="Clinician-designed wellness programs delivered monthly."
        linkGroups={[
          {
            heading: "Programs",
            links: [
              { label: "Daily Greens", href: "#daily-greens" },
              { label: "Sleep Stack", href: "#sleep-stack" },
              { label: "Recovery Kit", href: "#recovery-kit" },
            ],
          },
          {
            heading: "Company",
            links: [
              { label: "Our Clinical Team", href: "#team" },
              { label: "Science", href: "#science" },
              { label: "Stories", href: "#stories" },
              { label: "Contact", href: "#contact" },
            ],
          },
          {
            heading: "Support",
            links: [
              { label: "Account", href: "#account" },
              { label: "Shipping & returns", href: "#shipping" },
              { label: "FAQ", href: "#faq" },
            ],
          },
        ]}
        legalLinks={[
          { label: "Privacy", href: "#privacy" },
          { label: "Terms", href: "#terms" },
          { label: "Accessibility", href: "#a11y" },
        ]}
        disclaimer="Statements on this site have not been evaluated by the FDA. Products are not intended to diagnose, treat, cure, or prevent any disease. Brand operator owns marketing, education, and customer relationships. Licensed pharmacy and provider partners handle regulated review, dispensing, and fulfillment where required."
      />
    </>
  );
}
