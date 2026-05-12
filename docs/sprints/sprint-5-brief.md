# Sprint 5 — Payments: Stripe Connect (Tier 1) + Tier 2 scaffold

> See `docs/CLAUDE.md` for foundational architecture. This brief is operational.

## Goal

Wire the **money loop**. After this sprint, an operator can connect Stripe (test mode), a customer can complete a checkout for a supplement-tier product end-to-end, platform fees route correctly, webhooks emit canonical events. Clinical-tier products are gated to a "submitted for provider review" page — no charge, no medical pretense, no fake adapters that lie. The architecture supports lighting up Tier 2 the moment partners are signed: **three files** added per partner, zero changes to checkout flow.

## Two-tier model

| Tier | Examples | Sprint 5 status |
|---|---|---|
| **Tier 1 — Wellness / supplements** | Sleep Stack, whey, Daily Greens | ✅ Full Stripe Connect end-to-end |
| **Tier 2 — Clinical / Rx / regulated** | Peptide Performance, hormone protocols | ⚠ Scaffolded only — gated to review-pending page, real adapters stubbed |

## Components

### `@gtmstack/payments` package (new — real code lands here)

| File | Responsibility |
|---|---|
| `src/types.ts` | `PaymentAdapter` interface, `OperatorPlan` enum, canonical event types (`order.created`, `subscription.renewed`, etc.), `CheckoutIntent` input type. |
| `src/router.ts` | `pickAdapter(product, operator) → { kind: "process" \| "gate", adapter? }`. If clinical + provider-review required, returns `{ kind: "gate" }` and the route handler redirects to review-pending. |
| `src/adapters/stripe-connect.ts` | Full Stripe Connect adapter. `createCheckoutSession`, `createConnectOnboardingLink`, `handleWebhook`. Uses the real `stripe` SDK; in mock mode the adapter returns a fake-checkout URL pointing back into the app. |
| `src/adapters/careplug-pay.ts` | Stub conforming to `PaymentAdapter`. Every method throws `"NOT_IMPLEMENTED: partner credentials required"`. Real implementation lands when a partner agreement + keys exist. |
| `src/events.ts` | Canonical internal event types — processor-agnostic. All downstream consumers (email, dashboard, AI) read from this shape. |
| `src/mock.ts` | Dev-only helper: when no Stripe key is configured, redirects to an in-app fake checkout page that mimics the Stripe Checkout flow (pay / decline buttons), so the end-to-end UX is testable without a Stripe account. |

### `apps/marketing` route additions

| Route | Responsibility |
|---|---|
| `app/api/checkout/route.ts` | POST endpoint. Reads `{ productSlug, mode }`, picks adapter via router. Tier 1 → adapter creates Stripe session, returns redirect URL. Tier 2 → emits intake.pending_review, returns redirect to `/start/review-pending`. |
| `app/api/webhooks/stripe/route.ts` | POST endpoint. Verifies Stripe signature, delegates to adapter, emits canonical events, returns 200. In mock mode, exposed for the fake-checkout page to fire success events. |
| `app/connect/page.tsx` | Operator-facing "Connect with Stripe" landing. Calls Stripe Connect OAuth URL (or mock equivalent). |
| `app/connect/callback/route.ts` | OAuth callback handler. Stores `stripe_account_id` in operator cookie. |
| `app/dev/checkout/page.tsx` | Mock checkout page (dev only). Shows order summary + Pay / Decline buttons. Pay submits a synthetic webhook event and redirects to `/start/welcome`. |
| `app/start/review-pending/page.tsx` | Page shown for clinical-tier products. "Submitted for provider review." Sets clear expectations: no charge until approved. |
| `app/start/welcome/page.tsx` | Updated to read order context from the URL session id (real or mock). |
| `lib/operator-context.ts` | Reads operator + Stripe account from cookies (proxy for the eventual `operators` table). |

### Product type extensions

```ts
type Product = {
  // ... existing fields
  tier: "wellness" | "clinical";          // required
  requiresProviderReview?: boolean;        // true → gated checkout
};
```

Demo fixtures updated:
- Sleep Stack, Daily Greens, Recovery Kit, Pre-Lift, Whey Foundation, Post Recovery → `tier: "wellness"`.
- Peptide Performance, Hormone Baseline, Longevity Panel → `tier: "clinical"`, `requiresProviderReview: true`.

## Mechanics

**Mock-vs-live dev mode** — driven by `STRIPE_PLATFORM_SECRET_KEY` env:
- Unset OR starts with `sk_test_mock_` → mock mode (in-app fake checkout, synthetic webhooks).
- Real `sk_test_…` from a real Stripe Connect platform account → real Stripe Checkout, real webhooks via Stripe CLI or hosted endpoint.

**Operator context** — single cookie (`gtm_op`) carrying `{ operatorId, stripeAccountId? }`. Until apps/operator + Supabase land in Sprint 6, this is how a tab "is" an operator. Default operator = Prime Wellness. `/connect` lets you swap.

**Platform fee** — `application_fee_amount` on every Stripe Checkout session = 5% of subtotal (Sprint 5 default; tier-aware fee comes in Sprint 6 when `OperatorPlan` is enforced).

## Acceptance criteria

1. New `@gtmstack/payments` package builds, typechecks, and is consumed by apps/marketing.
2. `/connect` works in mock mode — stores a synthetic `stripeAccountId` in cookie.
3. `/products/sleep-stack` → "Add to program" → mock checkout → "Pay" → `/start/welcome` with order details.
4. `/products/peptide-performance` → "Add to program" → `/start/review-pending` (no charge, no Stripe call).
5. Intake "Submit intake" button on `/start/review` also flows through this — picks the primary goal's matching product or the operator's default starter product and goes to checkout.
6. Webhook receiver exists, signature-verifies in live mode, no-ops cleanly in mock mode.
7. Both packages typecheck.

## Out of scope

- Real Stripe signup / Connect platform enablement — separate ops task.
- Three-party splits (PC + pharmacy + operator + platform) — Sprint 5.5 when partners are signed.
- Operator-side dashboard for choosing a plan, viewing payouts, listing products — Sprint 6.
- Provider portal — Sprint 7.
- Subscription billing for the operator's monthly SaaS fee to GTMStack — Sprint 5.5.
- Inngest dispatch on canonical events — Sprint 6 when apps/operator + Supabase land.

## When partners arrive (the seamless promise)

To onboard a real PC + pharmacy partner later:

1. Add config rows in `packages/compliance/src/partners.ts` (config-only).
2. Implement the pharmacy's `FulfillmentAdapter` in `packages/fulfillment/src/adapters/<name>.ts` (~200 lines, isolated).
3. Replace `careplug-pay.ts` stub with real implementation, or write a new processor adapter and add it to the router (~200 lines, isolated).

Zero changes required to: router signatures, checkout route, webhook receiver, intake flow, UI components, Product type, event model.

## Working order

1. New `@gtmstack/payments` package — types, router, both adapters, mock helper.
2. Product type extension + fixture updates.
3. `/api/checkout` + `/api/webhooks/stripe` routes.
4. `/connect` + `/connect/callback` + `/dev/checkout` routes.
5. `/start/review-pending` page.
6. Wire intake submit + product page CTAs through the new endpoint.
7. Typecheck. Commit. Push.
