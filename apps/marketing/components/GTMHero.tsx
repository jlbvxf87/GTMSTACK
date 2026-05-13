/**
 * GTMStack hero — bold B&W direction matching the user's brand mock.
 *
 * Left column: oversized sans display headline, supporting subhead, two CTAs,
 * compliance/proof badges.
 *
 * Right column: lifestyle photo of an operator on phone + laptop, with a
 * compact analytics-card overlay (built from data, no static screenshot) and
 * a dark product card overlay using the storefront mock image.
 */
export function GTMHero({ operatorAppUrl }: { operatorAppUrl: string }) {
  return (
    <section id="platform" className="relative w-full overflow-hidden bg-white text-black">
      {/* Subtle background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto grid max-w-container grid-cols-1 gap-12 px-6 pt-16 pb-24 md:px-10 md:pt-24 md:pb-32 lg:grid-cols-12 lg:gap-8">
        {/* Left — headline + CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <p className="font-body text-small font-semibold uppercase tracking-[0.18em] text-black/50">
            AI-powered commerce infrastructure
          </p>

          <h1 className="mt-stack font-body text-[clamp(3rem,7vw+1rem,6.5rem)] font-bold leading-[0.95] tracking-tight text-black">
            Launch your <br />
            <span className="relative inline-block">
              business.
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-1 w-full bg-black/80"
              />
            </span>
            <br />
            We run the rest.
          </h1>

          <p className="mt-8 max-w-lg font-body text-h3 text-black/70">
            The all-in-one platform for clinic-style wellness brands.
            Storefront, payments, AI, fulfillment — built in. You bring the audience.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={`${operatorAppUrl}/signup`}
              className="inline-flex items-center justify-center rounded-full bg-black px-7 py-4 font-body font-semibold text-white transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Launch Your Business
            </a>
            <a
              href="#try"
              className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-7 py-4 font-body font-semibold text-black transition-colors hover:bg-black/[0.04]"
            >
              Try the AI brand voice
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-small text-black/60">
            <Badge>HIPAA-ready clinical tier</Badge>
            <Badge>Stripe Connect built in</Badge>
            <Badge>AI brand voice (Claude)</Badge>
            <Badge>Free to start</Badge>
          </div>
        </div>

        {/* Right — operator photo + mockup overlays */}
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-black/[0.04]">
            <img
              src="/brand/hero-operator.png"
              alt="Operator running their wellness business from a phone"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Floating analytics card — top right */}
          <div className="absolute right-0 top-6 hidden w-[280px] -translate-y-2 rounded-2xl border border-black/10 bg-white p-5 shadow-2xl md:block lg:right-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50">
              Net revenue · this month
            </p>
            <p className="mt-1 font-body text-[34px] font-bold leading-none tracking-tight text-black">
              $24,560
            </p>
            <Sparkline />
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <Metric label="New subs" value="412" />
              <Metric label="Conversations" value="1,246" />
            </div>
          </div>

          {/* Floating product card — bottom left, peptide aesthetic */}
          <div className="absolute -bottom-6 left-0 hidden w-[260px] rounded-2xl border border-black/10 bg-black p-5 text-white shadow-2xl md:block lg:-left-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
              Featured program
            </p>
            <p className="mt-1 font-body text-h3 font-bold tracking-tight">Peptide Program</p>
            <p className="mt-3 text-small text-white/70">
              Provider-supervised. Compounded by licensed 503A pharmacy partners.
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-body text-h2 font-bold">$399</span>
              <span className="text-small text-white/60">/mo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/[0.04] py-2">
      <p className="font-body text-body font-bold text-black">{value}</p>
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/50">{label}</p>
    </div>
  );
}

function Sparkline() {
  // Pure SVG mock sparkline — replace with real data when dashboard wires up.
  return (
    <svg viewBox="0 0 200 50" className="mt-3 h-10 w-full">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 35 L20 30 L40 32 L60 25 L80 28 L100 20 L120 22 L140 15 L160 12 L180 8 L200 4 L200 50 L0 50 Z"
        fill="url(#spark)"
      />
      <path
        d="M0 35 L20 30 L40 32 L60 25 L80 28 L100 20 L120 22 L140 15 L160 12 L180 8 L200 4"
        stroke="#000"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
