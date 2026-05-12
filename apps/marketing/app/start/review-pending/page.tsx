import { SiteHeader, primeWellness, findProductBySlug } from "@gtmstack/ui";

/**
 * /start/review-pending
 *
 * Shown when a customer attempts to check out a product that requires
 * provider review (Tier 2 — peptides, hormones, etc.). The customer's intake
 * has been captured, but no charge happens here. The page sets clear
 * expectations: a licensed provider will review and approve before any money
 * moves.
 *
 * Sprint 7 lights up the actual provider review portal. Until then this page
 * is the final stop for Tier 2 products and the PendingOrder sits in state.
 */
export default async function ReviewPendingPage({
  searchParams,
}: {
  searchParams?: Promise<{ slug?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const match = sp.slug ? findProductBySlug(sp.slug) : null;
  const product = match?.product;
  const brand = match?.brand ?? null;

  return (
    <>
      <SiteHeader brandName={primeWellness.name} links={primeWellness.nav} cta={primeWellness.navCta} />

      <main className="w-full bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-6 py-section md:px-10">
          <p className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Step complete · awaiting review
          </p>
          <h1 className="mt-stack font-display text-h1 text-foreground">
            Submitted for provider review.
          </h1>
          <p className="mt-stack max-w-prose text-h3 text-muted-foreground">
            {product ? (
              <>
                Your intake for <span className="font-medium text-foreground">{product.name}</span>{" "}
                {brand ? `from ${brand.name}` : ""} has been submitted to our licensed provider
                network. You'll hear back within one business day.
              </>
            ) : (
              "Your intake has been submitted to our licensed provider network. You'll hear back within one business day."
            )}
          </p>

          <div className="mt-12 rounded-card border-card border-border bg-muted p-6">
            <h2 className="font-display text-h3 text-foreground">What happens next</h2>
            <ol className="mt-stack space-y-3 text-body text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">No charge yet.</span> You won't see
                anything on your card until the provider approves.
              </li>
              <li>
                <span className="font-medium text-foreground">A licensed physician</span> reviews
                your intake — typically within one business day.
              </li>
              <li>
                If approved, we email you a secure checkout link. If declined, you'll get a clear
                explanation and any deposit refunded.
              </li>
              <li>
                After your first shipment, you'll have ongoing access to the provider via the
                member portal.
              </li>
            </ol>
          </div>

          <div className="mt-12 rounded-card border-card border-border bg-background p-6 shadow-card">
            <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
              Note for the operator (you, building GTMStack)
            </p>
            <p className="mt-stack text-body text-muted-foreground">
              This page is reachable today, but no provider portal exists yet — Sprint 7 builds
              that. For now, intakes for clinical products land here and sit until a real provider
              partnership + portal go live. The architecture is in place; the partner relationship
              and dedicated portal come next.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-inline">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
            >
              Back to programs
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
