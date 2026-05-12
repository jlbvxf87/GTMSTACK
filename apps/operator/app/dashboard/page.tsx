import { redirect } from "next/navigation";
import { SiteHeader, demoBrands } from "@gtmstack/ui";

import { requireOperator } from "../../lib/operator-session";

/**
 * /dashboard — the operator's home base post-onboarding. Sprint 6 V1 reads
 * everything from the cookie + demo fixtures. Sprint 6.5 swaps to Supabase
 * queries via @gtmstack/database-core.
 */
export default async function Dashboard() {
  const session = await requireOperator();
  if (!session.onboarded) redirect("/onboarding/vertical");

  const brand = session.brandName ?? "Your Brand";
  const storefrontUrl = `${session.storefrontSlug ?? "your-brand"}.gtmstack.shop`;
  const products = session.productSlugs ?? [];
  const catalog = session.theme ? demoBrands[session.theme].products : [];
  const selectedProducts = catalog.filter((p) => products.includes(p.slug));

  return (
    <>
      <SiteHeader
        brandName="GTMStack"
        links={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
          { label: "Brand", href: "/dashboard/brand" },
          { label: "Payouts", href: "/dashboard/settings/payouts" },
        ]}
        cta={{ label: "Preview storefront", href: "/dashboard/preview" }}
      />

      <main className="w-full bg-background text-foreground">
        <div className="mx-auto max-w-container px-6 py-section md:px-10">
          <p className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Welcome back
          </p>
          <h1 className="mt-stack font-display text-h1 text-foreground">{brand}</h1>
          <p className="mt-stack text-body text-muted-foreground">
            Your storefront is live at{" "}
            <span className="font-mono text-foreground">{storefrontUrl}</span> (Sprint 6 stub — real DNS
            wires in Sprint 7).
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Metric label="This month MRR" value="$0" hint="No subscribers yet" />
            <Metric label="Active subscribers" value="0" hint="—" />
            <Metric label="Platform fee paid" value="$0" hint="—" />
          </div>

          <section className="mt-12">
            <h2 className="font-display text-h2 text-foreground">Recent activity</h2>
            <p className="mt-stack text-body text-muted-foreground">
              Nothing yet. Once customers come through your storefront, every order, AI
              conversation, and provider review lands here.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-h2 text-foreground">Your products</h2>
            <ul role="list" className="mt-stack grid grid-cols-1 gap-4 sm:grid-cols-2">
              {selectedProducts.map((p) => (
                <li
                  key={p.slug}
                  className="rounded-card border-card border-border bg-background p-5 shadow-card"
                >
                  <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                    {p.eyebrow ?? p.tier}
                  </p>
                  <p className="mt-stack font-display text-h3 text-foreground">{p.name}</p>
                  <p className="mt-stack text-body text-muted-foreground">{p.description}</p>
                </li>
              ))}
            </ul>
          </section>

          {session.brandVoice ? (
            <section className="mt-12 rounded-card border-card border-border bg-muted p-6">
              <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                Brand voice
              </p>
              <p className="mt-stack font-display text-h3 text-foreground">
                {session.brandVoice.tagline}
              </p>
              <p className="mt-stack max-w-prose text-body text-muted-foreground">
                {session.brandVoice.subhead}
              </p>
              <p className="mt-stack text-small text-muted-foreground">
                Register: {session.brandVoice.voiceRegister.join(" · ")}
              </p>
            </section>
          ) : null}

          <section className="mt-12">
            <h2 className="font-display text-h2 text-foreground">Operator details</h2>
            <dl className="mt-stack grid grid-cols-1 gap-stack sm:grid-cols-[max-content_1fr] sm:gap-x-6">
              <dt className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">Vertical</dt>
              <dd className="text-body text-foreground">{session.theme}</dd>
              <dt className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">Plan</dt>
              <dd className="text-body text-foreground">{session.plan}</dd>
              <dt className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">Stripe</dt>
              <dd className="font-mono text-body text-foreground break-all">{session.stripeAccountId}</dd>
            </dl>
          </section>
        </div>
      </main>
    </>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-card border-card border-border bg-background p-5 shadow-card">
      <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-stack font-display text-h1 text-foreground">{value}</p>
      <p className="mt-stack text-small text-muted-foreground">{hint}</p>
    </div>
  );
}
