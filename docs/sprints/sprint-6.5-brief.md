# Sprint 6.5 — Supabase Auth + Database Persistence

> Mini-sprint to swap the operator-cookie scaffolding from Sprint 6 with real Supabase Auth and a real `@gtmstack/database-core` package backed by the operator's Supabase project.

## Goal

After this sprint:
- Operators sign up with email + password (Supabase Auth on the core project).
- Operator + organization + storefront data persists in Supabase, not a cookie.
- An operator can sign out, sign in again from a different browser, and see their state.
- Multiple operators can coexist.
- The `apps/marketing` checkout flow looks up the real operator row to route platform fees correctly.

## What ships

1. **Migration SQL** at `supabase/core/migrations/20260512_initial.sql` — defines the V1 schema with RLS policies. User applies it via Supabase SQL Editor.
2. **`@gtmstack/database-core`** real implementation:
   - `src/server-client.ts` — `createServerClient()` using `@supabase/ssr` + Next.js `cookies()`.
   - `src/browser-client.ts` — `createBrowserClient()` for any client component.
   - `src/admin-client.ts` — service-role client for server-side writes that need to bypass RLS (e.g., initial operator provisioning).
   - `src/types.ts` — types matching the schema. Can be regenerated via `supabase gen types typescript` later.
   - `src/queries/operators.ts`, `storefronts.ts`, `events.ts` — typed query helpers.
3. **Auth wiring in `apps/operator`**:
   - `middleware.ts` — refreshes the Supabase session cookie on every request.
   - `/signup/page.tsx` — Supabase Auth signup (email + password + confirm email later in Sprint 7).
   - `/login/page.tsx` — Supabase Auth login.
   - `/signout/route.ts` — signOut server action.
   - `lib/operator-session.ts` — swapped to read from `auth.getUser()` + the `operators` table.
4. **Migration of existing cookie data**: operator session reads from Supabase first, falls back to cookie. After successful login, cookie state migrates into the DB.

## Acceptance criteria

1. User runs the migration once in their Supabase project. Tables exist.
2. Visit `/signup` → email + password → account created (visible in Supabase dashboard → Authentication tab).
3. After signup, `organizations` and `operators` rows exist for the user (visible in Table Editor).
4. Walk the 5-step onboarding. The brand voice, plan, etc. write to `operators` + `storefronts`.
5. Open an incognito window → `/login` with same credentials → land on `/dashboard` with all your state intact.
6. `pnpm --filter @gtmstack/database-core typecheck` and `pnpm --filter @gtmstack/operator typecheck` clean.

## Out of scope

- **Clinical Supabase project** — separate database, separate auth context. Sprint 7.
- **Magic links / OAuth providers** — Sprint 7 polish.
- **Password reset flow** — Sprint 7.
- **Email verification gating** — Sprint 7 (operators can use the dashboard immediately for V1).
- **Real operator listing in `apps/marketing` checkout** — Sprint 7 (today's checkout uses Prime Wellness as the default operator from the demo brand fixture).

## Schema (V1 core)

```sql
-- Operators: each row is one GTMStack customer. Linked to auth.users.
create table public.operators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan operator_plan not null default 'starter',
  state text,
  stripe_account_id text,
  created_at timestamptz not null default now()
);

-- Organizations: brand + business entity. One operator per org for V1.
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  vertical text,                    -- 'wellness' | 'clinical' | 'community'
  created_at timestamptz not null default now()
);

-- Storefronts: the live storefront — brand voice, theme, listed products.
create table public.storefronts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  slug text not null unique,
  theme storefront_theme not null,
  brand_voice jsonb,                -- the BrandIdentity schema
  status storefront_status not null default 'draft',
  created_at timestamptz not null default now()
);

-- Product listings: which catalog products this storefront sells.
create table public.product_listings (
  id uuid primary key default gen_random_uuid(),
  storefront_id uuid not null references public.storefronts(id) on delete cascade,
  product_slug text not null,
  retail_price_cents integer,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique (storefront_id, product_slug)
);

-- Events: canonical event stream emitted by payments + jobs.
create table public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  type text not null,               -- 'order.created', 'subscription.renewed', etc.
  payload jsonb not null,
  occurred_at timestamptz not null default now()
);
```

Every table has RLS enabled with policies allowing an operator to read/write only their organization's rows.

## Working order

1. **Brief** (this).
2. **Cleanup**: fix `.env.local` whitespace (already done).
3. **Migration SQL** — user applies in Supabase SQL Editor.
4. **`@gtmstack/database-core` real implementation**.
5. **Wire auth into `apps/operator`** — `/signup` + `/login` + `middleware.ts` + swap `operator-session.ts`.
6. **Test**: signup, sign out, sign in from incognito, walk onboarding, refresh.
7. Commit, push.
