# Sprint 6 — Operator Configuration & AI Brand Voice

> Doctrine line 272: *the magic moment where a brand comes alive.*

This sprint justifies the platform. Operators describe their brand in one paragraph; Claude generates the entire identity; they edit and publish. From blank to live storefront in hours, not weeks.

## Goal

After this sprint, an operator can:
1. Sign up at `app.gtmstack.com` (port 3001 in dev).
2. Walk a 5-step onboarding flow.
3. Generate brand identity from a one-paragraph description (AI brand voice — the marquee feature).
4. Pick products from a marketplace.
5. Connect Stripe Connect (moved over from apps/marketing).
6. Pick a SaaS plan tier.
7. Land on a dashboard showing MRR, recent orders, products, and their AI brand voice settings.

## What ships

### New app: `apps/operator`

Doctrine-mandated separate Next.js app on port 3001. Routes:

| Route | Page |
|---|---|
| `/` | Logged-out marketing pitch; logged-in redirects to `/dashboard` |
| `/signup` | Email + password signup (Supabase Auth) |
| `/login` | Email + password login |
| `/onboarding/vertical` | Step 1 — pick template family |
| `/onboarding/brand` | Step 2 — ★ AI brand voice generation ★ |
| `/onboarding/catalog` | Step 3 — pick products from marketplace |
| `/onboarding/plan` | Step 4 — pick SaaS tier + Stripe Connect |
| `/onboarding/launch` | Step 5 — review + go live |
| `/dashboard` | MRR, orders, customers, AI conversations, payouts |
| `/dashboard/products` | Manage product list |
| `/dashboard/brand` | Regenerate / edit brand voice |
| `/dashboard/settings/payouts` | Stripe Connect (formerly `apps/marketing/connect`) |
| `/dashboard/settings/plan` | SaaS tier upgrade/downgrade |

### Real `@gtmstack/database-core`

Supabase client + typed queries. New tables:

```sql
organizations (id, name, slug, owner_user_id, created_at)
operators     (id, organization_id, plan, stripe_account_id, state, created_at)
storefronts   (id, organization_id, slug, theme, brand_voice, status, created_at)
products      (id, organization_id, slug, name, tier, requires_provider_review,
               price_one_time_cents, price_monthly_cents, ...)
events        (id, type, payload jsonb, occurred_at, organization_id)
```

RLS policies on every table. Operators can only read/write their own organization's data.

### Real `@gtmstack/ai`

Anthropic SDK client with prompt caching. Marquee prompt: `brand-voice.ts`.

```
src/
  client.ts                Anthropic SDK wrapper (cached system prompts, structured output)
  prompts/
    brand-voice.ts         The marquee prompt
    product-positioning.ts One-liner per product
    support-draft.ts       (stub for Sprint 7)
  mock.ts                  Canned BrandIdentity when ANTHROPIC_API_KEY is unset
  schemas.ts               zod schemas for prompt outputs
```

### Move `/connect` from `apps/marketing` to `apps/operator`

`/connect` was a placeholder location. Operator-side UI belongs in `apps/operator`. The Stripe Connect adapter doesn't change — only the route file moves.

## Acceptance criteria

1. `apps/operator` runs on port 3001. Typechecks clean.
2. Operator signup creates an `auth.users` row (Supabase) + an `organizations` + `operators` row in core DB.
3. The 5-step onboarding flow walks end-to-end.
4. Brand-voice generation returns valid `BrandIdentity` JSON from Claude (or mock when no key).
5. Generated brand voice persists to `storefronts.brand_voice` and is used by the storefront preview.
6. Operator connects Stripe; account id lands on `operators.stripe_account_id`.
7. Dashboard reads from real DB and shows MRR + orders.
8. `apps/marketing/connect` is removed (replaced by the new `app.gtmstack.com/dashboard/settings/payouts` route).
9. `pnpm --filter @gtmstack/operator typecheck` and the rest of the workspace remain clean.

## Out of scope

- `apps/storefront` — separate sprint. For now operators see a preview that uses `apps/marketing` as the renderer.
- Real subdomain DNS (`brand.gtmstack.shop`) — provisioning logic is stubbed; real DNS wiring is Sprint 7.
- Customer support AI (`/api/ai/chat` for customer-facing chat) — Sprint 7.
- Provider portal — Sprint 7.
- Real-time analytics — Sprint 8.
- Distributor onboarding portal — Sprint 7+.

## Working order

1. **Setup parallel to user**: Supabase project creation + Anthropic API key (user) while I scaffold.
2. Sprint-6 brief (this file).
3. `@gtmstack/ai` package — types, prompts, client, mock fallback.
4. `@gtmstack/database-core` package — Supabase client + types + queries.
5. Initial Supabase migration (organizations, operators, storefronts, products, events tables with RLS).
6. `apps/operator` scaffold (Next.js, Tailwind preset, layout, theme).
7. `/signup` + `/login` pages — Supabase Auth.
8. Onboarding routes — vertical, brand (★), catalog, plan, launch.
9. `/api/ai/brand-voice` route — server action calling `@gtmstack/ai`.
10. Dashboard.
11. Move `/connect` from `apps/marketing` to `apps/operator/dashboard/settings/payouts`.
12. Typecheck. Commit. Push.

## Definition of done

A reviewer can:
- Visit `localhost:3001/signup`, create an account, complete onboarding.
- See Claude generate Prime Wellness-style copy from a one-paragraph description.
- Land on the dashboard.
- See their operator + organization + storefront rows in the Supabase dashboard.
- Visit `localhost:3001/dashboard/settings/payouts`, connect Stripe (mock mode by default; real mode if the GTMStack platform key is set).
- See `localhost:3000/products/sleep-stack` still works (apps/marketing untouched except `/connect` removed).
