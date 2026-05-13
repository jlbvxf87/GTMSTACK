-- ============================================================================
-- GTMStack core — V1 initial schema.
--
-- Run this once in your Supabase project's SQL Editor (any time after the
-- project is created). It's idempotent on table creation but enums + RLS
-- policies will error on re-run — that's fine, just ignore those.
--
-- Apply via: Supabase dashboard → SQL Editor → New query → paste → Run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------

do $$ begin
  create type public.operator_plan as enum ('starter', 'growth', 'pro', 'clinical');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.storefront_theme as enum ('wellness', 'clinical', 'community');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.storefront_status as enum ('draft', 'live', 'paused', 'archived');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

create table if not exists public.organizations (
  id              uuid primary key default gen_random_uuid(),
  owner_user_id   uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  slug            text not null unique,
  vertical        text,
  created_at      timestamptz not null default now()
);

create index if not exists organizations_owner_idx on public.organizations (owner_user_id);

create table if not exists public.operators (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  organization_id     uuid not null references public.organizations(id) on delete cascade,
  plan                public.operator_plan not null default 'starter',
  state               text,
  stripe_account_id   text,
  brand_name          text,
  storefront_slug     text,
  onboarded           boolean not null default false,
  created_at          timestamptz not null default now(),
  unique (user_id, organization_id)
);

create index if not exists operators_user_idx on public.operators (user_id);
create index if not exists operators_organization_idx on public.operators (organization_id);

create table if not exists public.storefronts (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations(id) on delete cascade,
  slug                text not null unique,
  theme               public.storefront_theme not null,
  brand_voice         jsonb,
  status              public.storefront_status not null default 'draft',
  created_at          timestamptz not null default now()
);

create index if not exists storefronts_organization_idx on public.storefronts (organization_id);

create table if not exists public.product_listings (
  id                  uuid primary key default gen_random_uuid(),
  storefront_id       uuid not null references public.storefronts(id) on delete cascade,
  product_slug        text not null,
  retail_price_cents  integer,
  enabled             boolean not null default true,
  created_at          timestamptz not null default now(),
  unique (storefront_id, product_slug)
);

create index if not exists product_listings_storefront_idx on public.product_listings (storefront_id);

create table if not exists public.events (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid references public.organizations(id) on delete cascade,
  type                text not null,
  payload             jsonb not null,
  occurred_at         timestamptz not null default now()
);

create index if not exists events_organization_idx on public.events (organization_id);
create index if not exists events_type_idx on public.events (type);

-- ----------------------------------------------------------------------------
-- Row Level Security — every table on.
-- ----------------------------------------------------------------------------

alter table public.organizations enable row level security;
alter table public.operators enable row level security;
alter table public.storefronts enable row level security;
alter table public.product_listings enable row level security;
alter table public.events enable row level security;

-- ----------------------------------------------------------------------------
-- Helpers
-- ----------------------------------------------------------------------------

-- Returns the organization_id of the operator's row keyed on auth.uid().
-- Used inside RLS policies so we don't repeat the join.
create or replace function public.current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id
  from public.operators
  where user_id = auth.uid()
  limit 1;
$$;

-- ----------------------------------------------------------------------------
-- Policies
-- ----------------------------------------------------------------------------

-- organizations
drop policy if exists organizations_own_select on public.organizations;
create policy organizations_own_select on public.organizations
  for select using (owner_user_id = auth.uid());

drop policy if exists organizations_own_update on public.organizations;
create policy organizations_own_update on public.organizations
  for update using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

drop policy if exists organizations_own_insert on public.organizations;
create policy organizations_own_insert on public.organizations
  for insert with check (owner_user_id = auth.uid());

-- operators
drop policy if exists operators_own_select on public.operators;
create policy operators_own_select on public.operators
  for select using (user_id = auth.uid());

drop policy if exists operators_own_update on public.operators;
create policy operators_own_update on public.operators
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists operators_own_insert on public.operators;
create policy operators_own_insert on public.operators
  for insert with check (user_id = auth.uid());

-- storefronts: an operator can read/write storefronts for orgs they own
drop policy if exists storefronts_own_select on public.storefronts;
create policy storefronts_own_select on public.storefronts
  for select using (organization_id = public.current_organization_id());

drop policy if exists storefronts_own_update on public.storefronts;
create policy storefronts_own_update on public.storefronts
  for update using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

drop policy if exists storefronts_own_insert on public.storefronts;
create policy storefronts_own_insert on public.storefronts
  for insert with check (organization_id = public.current_organization_id());

-- product_listings: keyed via storefront → organization
drop policy if exists product_listings_own_select on public.product_listings;
create policy product_listings_own_select on public.product_listings
  for select using (
    storefront_id in (
      select id from public.storefronts
      where organization_id = public.current_organization_id()
    )
  );

drop policy if exists product_listings_own_write on public.product_listings;
create policy product_listings_own_write on public.product_listings
  for all using (
    storefront_id in (
      select id from public.storefronts
      where organization_id = public.current_organization_id()
    )
  )
  with check (
    storefront_id in (
      select id from public.storefronts
      where organization_id = public.current_organization_id()
    )
  );

-- events: read-only via dashboard; service role writes server-side
drop policy if exists events_own_select on public.events;
create policy events_own_select on public.events
  for select using (organization_id = public.current_organization_id());

-- ============================================================================
-- Done.
-- ============================================================================
