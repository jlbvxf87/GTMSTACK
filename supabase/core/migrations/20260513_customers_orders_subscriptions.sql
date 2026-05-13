-- ============================================================================
-- Sprint 7a — customer-side schema.
--
-- Adds customers, orders, subscriptions tables + RLS. Run once in your
-- Supabase SQL editor after the initial schema.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

create table if not exists public.customers (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  email            text not null,
  first_name       text,
  last_name        text,
  created_at       timestamptz not null default now(),
  unique (user_id, organization_id)
);

create index if not exists customers_user_idx on public.customers (user_id);
create index if not exists customers_organization_idx on public.customers (organization_id);

create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations(id) on delete cascade,
  customer_id         uuid not null references public.customers(id) on delete cascade,
  product_slug        text not null,
  amount_cents        integer not null,
  currency            text not null default 'USD',
  mode                text not null check (mode in ('subscription', 'payment')),
  stripe_session_id   text,
  status              text not null default 'active'
                       check (status in ('active', 'paused', 'canceled', 'refunded', 'failed')),
  created_at          timestamptz not null default now()
);

create index if not exists orders_organization_idx on public.orders (organization_id);
create index if not exists orders_customer_idx on public.orders (customer_id);
create index if not exists orders_stripe_session_idx on public.orders (stripe_session_id);

create table if not exists public.subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  organization_id          uuid not null references public.organizations(id) on delete cascade,
  customer_id              uuid not null references public.customers(id) on delete cascade,
  product_slug             text not null,
  amount_cents             integer not null,
  stripe_subscription_id   text,
  status                   text not null default 'active'
                            check (status in ('active', 'paused', 'canceled')),
  current_period_end       timestamptz,
  created_at               timestamptz not null default now()
);

create index if not exists subscriptions_organization_idx on public.subscriptions (organization_id);
create index if not exists subscriptions_customer_idx on public.subscriptions (customer_id);
create index if not exists subscriptions_stripe_idx on public.subscriptions (stripe_subscription_id);

-- ----------------------------------------------------------------------------
-- Helper — resolve current_customer_id() from auth.uid()
-- ----------------------------------------------------------------------------

create or replace function public.current_customer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.customers where user_id = auth.uid() limit 1;
$$;

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.subscriptions enable row level security;

-- customers: a customer can read/write only their own row.
-- Operators can read customers in their organization.
drop policy if exists customers_self_select on public.customers;
create policy customers_self_select on public.customers
  for select using (
    user_id = auth.uid()
    or organization_id = public.current_organization_id()
  );

drop policy if exists customers_self_insert on public.customers;
create policy customers_self_insert on public.customers
  for insert with check (user_id = auth.uid());

drop policy if exists customers_self_update on public.customers;
create policy customers_self_update on public.customers
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- orders: customer reads their own; operator reads their org's.
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders
  for select using (
    customer_id = public.current_customer_id()
    or organization_id = public.current_organization_id()
  );

-- subscriptions: same pattern.
drop policy if exists subscriptions_select on public.subscriptions;
create policy subscriptions_select on public.subscriptions
  for select using (
    customer_id = public.current_customer_id()
    or organization_id = public.current_organization_id()
  );

drop policy if exists subscriptions_self_update on public.subscriptions;
create policy subscriptions_self_update on public.subscriptions
  for update using (customer_id = public.current_customer_id())
  with check (customer_id = public.current_customer_id());

-- Note: orders + subscriptions inserts come from the Stripe webhook handler
-- via the service-role client (bypasses RLS). No insert policy needed for
-- regular users.

-- ============================================================================
-- Done.
-- ============================================================================
