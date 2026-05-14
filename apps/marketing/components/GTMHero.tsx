/**
 * GTMStack landing hero — split layout. Copy left, operator-launch mockup
 * right. The image is a complete composition (Alex Morgan portrait + floating
 * product cards + cart panel + feature labels) so we just place it cleanly
 * with no overlay chrome — the image carries the visual weight.
 */
export function GTMHero({ operatorAppUrl }: { operatorAppUrl: string }) {
  return (
    <section
      id="platform"
      className="relative w-full overflow-hidden bg-white text-black"
    >
      <div className="relative mx-auto grid max-w-container grid-cols-1 gap-12 px-6 pt-16 pb-24 md:px-10 md:pt-24 md:pb-28 lg:grid-cols-12 lg:gap-12">
        {/* Left — headline + CTAs */}
        <div className="flex flex-col justify-center lg:col-span-6">
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
            Storefront, payments, AI, fulfillment — built in. You bring the
            audience.
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

        {/* Right — full-composed mockup, floating on the background. */}
        <div className="lg:col-span-6">
          <div className="relative">
            {/* Soft decorative blob behind the mockup — radial gradient
                fades to transparent so it reads as ambient depth, not a
                second card. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 45%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.04) 45%, rgba(0,0,0,0) 75%)",
                filter: "blur(40px)",
              }}
            />

            <img
              src="/brand/landing-hero.png"
              alt="A creator running their wellness business — phone storefront, product catalog, in-cart subscription checkout"
              className="relative block h-auto w-full"
              style={{
                filter:
                  "drop-shadow(0 30px 60px rgba(0,0,0,0.18)) drop-shadow(0 10px 20px rgba(0,0,0,0.08))",
              }}
            />
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
