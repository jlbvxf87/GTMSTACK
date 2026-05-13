# Sprint 8 — Operator analytics dashboard

## Goal

A real analytics tab inside `apps/operator` that reads from the operator's actual data (orders, subscriptions, events) and renders MRR, new customers, orders, churn, and top products as time-series + cards. Built from the data the operator already has — no PostHog account required to use it, but PostHog gets wired so when an operator hits scale they get product-analytics without a re-platform.

The dashboard the operator actually runs their business from. Doctrine sprint 8.

## Out of scope

- Cohort analysis, funnels, retention curves — V2.
- Customer-level drilldown (the patient portal already covers that).
- AI-generated insights ("your churn is up 14% because…") — V2; this sprint surfaces the numbers honestly without editorialising.

## What lands

1. `@gtmstack/analytics` filled in
   - `client.ts` — PostHog Node singleton, mock mode when `POSTHOG_KEY` unset
   - `events.ts` — canonical event name registry mirroring `@gtmstack/jobs/events.ts`
   - `track()` server helper
   - Browser-side `usePosthog()` opt-in (apps include via their own bootstrap; not auto-imported)

2. `@gtmstack/database-core/queries/analytics.ts`
   - `getMrrTimeSeries(client, orgId, days)` — daily MRR (sum of active subscription amounts at end of each day) over the last N days
   - `getOrdersTimeSeries(client, orgId, days)` — count of orders per day
   - `getNewCustomersTimeSeries(client, orgId, days)` — distinct customers first seen per day
   - `getChurnSnapshot(client, orgId, days)` — canceled / active ratio over window
   - `getTopProducts(client, orgId, days, limit)` — by gross volume

3. `@gtmstack/ui` chart primitives
   - `<Sparkline data: number[] />` — SVG, no chart library; reads brand colors from theme tokens
   - `<BarList items: { label, value, subLabel? }[] />`
   - `<MetricTile label value delta?  spark? />`
   - `<TrendCard title series />`

4. `apps/operator/app/dashboard/analytics/page.tsx`
   - Header strip: MRR, active subs, new customers (last 30d), churn % (last 30d)
   - Three trend cards: MRR daily, new orders daily, new customers daily
   - Top products bar list
   - Empty states wherever the operator has zero data (most operators on day 1)

5. Top-of-dashboard nav link in `apps/operator/app/dashboard/page.tsx`

## Acceptance criteria

1. Operator with no orders sees clean empty states, not crashed charts.
2. Operator with orders sees actual numbers calculated server-side.
3. All charts are SSR'd SVG — no client-side chart library, no flicker on load.
4. Without `POSTHOG_KEY` the analytics calls log to console and return; with it they actually send.
5. `pnpm -r typecheck` clean.

## Working order

1. Fill `@gtmstack/analytics` src (client + events + track + index).
2. Add `queries/analytics.ts` to `@gtmstack/database-core`.
3. Add chart primitives to `@gtmstack/ui`.
4. Build `/dashboard/analytics` page.
5. Add dashboard nav link.
6. Typecheck and commit.

## Done when

- Operator dashboard has a working analytics surface that reads real DB data.
- A test order through Stripe webhook (Sprint 7a) shows up as +1 in the new orders trend that day.
- The page is one route + four components — no analytics service infrastructure required to render it.
