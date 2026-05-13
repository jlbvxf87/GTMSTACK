import type { Metadata } from "next";
import {
  BrandHero,
  FAQAccordion,
  FeatureGrid,
  SiteFooter,
  SiteHeader,
  ThemeProvider,
} from "@gtmstack/ui";

import { hydrateProducts, resolveStorefront } from "../lib/operator-resolver";

/**
 * Storefront home — operator-branded.
 *
 * The operator is resolved per request from the subdomain (prod) or
 * `?operator=` query param (dev). Brand voice + products + theme all
 * come from the operator's Supabase rows. Same Sprint 2 components, real
 * tenant data.
 */

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sp = (await searchParams) ?? {};
  const ctx = await resolveStorefront({ searchParams: sp });
  if (!ctx) return { title: "GTMStack Storefront" };
  const v = ctx.storefront.brand_voice;
  return {
    title: `${ctx.operator.brand_name ?? ctx.organization.name}`,
    description: v?.subhead ?? v?.tagline ?? undefined,
  };
}

export default async function StorefrontHome({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const ctx = await resolveStorefront({ searchParams: sp });
  if (!ctx) {
    return <NoOperatorFound />;
  }

  const brand = ctx.operator.brand_name ?? ctx.organization.name;
  const theme = ctx.storefront.theme;
  const v = ctx.storefront.brand_voice;
  const products = hydrateProducts(ctx);

  // Operator-specific copy is in brand_voice. If it's missing (a freshly-
  // signed-up operator who skipped or hasn't completed the brand step),
  // fall through with placeholders that point them back to onboarding.
  if (!v) {
    return <BrandVoicePending brandName={brand} />;
  }

  // Nav links scroll within the page for now. /products/[slug] for product
  // pages, /start for clinical-tier intake.
  const navLinks = [
    { label: "Programs", href: "#programs" },
    { label: "How it works", href: "#how" },
    { label: "Stories", href: "#stories" },
    { label: "FAQ", href: "#faq" },
  ];

  const cta = {
    label: products[0]?.requiresProviderReview ? "Start intake" : "Start program",
    href: products[0]?.requiresProviderReview
      ? "/start"
      : `/products/${products[0]?.slug ?? ""}`,
  };

  return (
    <ThemeProvider theme={theme} as="div">
      <SiteHeader brandName={brand} links={navLinks} cta={cta} />

      <main>
        <BrandHero
          brand={{ name: brand }}
          eyebrow={v.eyebrow}
          headline={v.headline}
          subhead={v.subhead}
          primaryCta={cta}
          secondaryCta={{ label: "How it works", href: "#how" }}
        />

        {products.length > 0 ? (
          <div id="programs">
            <FeatureGrid
              eyebrow="The Programs"
              headline="Built for the way you actually live."
              subhead={v.tagline}
              products={products}
            />
          </div>
        ) : null}

        {v.faqDrafts.length > 0 ? (
          <div id="faq">
            <FAQAccordion
              eyebrow="Common questions"
              headline="Everything new members ask in week one."
              items={v.faqDrafts.map((f, i) => ({
                id: String(i),
                question: f.question,
                answer: f.answer,
              }))}
              emitJsonLd={false}
            />
          </div>
        ) : null}
      </main>

      <SiteFooter
        brandName={brand}
        tagline={v.tagline}
        linkGroups={[
          {
            heading: "Programs",
            links: products.map((p) => ({
              label: p.name,
              href: `/products/${p.slug}`,
            })),
          },
          {
            heading: "Company",
            links: [
              { label: "Contact", href: "#contact" },
              { label: "Stories", href: "#stories" },
            ],
          },
          {
            heading: "Account",
            links: [
              { label: "Sign in", href: "/account/login" },
              { label: "Create account", href: "/account/signup" },
            ],
          },
        ]}
        legalLinks={[
          { label: "Privacy", href: "#privacy" },
          { label: "Terms", href: "#terms" },
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

// ---------------------------------------------------------------------------
// Empty / pending states
// ---------------------------------------------------------------------------

function NoOperatorFound() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-section md:px-10">
        <p className="font-mono text-small uppercase tracking-[0.18em] text-black/50">
          Storefront not found
        </p>
        <h1 className="mt-stack font-body text-[clamp(2rem,4vw+1rem,3.5rem)] font-bold leading-tight tracking-tight">
          No operator at this URL.
        </h1>
        <p className="mt-stack max-w-prose text-h3 text-black/70">
          This subdomain isn't connected to a GTMStack operator yet. If you're an
          operator, head to your dashboard. Otherwise, try{" "}
          <a href="https://gtmstack.com" className="underline">
            gtmstack.com
          </a>{" "}
          to see what GTMStack is.
        </p>
      </main>
    </div>
  );
}

function BrandVoicePending({ brandName }: { brandName: string }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-section md:px-10">
        <p className="font-mono text-small uppercase tracking-[0.18em] text-black/50">
          {brandName} · storefront pending
        </p>
        <h1 className="mt-stack font-body text-[clamp(2rem,4vw+1rem,3.5rem)] font-bold leading-tight tracking-tight">
          Your brand voice hasn't been generated yet.
        </h1>
        <p className="mt-stack max-w-prose text-h3 text-black/70">
          Head back to your operator dashboard, finish the Brand step, and your
          storefront will go live here.
        </p>
      </main>
    </div>
  );
}
