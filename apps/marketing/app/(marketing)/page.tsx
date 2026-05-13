import { FAQAccordion, ProgramDetails, SiteFooter, SiteHeader } from "@gtmstack/ui";

import { HeroWithMockup } from "../../components/HeroWithMockup";
import { TemplatePreviewGrid } from "../../components/TemplatePreviewGrid";
import { TryBrandVoice } from "../../components/TryBrandVoice";
import { StickyCTA } from "../../components/StickyCTA";

/**
 * GTMStack marketing landing — `gtmstack.com` in prod, `localhost:3000` in dev.
 *
 * Sprint 6.7 polish: live BrandHero mockup in hero, live mini-previews for
 * the three template families, inline AI brand-voice demo, sticky CTA.
 */
export default function GTMStackHome() {
  const operatorAppUrl =
    process.env.NEXT_PUBLIC_OPERATOR_URL ?? "http://localhost:3001";

  return (
    <>
      <SiteHeader
        brandName="GTMStack"
        links={[
          { label: "Templates", href: "#templates" },
          { label: "Try it", href: "#try" },
          { label: "How it works", href: "#how" },
          { label: "Pricing", href: "#pricing" },
        ]}
        cta={{ label: "Start your stack", href: `${operatorAppUrl}/signup` }}
      />

      <main>
        <HeroWithMockup operatorAppUrl={operatorAppUrl} />

        <ProofStrip />

        <OperatorTypesSection />

        <TemplatePreviewGrid />

        <TryBrandVoice operatorAppUrl={operatorAppUrl} />

        <ProgramDetails
          eyebrow="How it works"
          headline="From signup to live storefront in one session."
          subhead="The platform handles the parts that take six months alone. You focus on the audience and the brand."
          steps={[
            {
              id: "1",
              label: "01",
              title: "Sign up",
              body: "Email + password. We provision your operator account and organization in the background.",
            },
            {
              id: "2",
              label: "02",
              title: "Describe your brand",
              body: "Type a paragraph. Claude generates tagline, hero copy, FAQ, voice register, product positioning. Edit anything.",
            },
            {
              id: "3",
              label: "03",
              title: "Pick template + products",
              body: "Clinical, Wellness, or Community. Pick from the marketplace. Set prices.",
            },
            {
              id: "4",
              label: "04",
              title: "Connect Stripe, launch",
              body: "Stripe Connect handles payouts, KYC, 1099s. Storefront live on your subdomain in minutes.",
            },
          ]}
        />

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
                "Customers pay you directly via Stripe Connect. GTMStack never touches your funds. We collect a small platform fee (4-8% depending on plan) routed by Stripe at charge time. Your bank sees the rest.",
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
                "Describe your brand in 2-3 sentences. Claude generates a complete identity — tagline, hero copy, FAQ drafts, product positioning, voice register. Edit anything. Most operators ship after one regeneration.",
            },
            {
              id: "q5",
              question: "Can I bring my own products / distributors?",
              answer:
                "Sprint 7 adds partner-supplied catalogs. Today you list from our curated marketplace. When you sign a pharmacy or supplement partner, we add their catalog as an adapter file — no platform changes.",
            },
            {
              id: "q6",
              question: "Is there a free tier?",
              answer:
                "Yes — Starter is free with an 8% platform fee on transactions. Once you're doing meaningful revenue, paid tiers cut the platform fee. Math is on the pricing page.",
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
              { label: "Templates", href: "#templates" },
              { label: "Try it", href: "#try" },
              { label: "How it works", href: "#how" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
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

      <StickyCTA href={`${operatorAppUrl}/signup`} label="Start your stack" />
    </>
  );
}

// ---------------------------------------------------------------------------
// Proof strip
// ---------------------------------------------------------------------------

function ProofStrip() {
  const items = [
    { label: "Built on", value: "Stripe Connect" },
    { label: "Powered by", value: "Anthropic Claude" },
    { label: "Hosted on", value: "Vercel + Supabase" },
    { label: "Compliant via", value: "Licensed pharmacy partners" },
  ];
  return (
    <section className="w-full border-y border-border bg-muted text-foreground">
      <div className="mx-auto max-w-container px-6 py-10 md:px-10">
        <ul role="list" className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((it) => (
            <li key={it.label} className="flex flex-col">
              <span className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
                {it.label}
              </span>
              <span className="mt-1 font-display text-h3 text-foreground">{it.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Operator types
// ---------------------------------------------------------------------------

function OperatorTypesSection() {
  const types = [
    {
      title: "Creators & influencers",
      eyebrow: "Fitness · wellness · longevity · biohacking",
      body: "Audiences in performance want products from people they trust. Bring the audience; we run the rest.",
    },
    {
      title: "Wellness coaches & practitioners",
      eyebrow: "Existing client books",
      body: "Productize your protocols. Members get a branded storefront for what you already recommend. Earn margin, not Amazon's.",
    },
    {
      title: "Med spas & hormone clinics",
      eyebrow: "In-person + direct-ship",
      body: "Extend your in-person revenue with branded direct-ship products. Provider-supervised peptides routed to licensed pharmacy partners.",
    },
    {
      title: "Fitness communities & gyms",
      eyebrow: "Community-led commerce",
      body: "Monetize the people already wearing your logo. Subscription staples for the room you've already built.",
    },
    {
      title: "Healthcare providers",
      eyebrow: "Branded patient programs",
      body: "Launch branded supplements or patient programs without standing up infrastructure. Compliant intake, audit logs, PHI handling.",
    },
  ];

  return (
    <section className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <header className="mb-12 max-w-3xl">
          <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Built for
          </p>
          <h2 className="font-display text-h1 text-foreground">
            Five kinds of operator. One platform.
          </h2>
          <p className="mt-stack text-h3 text-muted-foreground">
            Audience and point of view? You can run a real business on GTMStack inside an afternoon.
          </p>
        </header>

        <ul role="list" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {types.map((t) => (
            <li
              key={t.title}
              className="rounded-card border-card border-border bg-background p-6 shadow-card"
            >
              <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                {t.eyebrow}
              </p>
              <h3 className="mt-stack font-display text-h3 text-foreground">{t.title}</h3>
              <p className="mt-stack text-body text-muted-foreground">{t.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing
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
      sub: "/mo · 5% platform fee",
      blurb: "Custom domain. Up to 3 team members. Full AI. Real Stripe Connect onboarding.",
      cta: "Start Growth",
      recommended: true,
    },
    {
      name: "Pro",
      price: "$499",
      sub: "/mo · 4% platform fee",
      blurb: "Unlimited team. Priority support. Custom integrations. Lower fee at scale.",
      cta: "Start Pro",
    },
    {
      name: "Clinical",
      price: "$1,499",
      sub: "/mo · 6% on MSO portion",
      blurb: "Peptides / hormones unlocked. Provider network, intake compliance, audit logs, PHI.",
      cta: "Start Clinical",
    },
  ];

  return (
    <section id="pricing" className="w-full bg-muted text-foreground">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <header className="mb-12 max-w-3xl">
          <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Pricing
          </p>
          <h2 className="font-display text-h1 text-foreground">
            Free until it works.
          </h2>
          <p className="mt-stack text-h3 text-muted-foreground">
            Higher tiers cut the platform fee. Most operators graduate to Growth in their first
            three months.
          </p>
        </header>

        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <li
              key={p.name}
              className={[
                "flex h-full flex-col rounded-card border-card bg-background p-6 shadow-card",
                p.recommended ? "border-brand" : "border-border",
              ].join(" ")}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-h2 text-foreground">{p.name}</h3>
                {p.recommended ? (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-small uppercase tracking-[0.16em] text-accent">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-stack font-display text-h1 text-foreground">
                {p.price}
                <span className="text-h3 text-muted-foreground">{p.sub}</span>
              </p>
              <p className="mt-stack flex-1 text-body text-muted-foreground">{p.blurb}</p>
              <a
                href={`${operatorAppUrl}/signup`}
                className={[
                  "mt-stack inline-flex items-center justify-center rounded-button px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]",
                  p.recommended
                    ? "bg-brand text-brand-foreground"
                    : "border border-border bg-background text-foreground hover:bg-muted",
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
