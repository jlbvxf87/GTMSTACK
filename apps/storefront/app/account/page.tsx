import { redirect } from "next/navigation";
import { SiteHeader, ThemeProvider, demoBrands } from "@gtmstack/ui";

import { hydrateProducts, resolveStorefront } from "../../lib/operator-resolver";
import { readCustomerSession } from "../../lib/customer-session";

/**
 * Member portal home — overview of the customer's relationship with this
 * operator. Subscription card, recent orders, account details.
 */
export default async function AccountHome({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const ctx = await resolveStorefront({ searchParams: sp });
  if (!ctx) redirect("/");

  const operatorSlug = ctx.operator.storefront_slug ?? "";
  const session = await readCustomerSession(ctx.organization.id);
  if (!session) redirect(`/account/login?operator=${operatorSlug}`);

  const { customer, orders, subscriptions } = session;
  const brand = ctx.operator.brand_name ?? ctx.organization.name;
  const theme = ctx.storefront.theme;

  // Build a slug → Product map so we can show real names alongside orders.
  const products = hydrateProducts(ctx);
  const productBySlug = new Map(products.map((p) => [p.slug, p]));
  const catalogFromTheme = demoBrands[theme].products;
  for (const p of catalogFromTheme) {
    if (!productBySlug.has(p.slug)) productBySlug.set(p.slug, p);
  }

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const mrrCents = activeSubs.reduce((acc, s) => acc + s.amount_cents, 0);

  return (
    <ThemeProvider theme={theme} as="div">
      <SiteHeader
        brandName={brand}
        links={[
          { label: "Home", href: `/?operator=${operatorSlug}` },
          { label: "Account", href: `/account?operator=${operatorSlug}` },
          { label: "Orders", href: `/account/orders?operator=${operatorSlug}` },
          { label: "Sign out", href: `/account/signout?operator=${operatorSlug}` },
        ]}
        cta={{
          label: "Shop programs",
          href: `/?operator=${operatorSlug}#programs`,
        }}
      />

      <main className="w-full bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-6 py-section md:px-10">
          <p className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Account
          </p>
          <h1 className="mt-stack font-display text-h1 text-foreground">
            {customer.first_name ?? customer.email}
          </h1>
          <p className="mt-stack text-body text-muted-foreground">
            Member of {brand}. {orders.length} {orders.length === 1 ? "order" : "orders"} ·{" "}
            {activeSubs.length} active{" "}
            {activeSubs.length === 1 ? "subscription" : "subscriptions"}.
          </p>

          <section className="mt-12">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-h2 text-foreground">Active subscriptions</h2>
              {activeSubs.length > 0 ? (
                <span className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                  Total {formatUSD(mrrCents)}/mo
                </span>
              ) : null}
            </div>
            {activeSubs.length === 0 ? (
              <p className="mt-stack text-body text-muted-foreground">
                No active subscriptions yet.{" "}
                <a
                  href={`/?operator=${operatorSlug}#programs`}
                  className="underline transition-colors duration-DEFAULT ease-themed hover:text-foreground"
                >
                  Shop programs
                </a>
                .
              </p>
            ) : (
              <ul role="list" className="mt-stack space-y-3">
                {activeSubs.map((s) => {
                  const product = productBySlug.get(s.product_slug);
                  return (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-4 rounded-card border-card border-border bg-background p-5 shadow-card"
                    >
                      <div>
                        <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                          {product?.eyebrow ?? "Subscription"}
                        </p>
                        <p className="mt-1 font-display text-h3 text-foreground">
                          {product?.name ?? s.product_slug}
                        </p>
                        <p className="mt-1 text-small text-muted-foreground">
                          {s.current_period_end
                            ? `Renews ${new Date(s.current_period_end).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric", year: "numeric" },
                              )}`
                            : "Active"}
                        </p>
                      </div>
                      <p className="font-display text-h3 text-foreground">
                        {formatUSD(s.amount_cents)}
                        <span className="text-body text-muted-foreground">/mo</span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="mt-12">
            <h2 className="font-display text-h2 text-foreground">Recent orders</h2>
            {orders.length === 0 ? (
              <p className="mt-stack text-body text-muted-foreground">
                No orders yet.
              </p>
            ) : (
              <ul role="list" className="mt-stack space-y-3">
                {orders.slice(0, 10).map((o) => {
                  const product = productBySlug.get(o.product_slug);
                  return (
                    <li
                      key={o.id}
                      className="flex items-center justify-between gap-4 rounded-card border-card border-border bg-background p-5 shadow-card"
                    >
                      <div>
                        <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                          {o.mode === "subscription" ? "Subscription start" : "One-time"} ·{" "}
                          {o.status}
                        </p>
                        <p className="mt-1 font-display text-h3 text-foreground">
                          {product?.name ?? o.product_slug}
                        </p>
                        <p className="mt-1 text-small text-muted-foreground">
                          {new Date(o.created_at).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <p className="font-display text-h3 text-foreground">
                        {formatUSD(o.amount_cents)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="mt-12 rounded-card border-card border-border bg-muted p-6">
            <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
              Account details
            </p>
            <dl className="mt-stack grid grid-cols-1 gap-stack sm:grid-cols-[max-content_1fr] sm:gap-x-6">
              <dt className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                Name
              </dt>
              <dd className="text-body text-foreground">
                {customer.first_name} {customer.last_name}
              </dd>
              <dt className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                Email
              </dt>
              <dd className="text-body text-foreground break-all">{customer.email}</dd>
              <dt className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                Member since
              </dt>
              <dd className="text-body text-foreground">
                {new Date(customer.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </dd>
            </dl>
          </section>
        </div>
      </main>
    </ThemeProvider>
  );
}

function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
