import { stripeConnectAdapter, isMockMode } from "@gtmstack/payments";
import { SiteHeader, primeWellness } from "@gtmstack/ui";

import { readOperator } from "../../lib/operator-context";

/**
 * /connect — operator-facing landing for Stripe Connect onboarding.
 *
 * Sprint 5: minimal page that creates an onboarding link via the adapter and
 * renders it. In mock mode the link round-trips back to /connect/callback?mock=1
 * which stamps a synthetic stripe_account_id on the operator cookie. In live
 * mode the link is a real Stripe-hosted onboarding URL.
 *
 * Sprint 6: this page moves to apps/operator (the real dashboard) and is gated
 * behind authentication.
 */
export default async function ConnectPage({
  searchParams,
}: {
  searchParams?: Promise<{ after?: string }>;
}) {
  const operator = await readOperator();
  const sp = (await searchParams) ?? {};
  const after = sp.after ?? "/";

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const link = await stripeConnectAdapter.createConnectOnboardingLink({
    operatorId: operator.id,
    returnUrl: `${origin}/connect/callback?after=${encodeURIComponent(after)}`,
    refreshUrl: `${origin}/connect`,
  });

  const mock = isMockMode();
  const alreadyConnected = Boolean(operator.stripeAccountId);

  return (
    <>
      <SiteHeader brandName={primeWellness.name} links={primeWellness.nav} cta={primeWellness.navCta} />

      <main className="w-full bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-6 py-section md:px-10">
          <p className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Operator setup
          </p>
          <h1 className="mt-stack font-display text-h1 text-foreground">
            Connect your payouts.
          </h1>
          <p className="mt-stack max-w-prose text-h3 text-muted-foreground">
            Customers pay you directly. Stripe handles the card processing, holds nothing on
            your behalf, and pays out to your bank on a daily schedule. GTMStack takes a small
            platform fee on each transaction — never touches your bank account.
          </p>

          {alreadyConnected ? (
            <div className="mt-12 rounded-card border-card border-border bg-muted p-6">
              <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                Connected
              </p>
              <p className="mt-stack font-display text-h3 text-foreground">
                {operator.stripeAccountId}
              </p>
              <p className="mt-stack text-body text-muted-foreground">
                Operator: <span className="font-medium text-foreground">{operator.id}</span> ·
                plan: <span className="font-medium text-foreground">{operator.plan}</span>
              </p>
              <div className="mt-stack flex gap-inline">
                <a
                  href={after}
                  className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
                >
                  Continue
                </a>
                <a
                  href={link.url}
                  className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-muted"
                >
                  Reconnect
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-12 rounded-card border-card border-border bg-background p-8 shadow-card">
              {mock ? (
                <p className="mb-stack font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                  Dev mode — mock onboarding
                </p>
              ) : null}
              <h2 className="font-display text-h2 text-foreground">
                {mock ? "Simulate Stripe onboarding" : "Connect with Stripe"}
              </h2>
              <p className="mt-stack max-w-prose text-body text-muted-foreground">
                {mock
                  ? "We'll attach a synthetic Stripe account id to your operator cookie. When you add a real STRIPE_PLATFORM_SECRET_KEY, this button starts launching Stripe's real onboarding flow instead."
                  : "Click below to go through Stripe's hosted onboarding — business info, bank account, ID verification. Should take about 5 minutes."}
              </p>
              <a
                href={link.url}
                className="mt-6 inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
              >
                {mock ? "Simulate connect" : "Connect with Stripe"}
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
