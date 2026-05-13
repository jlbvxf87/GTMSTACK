import { redirect } from "next/navigation";

import {
  BarList,
  MetricTile,
  SiteHeader,
  TrendCard,
} from "@gtmstack/ui";
import {
  getChurnSnapshot,
  getMrrTimeSeries,
  getNewCustomersTimeSeries,
  getOrdersTimeSeries,
  getTopProducts,
  type ChurnSnapshot,
  type DailyPoint,
  type TopProduct,
} from "@gtmstack/database-core";

import { requireOperator } from "../../../lib/operator-session";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

/**
 * /dashboard/analytics — Sprint 8.
 *
 * Reads aggregations server-side from the operator's organization rows.
 * Zero JS shipped to the client for charts — all SVG is SSR'd. When the
 * operator has no data yet the page renders honest empty states; no fake
 * sample data, no synthetic "demo" numbers.
 */
export default async function AnalyticsPage() {
  const session = await requireOperator();
  if (!session.onboarded) redirect("/onboarding/vertical");

  const data = await loadAnalytics(session.organizationId, 30);

  const totalOrders = sum(data.orders);
  const totalNewCustomers = sum(data.newCustomers);
  const currentMrr = data.mrr.length > 0 ? data.mrr[data.mrr.length - 1]!.value : 0;
  const previousMrr =
    data.mrr.length > 7 ? data.mrr[data.mrr.length - 8]!.value : currentMrr;
  const mrrDeltaPct = previousMrr > 0
    ? ((currentMrr - previousMrr) / previousMrr) * 100
    : null;

  return (
    <>
      <SiteHeader
        brandName="GTMStack"
        links={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics", href: "/dashboard/analytics" },
          { label: "Products", href: "/dashboard/products" },
          { label: "Brand", href: "/dashboard/brand" },
          { label: "Payouts", href: "/dashboard/settings/payouts" },
        ]}
        cta={{ label: "Preview storefront", href: "/dashboard/preview" }}
      />

      <main className="w-full bg-background text-foreground">
        <div className="mx-auto max-w-container px-6 py-section md:px-10">
          <p className="font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Last 30 days
          </p>
          <h1 className="mt-stack font-display text-h1 text-foreground">Analytics</h1>
          <p className="mt-stack max-w-prose text-body text-muted-foreground">
            Numbers from your real orders, subscriptions, and customer activity. No
            synthetic data — the charts are empty until customers come through.
          </p>

          <section className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-4">
            <MetricTile
              label="MRR (today)"
              value={formatUSD(currentMrr)}
              delta={
                mrrDeltaPct === null
                  ? undefined
                  : `${mrrDeltaPct >= 0 ? "+" : ""}${mrrDeltaPct.toFixed(1)}% wk`
              }
              spark={data.mrr}
              hint="Active subs × monthly amount"
            />
            <MetricTile
              label="Active subscribers"
              value={String(data.churn.active)}
              hint={
                data.churn.canceledInWindow > 0
                  ? `${data.churn.canceledInWindow} canceled in window`
                  : "No churn this window"
              }
            />
            <MetricTile
              label="New customers (30d)"
              value={String(totalNewCustomers)}
              spark={data.newCustomers}
            />
            <MetricTile
              label="Churn rate (30d)"
              value={`${(data.churn.rate * 100).toFixed(1)}%`}
              hint="Canceled / (active + canceled)"
            />
          </section>

          <section className="mt-12 grid grid-cols-1 gap-6">
            <TrendCard
              title="MRR"
              subtitle="Daily snapshot of active subscription revenue"
              series={data.mrr}
              formatHeadline={formatUSD}
              formatSecondary={(v) => formatUSD(v / data.mrr.length)}
              secondaryLabel="30d avg"
            />
            <TrendCard
              title="Orders"
              subtitle="Count of orders created per day"
              series={data.orders}
              formatSecondary={(v) => String(v)}
              secondaryLabel="30d total"
            />
            <TrendCard
              title="New customers"
              subtitle="First-time buyers, by day they first ordered"
              series={data.newCustomers}
              formatSecondary={(v) => String(v)}
              secondaryLabel="30d total"
            />
          </section>

          <section className="mt-12 rounded-card border border-border bg-card p-6">
            <h2 className="font-display text-h3 text-foreground">Top products (30d)</h2>
            <p className="mt-1 text-small text-muted-foreground">
              By gross revenue. Click through to product analytics in a later sprint.
            </p>
            <div className="mt-6 text-foreground">
              <BarList
                items={data.topProducts.map((p) => ({
                  label: p.productSlug,
                  value: p.revenueCents,
                  subLabel: `${p.orders} order${p.orders === 1 ? "" : "s"}`,
                }))}
                formatValue={formatUSD}
                emptyLabel="No orders yet. Your top products will land here once customers start buying."
              />
            </div>
          </section>

          <p className="mt-10 text-eyebrow uppercase tracking-wide text-muted-foreground">
            {totalOrders === 0
              ? "Empty by design. Connect Stripe + drive your first order to populate this page."
              : `${totalOrders} order${totalOrders === 1 ? "" : "s"} in window.`}
          </p>
        </div>
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type AnalyticsBundle = {
  mrr: DailyPoint[];
  orders: DailyPoint[];
  newCustomers: DailyPoint[];
  topProducts: TopProduct[];
  churn: ChurnSnapshot;
};

async function loadAnalytics(
  organizationId: string,
  days: number,
): Promise<AnalyticsBundle> {
  const empty: AnalyticsBundle = {
    mrr: emptySeries(days),
    orders: emptySeries(days),
    newCustomers: emptySeries(days),
    topProducts: [],
    churn: { active: 0, canceledInWindow: 0, rate: 0 },
  };

  if (!isSupabaseConfigured()) return empty;
  const client = await supabase();
  if (!client) return empty;

  try {
    const [mrr, orders, newCustomers, topProducts, churn] = await Promise.all([
      getMrrTimeSeries(client, organizationId, days),
      getOrdersTimeSeries(client, organizationId, days),
      getNewCustomersTimeSeries(client, organizationId, days),
      getTopProducts(client, organizationId, days, 5),
      getChurnSnapshot(client, organizationId, days),
    ]);
    return { mrr, orders, newCustomers, topProducts, churn };
  } catch (err) {
    console.error("[analytics] load failed:", err);
    return empty;
  }
}

function emptySeries(days: number): DailyPoint[] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const out: DailyPoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today.getTime() - i * 86_400_000);
    out.push({ date: d.toISOString().slice(0, 10), value: 0 });
  }
  return out;
}

function sum(series: DailyPoint[]): number {
  return series.reduce((a, b) => a + b.value, 0);
}

function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
