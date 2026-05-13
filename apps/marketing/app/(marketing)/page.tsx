import { FAQAccordion, SiteFooter } from "@gtmstack/ui";

import { GTMHeader } from "../../components/GTMHeader";
import { GTMHero } from "../../components/GTMHero";
import { StatsStrip } from "../../components/StatsStrip";
import { LaunchSteps } from "../../components/LaunchSteps";
import { TemplatePreviewGrid } from "../../components/TemplatePreviewGrid";
import { StorefrontShowcase } from "../../components/StorefrontShowcase";
import { TryBrandVoice } from "../../components/TryBrandVoice";
import { StickyCTA } from "../../components/StickyCTA";

/**
 * GTMStack marketing landing — `gtmstack.com` in prod.
 *
 * Sprint 6.8: bold B&W brand direction matching the user's mock. Real
 * lifestyle photo + step-pyramid logo + dark CTA. Premium typography.
 */
export default function GTMStackHome() {
  const operatorAppUrl =
    process.env.NEXT_PUBLIC_OPERATOR_URL ?? "http://localhost:3001";

  return (
    <div className="bg-white text-black">
      <GTMHeader operatorAppUrl={operatorAppUrl} />

      <main>
        <GTMHero operatorAppUrl={operatorAppUrl} />

        <StatsStrip />

        <LaunchSteps />

        <StorefrontShowcase operatorAppUrl={operatorAppUrl} />

        <OperatorTypesSection />

        <TemplatePreviewGrid />

        <TryBrandVoice operatorAppUrl={operatorAppUrl} />

        <PricingSection operatorAppUrl={operatorAppUrl} />

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
                "Yes — Starter is free with an 8% platform fee on transactions. Once you're doing meaningful revenue, paid tiers cut the platform fee. Math is on the pricing section.",
            },
          ]}
        />
      </main>

      <SiteFooter
        brandName="GTMStack"
        tagline="The business deployment engine for branded wellness commerce."
        linkGroups={[
          {
            heading: "Platform",
            links: [
              { label: "How it works", href: "#platform" },
              { label: "Examples", href: "#templates" },
              { label: "Try it", href: "#try" },
              { label: "Pricing", href: "#pricing" },
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
  );
}

// ---------------------------------------------------------------------------
// Operator types (bold B&W styling)
// ---------------------------------------------------------------------------

function OperatorTypesSection() {
  const types = [
    {
      title: "Creators & influencers",
      eyebrow: "Fitness · wellness · longevity",
      body: "Audiences in performance want products from people they trust. Bring the audience; we run the rest.",
    },
    {
      title: "Wellness coaches",
      eyebrow: "Existing client books",
      body: "Productize your protocols. Members get a branded storefront for what you already recommend.",
    },
    {
      title: "Med spas & hormone clinics",
      eyebrow: "In-person + direct-ship",
      body: "Extend in-person revenue with branded direct-ship products. Provider-supervised peptides via licensed pharmacy partners.",
    },
    {
      title: "Fitness communities & gyms",
      eyebrow: "Community-led commerce",
      body: "Monetize the people already wearing your logo. Subscription staples for the room you've built.",
    },
    {
      title: "Healthcare providers",
      eyebrow: "Branded patient programs",
      body: "Launch branded supplements or patient programs without standing up infrastructure. Compliance built in.",
    },
  ];

  return (
    <section className="w-full bg-white text-black">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <p className="font-body text-small font-semibold uppercase tracking-[0.18em] text-black/50">
          Built for
        </p>
        <h2 className="mt-stack font-body text-[clamp(2rem,4vw+1rem,3.5rem)] font-bold leading-tight tracking-tight text-black max-w-3xl">
          Five kinds of operator. One platform.
        </h2>

        <ul role="list" className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {types.map((t) => (
            <li
              key={t.title}
              className="rounded-3xl border border-black/10 bg-white p-6 transition-shadow hover:shadow-xl"
            >
              <p className="font-mono text-small uppercase tracking-[0.16em] text-black/50">
                {t.eyebrow}
              </p>
              <h3 className="mt-stack font-body text-h3 font-bold tracking-tight text-black">
                {t.title}
              </h3>
              <p className="mt-stack text-body text-black/70">{t.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing (bold B&W styling)
// ---------------------------------------------------------------------------

function PricingSection({ operatorAppUrl }: { operatorAppUrl: string }) {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      sub: "8% platform fee",
      blurb: "Pay only when you sell. Sub-domain. Solo operator. Full AI brand voice.",
      cta: "Start free",
    },
    {
      name: "Growth",
      price: "$199",
      sub: "/mo · 5% fee",
      blurb: "Custom domain. Up to 3 team members. Full AI. Real Stripe Connect onboarding.",
      cta: "Start Growth",
      recommended: true,
    },
    {
      name: "Pro",
      price: "$499",
      sub: "/mo · 4% fee",
      blurb: "Unlimited team. Priority support. Custom integrations. Lower fee at scale.",
      cta: "Start Pro",
    },
    {
      name: "Clinical",
      price: "$1,499",
      sub: "/mo · 6% MSO",
      blurb: "Peptides / hormones unlocked. Provider network, intake compliance, audit logs, PHI.",
      cta: "Start Clinical",
    },
  ];

  return (
    <section id="pricing" className="w-full bg-white text-black">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <p className="font-body text-small font-semibold uppercase tracking-[0.18em] text-black/50">
          Pricing
        </p>
        <h2 className="mt-stack font-body text-[clamp(2rem,4vw+1rem,3.5rem)] font-bold leading-tight tracking-tight text-black max-w-3xl">
          Free until it works.
        </h2>
        <p className="mt-stack max-w-2xl text-h3 text-black/70">
          Higher tiers cut the platform fee. Most operators graduate to Growth in their first
          three months.
        </p>

        <ul role="list" className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <li
              key={p.name}
              className={[
                "flex h-full flex-col rounded-3xl border bg-white p-6 transition-shadow",
                p.recommended ? "border-black shadow-2xl" : "border-black/10 hover:shadow-xl",
              ].join(" ")}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-body text-h2 font-bold tracking-tight text-black">{p.name}</h3>
                {p.recommended ? (
                  <span className="rounded-full bg-black px-2.5 py-0.5 font-mono text-small uppercase tracking-[0.16em] text-white">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-stack font-body text-h1 font-bold tracking-tight text-black">
                {p.price}
                <span className="text-h3 font-normal text-black/60">{p.sub}</span>
              </p>
              <p className="mt-stack flex-1 text-body text-black/70">{p.blurb}</p>
              <a
                href={`${operatorAppUrl}/signup`}
                className={[
                  "mt-stack inline-flex items-center justify-center rounded-full px-5 py-3 font-body font-semibold transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-110",
                  p.recommended
                    ? "bg-black text-white"
                    : "border border-black/15 bg-white text-black hover:bg-black/[0.04]",
                ].join(" ")}
              >
                {p.cta}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
