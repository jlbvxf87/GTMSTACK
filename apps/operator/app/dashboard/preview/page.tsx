import { redirect } from "next/navigation";
import {
  BrandHero,
  FAQAccordion,
  FeatureGrid,
  SiteFooter,
  SiteHeader,
  ThemeProvider,
  demoBrands,
} from "@gtmstack/ui";

import { requireOperator } from "../../../lib/operator-session";

/**
 * /dashboard/preview — live storefront preview using the operator's brand
 * voice + selected products. This is what `app.gtmstack.com` shows when the
 * operator clicks "View storefront" from the dashboard.
 *
 * Sprint 6 V1: renders locally inside apps/operator using the same components
 * apps/storefront will eventually render. When apps/storefront ships (Sprint 7)
 * + DNS provisioning lights up, this same page logic moves over and the
 * subdomain finally resolves. Until then this is the operator's preview of
 * what customers will see.
 */
export default async function StorefrontPreview() {
  const session = await requireOperator();
  if (!session.onboarded || !session.brandVoice || !session.theme) {
    redirect("/dashboard");
  }

  const brand = session.brandName ?? "Your Brand";
  const v = session.brandVoice;
  const theme = session.theme;
  const catalog = demoBrands[theme].products;
  const products = catalog.filter((p) => session.productSlugs?.includes(p.slug));

  // Use a default theme-appropriate FAQ section header — the brand voice
  // generation already produced FAQ drafts, just need a section frame.
  const faqEyebrow = "Common questions";
  const faqHeadline = "Everything new members ask in week one.";

  return (
    <ThemeProvider theme={theme} as="div">
      <SiteHeader
        brandName={brand}
        links={[
          { label: "Programs", href: "#programs" },
          { label: "How it works", href: "#how" },
          { label: "Science", href: "#science" },
          { label: "Stories", href: "#stories" },
        ]}
        cta={{ label: "Start your program", href: "#start" }}
        announcement="Preview mode — this is what customers see"
      />

      <main>
        <BrandHero
          brand={{ name: brand }}
          eyebrow={v.eyebrow}
          headline={v.headline}
          subhead={v.subhead}
          primaryCta={{ label: "Start your program", href: "#start" }}
          secondaryCta={{ label: "How it works", href: "#how" }}
        />

        {products.length > 0 ? (
          <FeatureGrid
            eyebrow="The programs"
            headline="Built around what you actually want."
            subhead={v.tagline}
            products={products}
          />
        ) : null}

        {v.faqDrafts.length > 0 ? (
          <FAQAccordion
            eyebrow={faqEyebrow}
            headline={faqHeadline}
            items={v.faqDrafts.map((f, i) => ({
              id: String(i),
              question: f.question,
              answer: f.answer,
            }))}
            emitJsonLd={false}
          />
        ) : null}
      </main>

      <SiteFooter
        brandName={brand}
        tagline={v.tagline}
        linkGroups={[
          {
            heading: "Programs",
            links: products.map((p) => ({ label: p.name, href: "#" + p.slug })),
          },
          {
            heading: "Company",
            links: [
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" },
              { label: "Stories", href: "#stories" },
            ],
          },
          {
            heading: "Support",
            links: [
              { label: "Account", href: "#account" },
              { label: "FAQ", href: "#faq" },
              { label: "Shipping", href: "#shipping" },
            ],
          },
        ]}
        legalLinks={[
          { label: "Privacy", href: "#privacy" },
          { label: "Terms", href: "#terms" },
          { label: "Accessibility", href: "#a11y" },
        ]}
        disclaimer={
          theme === "clinical"
            ? `${brand} is a brand operator. Telehealth consultations are provided by independent licensed physicians. Compounded medications are dispensed by licensed 503A pharmacy partners. ${brand} does not prescribe, dispense, or compound.`
            : "Statements on this site have not been evaluated by the FDA. Products are not intended to diagnose, treat, cure, or prevent any disease. Brand operator owns marketing, education, and customer relationships. Licensed pharmacy and provider partners handle regulated review, dispensing, and fulfillment where required."
        }
      />
    </ThemeProvider>
  );
}
