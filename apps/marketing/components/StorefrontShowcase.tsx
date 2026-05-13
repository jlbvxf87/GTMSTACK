/**
 * Dark-themed storefront showcase. Mirrors the "Trusted by Brands · Optimize
 * Your Potential" panel from the user's mock — a dark premium card showing
 * what a clinical-tier operator's storefront looks like at glance.
 */
export function StorefrontShowcase({ operatorAppUrl }: { operatorAppUrl: string }) {
  return (
    <section className="w-full bg-white text-black">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="font-body text-small font-semibold uppercase tracking-[0.18em] text-black/50">
              Built for premium brands
            </p>
            <h2 className="mt-stack font-body text-[clamp(2rem,4vw+1rem,3.5rem)] font-bold leading-tight tracking-tight text-black">
              Storefronts that look like a brand, not a template.
            </h2>
            <p className="mt-stack max-w-lg text-h3 text-black/70">
              Three theme families. Token-driven. Same component, different brand. Operators ship
              storefronts that feel custom — without a designer or a code commit.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/preview/prime-wellness"
                className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-6 py-3 font-body font-semibold text-black transition-colors hover:bg-black/[0.04]"
              >
                Walk the storefront
              </a>
              <a
                href={`${operatorAppUrl}/signup`}
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 font-body font-semibold text-white transition-[transform,filter] hover:-translate-y-[1px] hover:brightness-110"
              >
                Start free
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-black/10 shadow-2xl">
              <img
                src="/brand/storefront-mock.png"
                alt="Sample storefront — Prime Wellness peptide program in clinical theme"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
