-- ============================================================================
-- Sprint 7b — clinical intake review + provider network.
--
-- TODO(clinical-supabase): per docs/CLAUDE.md the clinical PHI tables (these)
-- belong in a separate Supabase project. Until that project is provisioned
-- they live in core; the schema is identical so migration is a copy + drop.
-- ============================================================================

create table if not exists public.providers (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade unique,
  email           text not null unique,
  display_name    text,
  licensed_states text[] not null default '{}'::text[],
  status          text not null default 'active'
                   check (status in ('active', 'paused', 'offboarded')),
  created_at      timestamptz not null default now()
);

create index if not exists providers_user_idx on public.providers (user_id);

create table if not exists public.pending_intakes (
  id                       uuid primary key default gen_random_uuid(),
  organization_id          uuid not null references public.organizations(id) on delete cascade,
  customer_email           text not null,
  customer_id              uuid references public.customers(id) on delete set null,
  product_slug             text not null,
  payload                  jsonb not null,
  status                   text not null default 'pending_review'
                            check (status in ('pending_review', 'approved', 'declined', 'more_info')),
  reviewed_by_provider_id  uuid references public.providers(id) on delete set null,
  reviewed_at              timestamptz,
  decision_notes           text,
  created_at               timestamptz not null default now()
);

create index if not exists pending_intakes_organization_idx on public.pending_intakes (organization_id);
create index if not exists pending_intakes_customer_idx on public.pending_intakes (customer_id);
create index if not exists pending_intakes_status_idx on public.pending_intakes (status);

create table if not exists public.intake_messages (
  id                   uuid primary key default gen_random_uuid(),
  pending_intake_id    uuid not null references public.pending_intakes(id) on delete cascade,
  author               text not null check (author in ('provider', 'patient', 'system')),
  body                 text not null,
  created_at           timestamptz not null default now()
);

create index if not exists intake_messages_intake_idx on public.intake_messages (pending_intake_id);

-- ----------------------------------------------------------------------------
-- Helpers
-- ----------------------------------------------------------------------------

create or replace function public.current_provider_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.providers where user_id = auth.uid() limit 1;
$$;

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------

alter table public.providers enable row level security;
alter table public.pending_intakes enable row level security;
alter table public.intake_messages enable row level security;

-- providers: a provider can read their own row. Service-role staff
-- manages provider onboarding (no policy = no rls insert from regular users).
drop policy if exists providers_self_select on public.providers;
create policy providers_self_select on public.providers
  for select using (user_id = auth.uid());

drop policy if exists providers_self_update on public.providers;
create policy providers_self_update on public.providers
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- pending_intakes:
--   Providers can read all (the network).
--   Operators read their org's.
--   Customers read their own (by customer_id or matched email).
drop policy if exists pending_intakes_select on public.pending_intakes;
create policy pending_intakes_select on public.pending_intakes
  for select using (
    public.current_provider_id() is not null
    or organization_id = public.current_organization_id()
    or customer_id = public.current_customer_id()
  );

drop policy if exists pending_intakes_provider_update on public.pending_intakes;
create policy pending_intakes_provider_update on public.pending_intakes
  for update using (public.current_provider_id() is not null)
  with check (public.current_provider_id() is not null);

-- intake_messages: same audience as the parent intake. Providers + customers
-- (when matched) + operators of the org can read.
drop policy if exists intake_messages_select on public.intake_messages;
create policy intake_messages_select on public.intake_messages
  for select using (
    pending_intake_id in (
      select id from public.pending_intakes
      where public.current_provider_id() is not null
        or organization_id = public.current_organization_id()
        or customer_id = public.current_customer_id()
    )
  );

drop policy if exists intake_messages_provider_insert on public.intake_messages;
create policy intake_messages_provider_insert on public.intake_messages
  for insert with check (public.current_provider_id() is not null);

drop policy if exists intake_messages_customer_insert on public.intake_messages;
create policy intake_messages_customer_insert on public.intake_messages
  for insert with check (
    pending_intake_id in (
      select id from public.pending_intakes
      where customer_id = public.current_customer_id()
    )
  );

-- ============================================================================
-- Done.
-- ============================================================================
