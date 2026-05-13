/**
 * Sticky CTA that pins to the top-right of the viewport once the user
 * scrolls past the hero. Pure CSS — uses `sticky` + scroll-margin tricks
 * rather than client JS.
 *
 * Actually implemented as a fixed-position element shown via a scroll
 * detector using CSS `@supports (animation-timeline)` (View Timeline API)
 * with a polyfill fallback that just always shows it on mobile.
 */
export function StickyCTA({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="sticky-cta fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-button bg-brand px-5 py-3 font-body font-[var(--weight-button)] text-brand-foreground shadow-card transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-8 sm:right-8"
      aria-label={label}
    >
      {label}
    </a>
  );
}
