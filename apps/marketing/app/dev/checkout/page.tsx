import { SiteHeader, primeWellness } from "@gtmstack/ui";

/**
 * Dev-only mock Stripe Checkout page.
 *
 * Activated when the Stripe adapter is in mock mode (no real Stripe key set).
 * Renders an order summary and two buttons:
 *
 *   - "Pay" — POSTs a synthetic `order.created` canonical event to
 *     /api/webhooks/stripe, then redirects to /start/welcome with the
 *     session id in query params.
 *   - "Cancel" — redirects to the product page.
 *
 * In production this page is unreachable because the Stripe adapter returns
 * a real `checkout.stripe.com` URL instead of routing here.
 */
export default async function DevCheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const sessionId = sp.session_id ?? "cs_mock_unknown";
  const operatorId = sp.operator_id ?? "prime-wellness";
  const productSlug = sp.product_slug ?? "unknown";
  const productName = sp.product_name ?? "Unknown product";
  const amount = Number(sp.amount ?? "0");
  const mode = (sp.mode === "payment" ? "payment" : "subscription") as
    | "payment"
    | "subscription";

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);

  const successUrl = `/start/welcome?session_id=${encodeURIComponent(sessionId)}`;
  const cancelUrl = `/products/${productSlug}`;

  // Build the canonical event the "Pay" form will POST to the webhook receiver.
  const eventPayload = {
    type: "order.created",
    orderId: sessionId,
    operatorId,
    productSlug,
    amount,
    currency: "USD",
    mode,
    occurredAt: new Date().toISOString(),
  };

  return (
    <>
      <SiteHeader brandName={primeWellness.name} links={primeWellness.nav} cta={primeWellness.navCta} />

      <main className="w-full bg-muted text-foreground">
        <div className="mx-auto max-w-xl px-6 py-section md:px-10">
          <p className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Dev mock checkout — not real Stripe
          </p>
          <h1 className="mt-stack font-display text-h1 text-foreground">Confirm your order</h1>
          <p className="mt-stack max-w-prose text-body text-muted-foreground">
            When `STRIPE_PLATFORM_SECRET_KEY` is set to a real test key, this page is replaced
            by Stripe's hosted checkout. The flow your customers experience is identical — they
            never see this page.
          </p>

          <div className="mt-10 rounded-card border-card border-border bg-background p-6 shadow-card">
            <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
              {mode === "subscription" ? "Subscription" : "One-time purchase"}
            </p>
            <h2 className="mt-stack font-display text-h2 text-foreground">{productName}</h2>
            <p className="mt-stack font-display text-h2 text-foreground">
              {formatted}
              {mode === "subscription" ? (
                <span className="text-h3 text-muted-foreground">/mo</span>
              ) : null}
            </p>
            <p className="mt-stack text-small text-muted-foreground">Operator: {operatorId}</p>
            <p className="text-small text-muted-foreground">Session: {sessionId}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-inline">
            <PayForm eventPayload={eventPayload} successUrl={successUrl} />
            <a
              href={cancelUrl}
              className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-background"
            >
              Cancel
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

/**
 * Renders a form that POSTs the synthetic canonical event to
 * /api/webhooks/stripe via a tiny inline form action, then redirects to
 * success. Because the webhook receiver does the work, we can keep this a
 * server component with no client JS.
 */
function PayForm({
  eventPayload,
  successUrl,
}: {
  eventPayload: unknown;
  successUrl: string;
}) {
  async function pay() {
    "use server";
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/webhooks/stripe`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(eventPayload),
    });
    const { redirect } = await import("next/navigation");
    redirect(successUrl);
  }

  return (
    <form action={pay}>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
      >
        Pay
      </button>
    </form>
  );
}
