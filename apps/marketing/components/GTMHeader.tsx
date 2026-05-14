/**
 * GTMStack landing header — bold B&W, dark CTA, user's wordmark logo.
 * Replaces the generic SiteHeader on the marketing landing only; the
 * Prime Wellness preview + product pages still use SiteHeader.
 */
export function GTMHeader({ operatorAppUrl }: { operatorAppUrl: string }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-container items-center justify-between gap-inline px-6 py-4 md:px-10">
        <a href="/" className="flex items-center" aria-label="GTMStack home">
          <img
            src="/brand/logo-wordmark.png"
            alt="GTMStack"
            className="h-9 w-auto md:h-10"
          />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <a href="#platform" className="font-body text-body text-black/70 transition-colors hover:text-black">
            Platform
          </a>
          <a href="#founders" className="font-body text-body text-black/70 transition-colors hover:text-black">
            Operators
          </a>
          <a href="#testimonials" className="font-body text-body text-black/70 transition-colors hover:text-black">
            Stories
          </a>
          <a href="#try" className="font-body text-body text-black/70 transition-colors hover:text-black">
            Try it
          </a>
          <a href="#pricing" className="font-body text-body text-black/70 transition-colors hover:text-black">
            Pricing
          </a>
        </nav>

        <a
          href={`${operatorAppUrl}/signup`}
          className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 font-body text-small font-semibold text-white transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Launch Your Business
        </a>
      </div>
    </header>
  );
}
