/**
 * GTMStack hero — bold B&W premium direction.
 *
 * Right column: lifestyle photo at full column width. Two compact overlay
 * cards float at corners of the photo — analytics card top-right (where the
 * background is empty, not over the operator's face), peptide card bottom-
 * left (over the laptop / arms area, not the face). Cards are sized smaller
 * so they fit the photo cleanly without dominating it.
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

        {/* Right — full-width photo with compact card overlays */}
        <div className="lg:col-span-6">
          <div className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white">
              <img
                src="/brand/hero-operator.png"
                alt="Operator running their wellness business from a phone"
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 25%" }}
              />
            </div>

            {/* Analytics card — top-left corner, compact */}
            <div className="hidden md:block absolute top-4 left-4 w-[210px] rounded-2xl border border-black/10 bg-white p-4 shadow-2xl">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/50">
                Net revenue · this month
              </p>
              <p className="mt-0.5 font-body text-[26px] font-bold leading-none tracking-tight text-black">
                $24,560
              </p>
              <Sparkline />
              <div className="mt-3 grid grid-cols-2 gap-1.5 text-center">
                <Metric label="New subs" value="412" />
                <Metric label="Conversations" value="1,246" />
              </div>
            </div>

            {/* Peptide card — bottom-right corner, compact */}
            <div className="hidden md:block absolute bottom-4 right-4 w-[220px] rounded-2xl border border-black/10 bg-black p-4 text-white shadow-2xl">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">
                Featured program
              </p>
              <p className="mt-0.5 font-body text-h3 font-bold leading-tight tracking-tight">
                Peptide Program
              </p>
              <p className="mt-2 text-[12px] leading-snug text-white/70">
                Provider-supervised. Compounded by licensed 503A pharmacy partners.
              </p>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-body text-[26px] font-bold leading-none">$399</span>
                <span className="text-[12px] text-white/60">/mo</span>
              </div>
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
        <path
          d="M5 12l5 5 9-11"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-black py-1.5">
      <p className="font-body text-[13px] font-bold leading-none text-black">{value}</p>
      <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-black">
        {label}
      </p>
    </div>
  );
}

function Sparkline() {
  return (
    <svg viewBox="0 0 200 50" className="mt-2 h-7 w-full">
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
