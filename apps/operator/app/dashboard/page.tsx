import { redirect } from "next/navigation";
import { SiteHeader, demoBrands } from "@gtmstack/ui";
import {
  getOrdersForOrganization,
  getRecentEvents,
  getSubscriptionsForOrganization,
} from "@gtmstack/database-core";
import type {
  EventRow,
  OrderRow,
  SubscriptionRow,
} from "@gtmstack/database-core";

import { requireOperator } from "../../lib/operator-session";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

/**
 * /dashboard — operator's home base. Reads from real DB tables (orders,
 * subscriptions, events) when Supabase is configured. All metrics derive
 * from actual rows; new operators see honest zeros until customers buy.
 */
export default async function Dashboard() {
  const session = await requireOperator();
  if (!session.onboarded) redirect("/onboarding/vertical");

  const brand = session.brandName ?? "Your Brand";
  const storefrontUrl = `${session.storefrontSlug ?? "your-brand"}.gtmstack.shop`;
  const products = session.productSlugs ?? [];
  const catalog = session.theme ? demoBrands[session.theme].products : [];
  const selectedProducts = catalog.filter((p) => products.includes(p.slug));

  // Live reads from DB. Empty arrays for brand-new operators — honest, not
  // a bug. Populates as customers come through the storefront's checkout.
  const { events, orders, subscriptions } = await loadDashboardData(
    session.organizationId,
  );
  const metrics = deriveMetrics(subscriptions, orders, session.plan);

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
            <span className="font-mono text-foreground">{storefrontUrl}</span> (Sprint 6 stub —
            real DNS wires in Sprint 7).
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Metric
              label="This month MRR"
              value={formatUSD(metrics.mrrCents)}
              hint={
                metrics.activeSubscribers > 0
                  ? `${metrics.activeSubscribers} active`
                  : "No subscribers yet"
              }
            />
            <Metric
              label="Active subscribers"
              value={String(metrics.activeSubscribers)}
              hint={metrics.subsLastWeek > 0 ? `+${metrics.subsLastWeek} this week` : "—"}
            />
            <Metric
              label="Platform fee paid"
              value={formatUSD(metrics.platformFeeCents)}
              hint={
                metrics.platformFeeCents > 0
                  ? `~${platformFeeRatePct(session.plan)}% of revenue`
                  : "—"
              }
            />
          </div>

          <section className="mt-12">
            <h2 className="font-display text-h2 text-foreground">Recent activity</h2>
            {events.length === 0 ? (
              <p className="mt-stack text-body text-muted-foreground">
                Nothing yet. Once customers come through your storefront, every order, AI
                conversation, and provider review lands here.
              </p>
            ) : (
              <ul role="list" className="mt-stack space-y-3">
                {events.slice(0, 8).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-4 rounded-card border-card border-border bg-background p-4 shadow-card"
                  >
                    <div>
                      <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
                        {e.type}
                      </p>
                      <p className="mt-1 text-body text-foreground">
                        {summarizeEvent(e)}
                      </p>
                    </div>
                    <span className="font-mono text-small text-muted-foreground">
                      {formatRelative(e.occurred_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-12">
            <h2 className="font-display text-h2 text-foreground">Your products</h2>
            {selectedProducts.length === 0 ? (
              <p className="mt-stack text-body text-muted-foreground">
                No products listed yet. <a href="/onboarding/catalog" className="underline">Pick from the catalog</a>.
              </p>
            ) : (
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
            )}
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function loadDashboardData(
  organizationId: string,
): Promise<{ events: EventRow[]; orders: OrderRow[]; subscriptions: SubscriptionRow[] }> {
  if (!isSupabaseConfigured()) {
    return { events: [], orders: [], subscriptions: [] };
  }
  const client = await supabase();
  if (!client) return { events: [], orders: [], subscriptions: [] };
  try {
    const [events, orders, subscriptions] = await Promise.all([
      getRecentEvents(client, organizationId, 25),
      getOrdersForOrganization(client, organizationId, 25),
      getSubscriptionsForOrganization(client, organizationId),
    ]);
    return { events, orders, subscriptions };
  } catch (err) {
    console.error("[dashboard] load failed:", err);
    return { events: [], orders: [], subscriptions: [] };
  }
}

async function loadRecentEvents(organizationId: string): Promise<EventRow[]> {
  if (!isSupabaseConfigured()) return [];
  const client = await supabase();
  if (!client) return [];
  try {
    return await getRecentEvents(client, organizationId, 25);
  } catch (err) {
    console.error("[dashboard] event load failed:", err);
    return [];
  }
}

type Metrics = {
  mrrCents: number;
  activeSubscribers: number;
  subsLastWeek: number;
  platformFeeCents: number;
};

function deriveMetrics(
  subscriptions: SubscriptionRow[],
  orders: OrderRow[],
  plan: string | undefined,
): Metrics {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  // MRR + active subscribers come from the subscriptions table.
  const active = subscriptions.filter((s) => s.status === "active");
  const mrrCents = active.reduce((acc, s) => acc + s.amount_cents, 0);
  const activeSubscribers = active.length;
  const subsLastWeek = active.filter(
    (s) => new Date(s.created_at).getTime() >= oneWeekAgo,
  ).length;

  // Platform fee paid = % of cumulative revenue from completed orders.
  const completedRevenueCents = orders
    .filter((o) => o.status === "active")
    .reduce((acc, o) => acc + o.amount_cents, 0);
  const platformFeeCents = Math.round(
    (completedRevenueCents * platformFeeRatePct(plan)) / 100,
  );

  return { mrrCents, activeSubscribers, subsLastWeek, platformFeeCents };
}

function platformFeeRatePct(plan: string | undefined): number {
  switch (plan) {
    case "starter":
      return 8;
    case "pro":
      return 4;
    case "clinical":
      return 6;
    case "growth":
    default:
      return 5;
  }
}

function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

function summarizeEvent(e: EventRow): string {
  switch (e.type) {
    case "order.created":
      return `New ${e.payload?.mode === "subscription" ? "subscription" : "order"} · ${e.payload?.productSlug ?? "—"} · ${formatUSD(Number(e.payload?.amount ?? 0))}`;
    case "subscription.renewed":
      return `Renewal · ${formatUSD(Number(e.payload?.amount ?? 0))}`;
    case "subscription.canceled":
      return `Cancellation`;
    case "refund.completed":
      return `Refund · ${formatUSD(Number(e.payload?.amount ?? 0))}`;
    case "payment.failed":
      return `Payment failed · ${String(e.payload?.reason ?? "unknown reason")}`;
    case "intake.pending_review":
      return `Intake awaiting provider review · ${e.payload?.productSlug ?? "—"}`;
    case "connect.account_updated":
      return `Stripe account updated`;
    default:
      return e.type;
  }
}

function formatRelative(iso: string): string {
  const ts = new Date(iso).getTime();
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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
