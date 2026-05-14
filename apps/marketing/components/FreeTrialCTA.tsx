import { PrimaryCTA } from "./PrimaryCTA";

/**
 * Final pre-footer CTA. Stan-style: centered headline + a single oversize
 * pill button + supporting fine print. Light background to hand off cleanly
 * to the footer below.
 */
export function FreeTrialCTA({ operatorAppUrl }: { operatorAppUrl: string }) {
  return (
    <section className="relative w-full bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-section md:py-32">
        <div className="text-center">
          <h2 className="font-body text-[clamp(2.25rem,4.5vw+1rem,4rem)] font-bold leading-[1.05] tracking-tight text-black">
            Try GTMStack for 14 Days Free
          </h2>
          <p className="mt-4 text-h3 text-black/60">
            Launch your storefront, configure your brand voice, take your first
            order. No credit card to start.
          </p>

          <div className="mt-12 flex justify-center">
            <PrimaryCTA href={`${operatorAppUrl}/signup`}>
              Start My Trial
            </PrimaryCTA>
          </div>
        </div>
      </div>
    </section>
  );
}
