# Sprint 7a — apps/storefront + apps/patient

> See `docs/CLAUDE.md` for the doctrine. Sprint 7 was originally bundled (storefront + provider + patient + AI retention). Splitting it: 7a ships the customer-visible side; 7b ships the regulated-tier side. This brief covers 7a only.

## Goal

After 7a:
1. **`apex-wellness.gtmstack.shop`** (today a placeholder string on the operator dashboard) **becomes a real reachable URL pattern.** Customers land on the operator's branded storefront — same Sprint 2 universal sections, but every value (brand voice, products, theme, footer copy) comes from that operator's Supabase rows.
2. **Post-purchase customers** get a member portal at `apex-wellness.gtmstack.shop/account` — subscription status, recent orders, account settings.
3. The customer checkout flow already in apps/marketing keeps working; it now resolves the operator from the storefront request instead of the Prime Wellness fixture.

## What ships

### NEW: `apps/storefront` (port 3002)

| Route | Purpose |
|---|---|
| `/` | Operator's branded home — `<BrandHero>` (with brand_voice tagline/eyebrow/headline/subhead) + `<FeatureGrid>` (their products) + `<ProgramDetails>` + `<SocialProof>` + `<FAQAccordion>` (brand_voice.faqDrafts) + `<SiteFooter>` (compliance disclaimer per theme) |
| `/products/[slug]` | Product detail (Sprint 3 components: ProductHero / ProductDetailsBlock / ProductIngredients / ProductReviews / RelatedProducts) |
| `/start` | Intake (Sprint 4 5-step) for clinical-tier products |
| `/account` | Member portal (signed-in customer) |
| `/account/orders` | Order history |
| `/account/subscriptions` | Active subscriptions, pause/cancel |
| `/account/login`, `/account/signup` | Customer auth (separate Supabase user from operator) |

### Operator resolution

Storefront resolves "which operator is this?" by:
1. **Production**: `Host` header — `apex-wellness.gtmstack.shop` → look up `operators` where `storefront_slug = 'apex-wellness'`.
2. **Dev**: `?operator=apex-wellness` query param fallback so `localhost:3002/?operator=apex-wellness` works without DNS.

Layout reads operator + storefront + product_listings from Supabase, wraps page in `<ThemeProvider theme={operator.theme}>`.

### Customer auth

Customers are NOT operators. Separate Supabase auth context: new table `customers (id, user_id, email, operator_id, created_at)` linking auth.users to the operator they belong to. RLS scoped so customers only see their own data + their operator's products.

### `apps/patient` decision

Per doctrine line 53 the customer-facing portal lives at the operator's storefront subdomain (`/account/*`), not a separate app. So **no separate `apps/patient`** — those routes live inside `apps/storefront`. Cleaner: one DNS resolves to one app per operator.

## Schema additions (Sprint 7a migration)

```sql
create table public.customers (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email           text not null,
  first_name      text,
  last_name       text,
  created_at      timestamptz not null default now(),
  unique (user_id, organization_id)
);

create table public.orders (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  customer_id      uuid not null references public.customers(id) on delete cascade,
  product_slug     text not null,
  amount_cents     integer not null,
  currency         text not null default 'USD',
  mode             text not null,                      -- 'subscription' | 'payment'
  stripe_session_id text,
  status           text not null default 'active',     -- 'active' | 'paused' | 'canceled' | 'refunded'
  created_at       timestamptz not null default now()
);

create table public.subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  organization_id          uuid not null references public.organizations(id) on delete cascade,
  customer_id              uuid not null references public.customers(id) on delete cascade,
  product_slug             text not null,
  amount_cents             integer not null,
  stripe_subscription_id   text,
  status                   text not null default 'active',
  current_period_end       timestamptz,
  created_at               timestamptz not null default now()
);
```

RLS: customer can read/write only their own customer/order/subscription rows. Operator can read their organization's customer/order/subscription rows (via existing `current_organization_id()`).

## Acceptance criteria

1. `apps/storefront` runs on port 3002. Typechecks clean.
2. `http://localhost:3002/?operator=apex-wellness` renders Apex Wellness's storefront — brand voice copy, theme tokens, listed products all from your Supabase row.
3. `http://localhost:3002/products/sleep-stack?operator=apex-wellness` works.
4. Customer can sign up at `/account/signup?operator=apex-wellness` → creates auth.users + customers row.
5. After signup, customer can buy a product → order + subscription rows created via the existing webhook flow (Sprint 5 event handlers wire to these tables).
6. `/account` shows the customer's active subscriptions + recent orders.
7. Operator dashboard's "Recent activity" + MRR / subscribers stats start populating from real `events` + `orders` + `subscriptions` rows.

## Out of scope (Sprint 7b)

- Provider portal (`apps/provider`) — physicians reviewing clinical intakes
- AI retention sequences via Inngest (welcome series, 30-day check-in, refill nudges)
- Three-way Stripe split for clinical orders (PC + pharmacy + operator + platform)
- Real DNS for `*.gtmstack.shop` — dev uses query param, prod wires Vercel domain API later
- `apps/admin` for GTMStack staff

## Working order

1. Sprint 7a brief (this file).
2. Migration SQL for `customers`, `orders`, `subscriptions` + RLS.
3. Scaffold `apps/storefront` (Next.js shell + Tailwind + theme provider).
4. Storefront layout + operator resolver from subdomain / query param.
5. Storefront home page composing Sprint 2 components against operator's data.
6. Product detail + intake routes (port from apps/marketing).
7. Customer auth (`/account/signup`, `/account/login`).
8. Member portal pages (`/account`, `/account/orders`, `/account/subscriptions`).
9. Update apps/marketing's `/api/checkout` to write to `orders` / `subscriptions` on `checkout.session.completed`.
10. Operator dashboard `Recent activity` reads from new tables.
11. Typecheck, commit, push.

## Definition of done

A reviewer can:
- Visit `localhost:3002/?operator=apex-wellness` → see Apex Wellness's storefront, real brand voice.
- Sign up as a customer, buy Sleep Stack via mock checkout.
- `orders` + `subscriptions` rows land in Supabase.
- Log into `/account` — see the subscription.
- Switch to the operator dashboard at `localhost:3001/dashboard` — see the new order + subscriber count + MRR update.
