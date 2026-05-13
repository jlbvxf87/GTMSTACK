import "server-only";

import type { AppSupabaseClient } from "../server-client";
import type { OrderRow, SubscriptionRow } from "../types";

// ---------------------------------------------------------------------------
// Time-series shapes the dashboard consumes.
// ---------------------------------------------------------------------------

export type DailyPoint = {
  /** ISO date `YYYY-MM-DD` */
  date: string;
  value: number;
};

export type TopProduct = {
  productSlug: string;
  orders: number;
  revenueCents: number;
};

export type ChurnSnapshot = {
  active: number;
  canceledInWindow: number;
  /** canceled / (active + canceled) over the window */
  rate: number;
};

// ---------------------------------------------------------------------------
// Date math helpers.
// ---------------------------------------------------------------------------

function startOfDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function windowStart(days: number): Date {
  const now = startOfDayUTC(new Date());
  // Include `days` days INCLUSIVE of today → subtract days-1.
  return new Date(now.getTime() - (days - 1) * 86_400_000);
}

function emptySeries(days: number): DailyPoint[] {
  const start = windowStart(days);
  const out: DailyPoint[] = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start.getTime() + i * 86_400_000);
    out.push({ date: isoDate(d), value: 0 });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Orders over time — count of orders per day in the window.
// ---------------------------------------------------------------------------

export async function getOrdersTimeSeries(
  client: AppSupabaseClient,
  organizationId: string,
  days = 30,
): Promise<DailyPoint[]> {
  const start = windowStart(days);
  const { data } = await client
    .from("orders")
    .select("created_at")
    .eq("organization_id", organizationId)
    .gte("created_at", start.toISOString());

  const series = emptySeries(days);
  const index = new Map(series.map((p, i) => [p.date, i] as const));
  for (const row of (data as Pick<OrderRow, "created_at">[] | null) ?? []) {
    const day = row.created_at.slice(0, 10);
    const i = index.get(day);
    if (i !== undefined) series[i]!.value += 1;
  }
  return series;
}

// ---------------------------------------------------------------------------
// New customers over time — count of distinct customer_ids first seen per day.
// We approximate "first seen" with the orders.created_at MIN per customer in
// the window. A customer who first ordered before the window doesn't count.
// ---------------------------------------------------------------------------

export async function getNewCustomersTimeSeries(
  client: AppSupabaseClient,
  organizationId: string,
  days = 30,
): Promise<DailyPoint[]> {
  // Pull the full customer + first-order map. For V1 the operator has a small
  // customer base, so this is fine; when we hit scale this becomes a view +
  // materialised aggregate.
  const { data } = await client
    .from("orders")
    .select("customer_id, created_at")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true });

  const firstSeen = new Map<string, string>();
  for (const row of (data as Pick<OrderRow, "customer_id" | "created_at">[] | null) ??
    []) {
    if (!firstSeen.has(row.customer_id)) {
      firstSeen.set(row.customer_id, row.created_at);
    }
  }

  const series = emptySeries(days);
  const index = new Map(series.map((p, i) => [p.date, i] as const));
  for (const iso of firstSeen.values()) {
    const day = iso.slice(0, 10);
    const i = index.get(day);
    if (i !== undefined) series[i]!.value += 1;
  }
  return series;
}

// ---------------------------------------------------------------------------
// MRR over time — at end of each day, sum the amount_cents of subscriptions
// that were active on that day. Active = status='active' AND created_at <= EOD
// AND (canceled_at IS NULL OR canceled_at > EOD).
//
// We don't track canceled_at on subscriptions yet (Sprint 7a only flips
// status); for now we treat status='canceled' as canceled-as-of-now and
// status='active' as continuously-active-from-created_at. Good enough for
// the first analytics surface; replace when we add subscription_history.
// ---------------------------------------------------------------------------

export async function getMrrTimeSeries(
  client: AppSupabaseClient,
  organizationId: string,
  days = 30,
): Promise<DailyPoint[]> {
  const { data } = await client
    .from("subscriptions")
    .select("amount_cents, status, created_at")
    .eq("organization_id", organizationId);

  const subs = (data as Pick<SubscriptionRow, "amount_cents" | "status" | "created_at">[] | null) ??
    [];

  const series = emptySeries(days);
  for (let i = 0; i < series.length; i += 1) {
    const eod = new Date(series[i]!.date + "T23:59:59Z");
    let cents = 0;
    for (const s of subs) {
      const created = new Date(s.created_at);
      if (created > eod) continue;
      if (s.status !== "active") continue;
      cents += s.amount_cents;
    }
    series[i]!.value = cents;
  }
  return series;
}

// ---------------------------------------------------------------------------
// Top products by gross revenue in window.
// ---------------------------------------------------------------------------

export async function getTopProducts(
  client: AppSupabaseClient,
  organizationId: string,
  days = 30,
  limit = 5,
): Promise<TopProduct[]> {
  const start = windowStart(days);
  const { data } = await client
    .from("orders")
    .select("product_slug, amount_cents")
    .eq("organization_id", organizationId)
    .gte("created_at", start.toISOString());

  const tally = new Map<string, TopProduct>();
  for (const row of (data as Pick<OrderRow, "product_slug" | "amount_cents">[] | null) ??
    []) {
    const cur = tally.get(row.product_slug) ?? {
      productSlug: row.product_slug,
      orders: 0,
      revenueCents: 0,
    };
    cur.orders += 1;
    cur.revenueCents += row.amount_cents;
    tally.set(row.product_slug, cur);
  }
  return Array.from(tally.values())
    .sort((a, b) => b.revenueCents - a.revenueCents)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Churn snapshot — active vs. canceled in window.
// ---------------------------------------------------------------------------

export async function getChurnSnapshot(
  client: AppSupabaseClient,
  organizationId: string,
  days = 30,
): Promise<ChurnSnapshot> {
  const start = windowStart(days);
  const { data } = await client
    .from("subscriptions")
    .select("status, created_at")
    .eq("organization_id", organizationId);

  const subs = (data as Pick<SubscriptionRow, "status" | "created_at">[] | null) ?? [];
  let active = 0;
  let canceledInWindow = 0;
  for (const s of subs) {
    if (s.status === "active") active += 1;
    if (s.status === "canceled" && new Date(s.created_at) >= start) {
      canceledInWindow += 1;
    }
  }
  const denom = active + canceledInWindow;
  const rate = denom === 0 ? 0 : canceledInWindow / denom;
  return { active, canceledInWindow, rate };
}
