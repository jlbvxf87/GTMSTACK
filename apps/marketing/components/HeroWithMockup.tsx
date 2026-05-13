import { BrandHero, ThemeProvider } from "@gtmstack/ui";

import { BrowserFrame } from "./BrowserFrame";

/**
 * GTMStack hero — left-side pitch + right-side live storefront mockup
 * inside a browser frame. The mockup is a real `<BrandHero>` rendered with
 * Prime Wellness branding, scoped to its own ThemeProvider so the outer
 * page tokens are not disturbed.
 *
 * On mobile the mockup stacks below the headline.
 */
export function HeroWithMockup({
  operatorAppUrl,
}: {
  operatorAppUrl: string;
}) {
  return (
    <section className="w-full bg-background text-foreground">
      <div className="mx-auto grid max-w-container grid-cols-1 gap-12 px-6 py-section md:px-10 lg:grid-cols-12">
        {/* Left — pitch */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <p className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Brand · Storefront · AI · Stack
          </p>
          <h1 className="mt-stack font-display text-display text-foreground">
            Launch your wellness brand in hours.
          </h1>
          <p className="mt-stack max-w-prose text-h3 text-muted-foreground">
            You bring the audience. We run the storefront, payments, AI customer ops, compliant
            fulfillment, and provider network. One paragraph in, one storefront out.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-inline">
            <a
              href={`${operatorAppUrl}/signup`}
              className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start your stack — free
            </a>
            <a
              href="#try"
              className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-muted"
            >
              Try the AI brand voice
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-small text-muted-foreground">
            <li className="flex items-center gap-2">
              <Dot /> Free until you sell
            </li>
            <li className="flex items-center gap-2">
              <Dot /> Stripe Connect — your bank
            </li>
            <li className="flex items-center gap-2">
              <Dot /> 3 theme families
            </li>
            <li className="flex items-center gap-2">
              <Dot /> Clinical tier — provider-supervised
            </li>
          </ul>
        </div>

        {/* Right — live mockup */}
        <div className="lg:col-span-6 flex items-center">
          <ThemeProvider theme="wellness" as="div" className="w-full">
            <BrowserFrame url="primewellness.gtmstack.shop">
              <div className="origin-top-left scale-[0.7] [transform-origin:top_left] w-[143%]">
                <BrandHero
                  brand={{ name: "Prime Wellness" }}
                  eyebrow="Recovery · Energy · Daily Performance"
                  headline="Built for the way real lives recover."
                  subhead="A clinician-designed wellness stack delivered monthly."
                  primaryCta={{ label: "Start your program", href: "#" }}
                  secondaryCta={{ label: "How it works", href: "#" }}
                />
              </div>
            </BrowserFrame>
          </ThemeProvider>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />;
}
