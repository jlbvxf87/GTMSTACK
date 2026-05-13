# Sprint 7b — apps/provider + AI retention sequences

## Goal

Two pieces, separate audiences, shipped together because both depend on the same partner-relationship gap:

1. **`apps/provider`** — physician portal at `providers.gtmstack.com` where partner physicians review clinical-tier intakes (peptides, hormones), approve / decline / request more info, send messages to patients.
2. **AI retention sequences** via `@gtmstack/jobs` (Inngest) — welcome series, 30-day check-in, refill nudges, win-back, lab-upload reminders. Drafted by Claude, approved by ops (or auto-sent for low-risk templates).

Both pieces are **architecturally complete + honest about the partner gap**: provider portal works, but until you sign a partner physician corp, the intake queue is empty by design. AI retention scaffolds + prompts exist, but Inngest endpoint sits dormant until you wire your Inngest signing key.

## Out of scope

- Real clinical Supabase project — doctrine line 41 mandates a second Supabase project for PHI; until partners sign and you create that project, `pending_intakes` lives in core with a `TODO(clinical-supabase)` migration note.
- DEA / controlled-substance flows (Schedule III/IV/V) — never in V1.
- Real provider Stripe Connect — providers are paid via PC contract, not platform fee splits, until 7c.

## Tables (added to migration)

```sql
pending_intakes (
  id uuid pk,
  organization_id uuid fk → organizations,
  customer_email text not null,             -- before customer signs up
  customer_id uuid fk → customers null,     -- backfilled when customer signs up
  product_slug text not null,
  payload jsonb not null,                   -- the IntakeState shape from Sprint 4
  status text default 'pending_review',     -- 'pending_review' | 'approved' | 'declined' | 'more_info'
  reviewed_by_provider_id uuid null,
  reviewed_at timestamptz null,
  decision_notes text null,
  created_at timestamptz default now()
)

providers (
  id uuid pk,
  user_id uuid fk → auth.users,
  email text not null unique,
  display_name text,
  licensed_states text[] default '{}',
  status text default 'active',             -- 'active' | 'paused'
  created_at timestamptz default now()
)

intake_messages (
  id uuid pk,
  pending_intake_id uuid fk → pending_intakes,
  author text not null,                     -- 'provider' | 'patient' | 'system'
  body text not null,
  created_at timestamptz default now()
)
```

RLS:
- Providers can read all `pending_intakes` (across operators — they're the network, not employed by any operator). Service-role inserts on signup-from-intake.
- Customers can read their own `pending_intakes` (matched by customer_id or email).
- Operators can read intakes for their organization.

## Provider auth

Until clinical Supabase project ships:
- Providers sign in via the **core** Supabase Auth.
- A `providers` table row links auth user to their licensed states.
- The login flow gates on email being in `providers` table (registered manually by GTMStack staff for V1).
- `requireProvider()` helper checks the link.

When clinical Supabase ships, providers migrate to that project's auth.

## `@gtmstack/jobs` (Inngest scaffold)

```
packages/jobs/src/
  client.ts                 Inngest client singleton, mock fallback
  events.ts                 Canonical job event names + zod payloads
  functions/
    welcome-series.ts       Triggered by order.created. 3-step series
                            over 7 days. Each step's email body drafted
                            by Claude (brand_voice-aware) via @gtmstack/ai.
    thirty-day-checkin.ts   Triggered 30 days after order.created.
                            'How's it going?' message with optional
                            adjust-stack CTA.
    refill-nudge.ts         Triggered when subscription.current_period_end
                            is < 5 days away. Email + SMS option.
    win-back.ts             Triggered by subscription.canceled.
                            Two-touch sequence over 14 days.
    intake-pending-reminder.ts
                            Triggered when pending_intakes.created_at
                            > 24h ago and no provider review yet.
                            Notifies operator + provider.
```

Mock fallback: when `INNGEST_EVENT_KEY` isn't set, `inngest.send(event)` logs to console only. Production wires the real Inngest endpoint.

## apps/provider routes

| Route | Purpose |
|---|---|
| `/login`, `/signout` | Provider auth |
| `/queue` | Pending intake queue, newest first |
| `/queue/[id]` | Single intake — full payload, decision panel, message thread |
| `/api/queue/[id]/approve`, `/decline`, `/request-info` | Server actions |

## Acceptance criteria

1. Migration applied; pending_intakes, providers, intake_messages exist with RLS.
2. apps/provider scaffolded on port 3003, typechecks.
3. Intake from a clinical-tier product (Sprint 4 flow) writes a row to `pending_intakes` instead of just landing on `/start/review-pending`.
4. A provider logged in at `localhost:3003/queue` sees that intake.
5. Approving or declining writes a row to `intake_messages` + flips the intake status + triggers an Inngest event (`intake.reviewed`).
6. `@gtmstack/jobs` typechecks. Inngest endpoint at `apps/operator/api/inngest` registers all five functions. Without `INNGEST_EVENT_KEY` it operates in mock mode and logs sends.

## Working order

1. Migration SQL for pending_intakes + providers + intake_messages.
2. database-core queries for pending_intakes + providers.
3. Wire `apps/marketing/app/start/review-pending` to actually `insert into pending_intakes` (currently just renders text).
4. `@gtmstack/jobs` package skeleton + 5 function stubs.
5. apps/provider scaffold (Next.js shell, port 3003).
6. apps/provider auth + queue + decision flow.
7. Inngest endpoint registration in apps/operator.
8. Typecheck, commit, push.

## Definition of done

A reviewer can:
- Submit an intake for Peptide Performance via storefront `/start`.
- See a row in `pending_intakes` with `status = 'pending_review'`.
- Sign in to apps/provider at `localhost:3003` (manually inserted provider row with their email).
- See the intake in the queue → click to view → approve.
- See the intake status flip to `'approved'` + new row in `intake_messages` + new event in `events`.
- Inngest mock-mode logs the chain of would-be retention emails to the dev terminal.
