import {
  BrandHero,
  FAQAccordion,
  ProgramDetails,
  SiteFooter,
  SiteHeader,
} from "@gtmstack/ui";

/**
 * GTMStack marketing landing — `gtmstack.com` in production, `localhost:3000`
 * in dev. Pitches the platform to potential operators.
 *
 * Composition uses the universal section library plus inline sections for the
 * pieces that don't yet exist as shared components (operator types grid,
 * template family preview cards, pricing tier cards).
 */
export default function GTMStackHome() {
  const operatorAppUrl =
    process.env.NEXT_PUBLIC_OPERATOR_URL ?? "http://localhost:3001";

  return (
    <>
      <SiteHeader
        brandName="GTMStack"
        links={[
          { label: "How it works", href: "#how" },
          { label: "Templates", href: "#templates" },
          { label: "Pricing", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
        ]}
        cta={{ label: "Start your stack", href: `${operatorAppUrl}/signup` }}
      />

      <main>
        <BrandHero
          brand={{ name: "GTMStack" }}
          eyebrow="Brand · Storefront · AI · Stack"
          headline="Launch a branded wellness business in hours."
          subhead="Bring your audience. We run the storefront, payments, AI customer ops, compliant fulfillment, provider network, and analytics. You operate the brand."
          primaryCta={{ label: "Start your stack", href: `${operatorAppUrl}/signup` }}
          secondaryCta={{ label: "See it live", href: "/preview/prime-wellness" }}
        />

        <OperatorTypesSection />

        <TemplateFamiliesSection />

        <ProgramDetails
          eyebrow="How it works"
          headline="From signup to live storefront in one session."
          subhead="The platform handles the parts that take six months to build alone. You focus on the audience and the brand."
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
              body: "Type a paragraph. Claude generates your tagline, hero copy, FAQ, voice register, and product positioning. Edit anything.",
            },
            {
              id: "3",
              label: "03",
              title: "Pick a template + products",
              body: "Choose Clinical, Wellness, or Community. Pick products from the marketplace. Set prices.",
            },
            {
              id: "4",
              label: "04",
              title: "Connect Stripe, launch",
              body: "Stripe Connect handles payouts, KYC, and 1099s. Your storefront goes live on your subdomain. Customers can subscribe within the hour.",
            },
          ]}
        />

        <PricingSection operatorAppUrl={operatorAppUrl} />

        <FAQAccordion
          eyebrow="Common questions"
          headline="Everything new operators ask in week one."
          subhead="More questions? hello@gtmstack.com."
          items={[
            {
              id: "q1",
              question: "What does GTMStack actually do for me?",
              answer:
                "We run the parts of a wellness business that take six months and $150k to build alone — storefront, payments, AI customer ops, compliant fulfillment, provider network for regulated products, and analytics. You bring the audience and the brand.",
            },
            {
              id: "q2",
              question: "Who pays whom?",
              answer:
                "Customers pay you directly via Stripe Connect. We never touch your funds. GTMStack collects a small platform fee (4-8% depending on plan) routed by Stripe at the moment of charge. Your bank sees the rest.",
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
                "You describe your brand in two or three sentences. Anthropic Claude generates a complete identity — tagline, hero copy, FAQ drafts, product positioning, voice register. You edit anything you don't love. Most operators ship after one regeneration.",
            },
            {
              id: "q5",
              question: "Can I bring my own products / distributors?",
              answer:
                "Sprint 7 adds partner-supplied catalogs. Today you list products from our curated marketplace. When you sign a pharmacy or supplement partner, we add their catalog as an adapter file — no platform changes required.",
            },
            {
              id: "q6",
              question: "Is there a free tier?",
              answer:
                "Yes — Starter is free with an 8% platform fee on transactions. Once you're doing meaningful revenue, the paid tiers cut the platform fee significantly. Run the math on your plan page.",
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
              { label: "How it works", href: "#how" },
              { label: "Templates", href: "#templates" },
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
    </>
  );
}

// ---------------------------------------------------------------------------
// Operator types section
// ---------------------------------------------------------------------------

function OperatorTypesSection() {
  const types = [
    {
      title: "Creators & influencers",
      eyebrow: "Fitness · wellness · longevity · biohacking",
      body: "Audiences in performance and biohacking want products from people they already trust. Skip the manufacturing and customer-service slog — bring the audience, GTMStack does the rest.",
    },
    {
      title: "Wellness coaches & practitioners",
      eyebrow: "Existing client books",
      body: "Productize your protocols. Members get a branded storefront for the supplements and programs you already recommend. You earn margin instead of referring revenue to Amazon.",
    },
    {
      title: "Med spas & hormone clinics",
      eyebrow: "In-person + direct-ship",
      body: "Extend your in-person revenue with branded direct-ship products. Provider-supervised peptides and hormones routed to licensed pharmacy partners — your patients never leave your brand.",
    },
    {
      title: "Fitness communities & gyms",
      eyebrow: "Community-led commerce",
      body: "Monetize your community with branded supplements and protocols. Subscription staples for the people who already wear your logo. Earn from the workflow you've already built.",
    },
    {
      title: "Healthcare providers & clinicians",
      eyebrow: "Branded patient programs",
      body: "Launch branded supplement lines or patient programs without standing up infrastructure. Compliant intake, provider-network routing, audit logs — built in.",
    },
  ];

  return (
    <section className="w-full bg-muted text-foreground">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <header className="mb-12 max-w-3xl">
          <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Built for
          </p>
          <h2 className="font-display text-h1 text-foreground">
            Five kinds of operator. One platform.
          </h2>
          <p className="mt-stack text-h3 text-muted-foreground">
            If you have an audience and a point of view in wellness, you can run a real business
            on GTMStack inside a single afternoon.
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
// Template families
// ---------------------------------------------------------------------------

function TemplateFamiliesSection() {
  const families = [
    {
      name: "Clinical Performance",
      eyebrow: "Provider-supervised",
      body: "Dark backgrounds. Electric accents. Sharp technical typography. For hormone, peptide, and longevity brands that compete on outcomes, not vibes. Pairs with the Clinical plan + partner provider network.",
      preview: "/preview/prime-wellness",
    },
    {
      name: "Wellness",
      eyebrow: "Editorial · warm",
      body: "Cream backgrounds. Sage and terracotta accents. Serif editorial headlines. For clinician-formulated supplement and program brands that compete on trust and care.",
      preview: "/preview/prime-wellness",
    },
    {
      name: "Community",
      eyebrow: "Athlete · direct",
      body: "Bold colors. Condensed type. Dense layouts. For gyms, training communities, and athlete-led brands that compete on transparency and earned results.",
      preview: "/preview/prime-wellness",
    },
  ];

  return (
    <section id="templates" className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <header className="mb-12 max-w-3xl">
          <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            One codebase, three brand languages
          </p>
          <h2 className="font-display text-h1 text-foreground">
            Templates that feel like different companies built them.
          </h2>
          <p className="mt-stack text-h3 text-muted-foreground">
            We ship the same conversion architecture in three theme families. Pick one in setup;
            switch at any time. Tokens drive everything — colors, typography, spacing, motion.
          </p>
        </header>

        <ul role="list" className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {families.map((f) => (
            <li
              key={f.name}
              className="flex h-full flex-col rounded-card border-card border-border bg-background p-6 shadow-card"
            >
              <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                {f.eyebrow}
              </p>
              <h3 className="mt-stack font-display text-h2 text-foreground">{f.name}</h3>
              <p className="mt-stack flex-1 text-body text-muted-foreground">{f.body}</p>
              <a
                href={f.preview}
                className="mt-stack inline-flex w-fit items-center font-mono text-small uppercase tracking-[0.16em] text-brand transition-colors duration-DEFAULT ease-themed hover:brightness-[0.85]"
              >
                See it live →
              </a>
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
      blurb: "Pay only when you sell. Sub-domain only. Solo operator. Full AI brand voice.",
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
      blurb: "Unlimited team. Priority support. Custom integrations. Lower transaction fee at scale.",
      cta: "Start Pro",
    },
    {
      name: "Clinical",
      price: "$1,499",
      sub: "/mo · 6% on MSO portion",
      blurb: "Required for peptides / hormones. Provider network access, intake compliance, audit logs, PHI handling.",
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
            Free until it works. Affordable when it does.
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
