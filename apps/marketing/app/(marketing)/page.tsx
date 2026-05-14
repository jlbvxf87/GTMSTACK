import { FAQAccordion, SiteFooter } from "@gtmstack/ui";

import { GTMHeader } from "../../components/GTMHeader";
import { GTMHero } from "../../components/GTMHero";
import { GTMLandingThemeProvider } from "../../components/GTMLandingThemeProvider";
import { StatsStrip } from "../../components/StatsStrip";
import { ImageStorySection } from "../../components/ImageStorySection";
import { TryBrandVoice } from "../../components/TryBrandVoice";
import { StickyCTA } from "../../components/StickyCTA";

/**
 * GTMStack marketing landing — `gtmstack.com` in prod.
 *
 * Sprint 8.5 polish: rebuilt around the user's six designed mocks
 * (Marketing/ folder). Hero is a split layout with copy left + the operator-
 * launch mockup right. The remaining four mocks are pre-composed full
 * sections — they already carry their own internal headlines and product
 * framing baked into the image — so we present them as clean full-bleed
 * stories with minimal chrome on top.
 */
export default function GTMStackHome() {
  const operatorAppUrl =
    process.env.NEXT_PUBLIC_OPERATOR_URL ?? "http://localhost:3001";

  return (
    <GTMLandingThemeProvider>
      <div className="bg-white text-black">
        <GTMHeader operatorAppUrl={operatorAppUrl} />

        <main>
          <GTMHero operatorAppUrl={operatorAppUrl} />

          <StatsStrip />

          {/* Top operators — Sophie Turner + Ethan Pace mockups */}
          <ImageStorySection
            id="founders"
            eyebrow="Top operators run on GTMStack"
            headline="Built for founders who already have the audience."
            subhead="Wellness coaches, performance founders, recovery clinics — different brands, same infrastructure underneath. You bring the trust; we run the business."
            imageSrc="/brand/landing-founders.png"
            imageAlt="Two GTMStack-powered storefronts — Sophie Strong (wellness) and Ethan Pace (performance) — running on real operator brands"
            tone="neutral"
          />

          {/* Platform feature mosaic — "Not just another link in bio" */}
          <ImageStorySection
            id="features"
            imageSrc="/brand/landing-platform.png"
            imageAlt="Dashboard, AI customer support, smart storefront, secure checkout, email + SMS, order fulfillment, real-time analytics — all the moving parts AI handles for the operator"
          />

          {/* 3-step launch flow */}
          <ImageStorySection
            id="steps"
            eyebrow="From idea to revenue"
            headline="Three steps. Not three months."
            subhead="Pick your vertical. Configure your brand. Hit launch. The storefront is live, payments route, AI starts drafting customer responses — same day."
            imageSrc="/brand/landing-steps.png"
            imageAlt="Three-step launch — premium storefront, 1-tap subscription checkout, full stack connected end-to-end"
            tone="neutral"
            cta={{ label: "Launch your business", href: `${operatorAppUrl}/signup` }}
          />

          {/* Try the brand voice — interactive AI demo */}
          <TryBrandVoice operatorAppUrl={operatorAppUrl} />

          {/* Testimonials / social proof */}
          <ImageStorySection
            id="testimonials"
            imageSrc="/brand/landing-testimonials.png"
            imageAlt="What operators are saying — revenue screenshots, founder quotes, before/after audience monetization"
            tone="neutral"
          />

          <FAQAccordion
            eyebrow="Common questions"
            headline="Everything operators ask in week one."
            subhead="More? hello@gtmstack.com."
            items={[
              {
                id: "q1",
                question: "What does GTMStack actually do for me?",
                answer:
                  "We run the parts of a wellness business that take six months and $150k to build alone — storefront, payments, AI customer ops, compliant fulfillment, provider network for regulated products, analytics. You bring audience and brand.",
              },
              {
                id: "q2",
                question: "Who pays whom?",
                answer:
                  "Customers pay you directly via Stripe Connect. GTMStack never touches your funds. We collect a small platform fee (4–8% depending on plan) routed by Stripe at charge time. Your bank sees the rest.",
              },
              {
                id: "q3",
                question: "Do I need to be a licensed clinician?",
                answer:
                  "No. You're the brand and audience layer. For clinical products (peptides, hormones, GLP-1) we route prescriptions through licensed physician partners and 503A compounding pharmacies. You never prescribe or dispense.",
              },
              {
                id: "q4",
                question: "How does the AI brand voice work?",
                answer:
                  "Describe your brand in 2–3 sentences. Claude generates a complete identity — tagline, hero copy, FAQ drafts, product positioning, voice register. Edit anything. Most operators ship after one regeneration.",
              },
              {
                id: "q5",
                question: "Can I bring my own products / distributors?",
                answer:
                  "Yes — partner-supplied catalogs slot in as adapter files. Today you list from our curated marketplace; when you sign a pharmacy or supplement partner, their catalog plugs in without platform changes.",
              },
              {
                id: "q6",
                question: "Is there a free tier?",
                answer:
                  "Yes — Starter is free with an 8% platform fee on transactions. Once you're doing meaningful revenue, paid tiers cut the platform fee.",
              },
            ]}
          />

          {/* Final dark CTA */}
          <section id="pricing" className="w-full bg-black text-white">
            <div className="mx-auto max-w-container px-6 py-section md:px-10 md:py-32">
              <p className="font-body text-small font-semibold uppercase tracking-[0.18em] text-white/60">
                Your turn
              </p>
              <h2 className="mt-stack max-w-3xl font-body text-[clamp(2.5rem,5vw+1rem,5rem)] font-bold leading-[0.98] tracking-tight">
                Launch the business you've been describing.
              </h2>
              <p className="mt-6 max-w-2xl font-body text-h3 text-white/70">
                Pick a vertical, configure your brand voice, list the products
                you'll sell, and connect Stripe. You can be taking real orders
                in under an hour.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href={`${operatorAppUrl}/signup`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 font-body font-semibold text-black transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-95"
                >
                  Start free
                </a>
                <a
                  href="/preview/prime-wellness"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-7 py-4 font-body font-semibold text-white transition-colors hover:bg-white/[0.06]"
                >
                  See a live storefront
                </a>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter
          brandName="GTMStack"
          tagline="The business deployment engine for branded wellness commerce."
          linkGroups={[
            {
              heading: "Platform",
              links: [
                { label: "How it works", href: "#platform" },
                { label: "Operators", href: "#founders" },
                { label: "Stories", href: "#testimonials" },
                { label: "Try it", href: "#try" },
              ],
            },
            {
              heading: "Operator",
              links: [
                { label: "Start your stack", href: `${operatorAppUrl}/signup` },
                { label: "Log in", href: `${operatorAppUrl}/login` },
              ],
            },
            {
              heading: "Demo",
              links: [
                { label: "Prime Wellness storefront", href: "/preview/prime-wellness" },
                { label: "Sleep Stack product page", href: "/products/sleep-stack" },
                { label: "Intake flow", href: "/start" },
              ],
            },
            {
              heading: "Company",
              links: [{ label: "Contact", href: "mailto:hello@gtmstack.com" }],
            },
          ]}
          legalLinks={[
            { label: "Privacy", href: "#privacy" },
            { label: "Terms", href: "#terms" },
          ]}
          disclaimer="GTMStack is a platform infrastructure provider. Operators are the brand layer; licensed partners handle regulated review, dispensing, and fulfillment where required. Statements on operator storefronts have not been evaluated by the FDA."
        />

        <StickyCTA href={`${operatorAppUrl}/signup`} label="Launch Your Business" />
      </div>
    </GTMLandingThemeProvider>
  );
}
