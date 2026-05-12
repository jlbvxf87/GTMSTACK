# GTMStack — Architecture & Engineering Doctrine

This document is the foundational reference for every engineering session on GTMStack. Read it at the start of every Claude Code session. Update it when foundational decisions evolve — not when features get added.

Sprint-specific briefs live in `docs/sprints/` and reference this document rather than repeating it.

---

## What we are building

GTMStack is a business deployment engine for branded wellness commerce. An operator signs up, configures their brand and product selection, and within hours has a complete wellness business running — branded storefront, payments, subscriptions, AI customer operations, compliant fulfillment, provider network, analytics. The operator brings audience, trust, and sales motion. GTMStack runs everything else.

The product is not software. The product is **business ownership at a price point and time horizon that wasn't previously available**. Software is the mechanism. Every engineering decision should reinforce that the operator is launching a real business, not a side hustle.

---

## The five operator types we serve

1. Creators and influencers with audiences in fitness, wellness, longevity, or biohacking
2. Wellness coaches and practitioners with existing client books
3. Med spas and hormone clinics extending in-person revenue with direct-ship products
4. Fitness communities and gyms monetizing their community with branded supplements and protocols
5. Healthcare providers and clinicians launching branded patient programs or supplement lines

These map onto three template families: Clinical Performance, Wellness, and Community. Theme selection is part of operator onboarding.

---

## Core architectural decisions

These are the foundational decisions. Do not change them without an explicit conversation about why.

### One codebase, three theme configurations

The template system is a single Next.js codebase with a token-driven theme system, not three separate codebases. The Clinical Performance, Wellness, and Community templates share identical structural conversion architecture and diverge only in their design tokens (colors, typography, spacing rhythm, card shapes, motion language, imagery treatment).

This decision matters because every conversion fix ships once, every new feature ships once, and the AI brand voice generation targets a single rendering system.

### Two Supabase projects — hard separation

GTMStack core data and clinical PHI never share a database.

- **Core Supabase project**: operators, brands, products, orders, subscriptions, AI operations, analytics, customer accounts, commerce data
- **Clinical Supabase project**: patient intakes, provider reviews, medical history, prescription records, provider-patient messages

Cross-project references are by stable opaque IDs only. The clinical project has stricter RLS policies, audit logging at every read, and separate auth contexts. This separation is a compliance requirement, not a preference, and is non-negotiable.

### Four apps plus an internal admin

Each is a separate Next.js application deployed independently. They share design tokens and database packages via the monorepo but never share runtime state.

- `apps/marketing` — gtmstack.com, the marketing site
- `apps/operator` — app.gtmstack.com, the operator dashboard and onboarding
- `apps/storefront` — operator-facing branded stores under custom domains and `*.gtmstack.shop`
- `apps/provider` — providers.gtmstack.com, the clinical review interface
- `apps/admin` — internal GTMStack team admin

### Subscription is the default purchase model

Wellness commerce economics require subscription. Single purchase exists in the data model and UI but is subtly de-emphasized. The subscription option is pre-selected on every product page, framed as a "program" rather than a "plan," and surfaced in the operator dashboard as the primary revenue metric (MRR before total revenue).

### AI drafts, humans review

The AI layer never acts autonomously on medical or financial decisions. It drafts customer support responses, drafts provider message replies, generates brand voice copy, and surfaces conversion optimization suggestions. A human reviews anything that touches a patient relationship or a financial decision. This is encoded at the system level — provider-facing tools have approve/edit/reject flows; the AI does not have direct write access to patient records or refund decisions.

### Fulfillment adapter pattern

Each pharmacy, supplement supplier, and fulfillment partner is implemented as an adapter in `packages/fulfillment/adapters` conforming to a shared interface. A router selects the correct adapter per order based on product type, operator state, and patient state. New partners are added by writing a new adapter file, never by modifying core order flow.

### Stripe Connect for operators

Every operator is a Stripe Connect connected account. Platform fees route cleanly, payouts work natively, and 1099 obligations stay clean. For high-risk product categories (peptides, hormones, controlled categories), payment processing routes through CarePlug Pay infrastructure rather than Stripe.

---

## The stack

**Frontend & app framework**
- Next.js 14 with App Router on Vercel
- Server components for performance, server actions for mutations
- Tailwind CSS with token-driven theme system
- shadcn/ui as the component primitive layer
- TypeScript everywhere, strict mode

**Database & backend**
- Supabase (Postgres + Auth + Storage), two projects as described above
- Row-level security policies on every table
- Database migrations versioned in `supabase/core/migrations` and `supabase/clinical/migrations`

**Authentication**
- Supabase Auth on the core project for operators and customers
- Separate Supabase Auth on the clinical project for licensed providers
- Three distinct auth contexts; never share session state across contexts

**Payments**
- Stripe (Connect, Subscriptions, Tax) for standard commerce
- CarePlug Pay for high-risk categories
- A payment router in `packages/payments/router.ts` decides which rail per product

**AI**
- Anthropic API (Claude) as the primary brain
- Structured tool use for actions
- Prompts versioned as code in `packages/ai/prompts/`

**Email & SMS**
- Resend for transactional and marketing email
- Twilio for SMS
- Templates in `packages/email/templates/`

**Background jobs**
- Inngest for durable background work
- Job definitions in `packages/jobs/`
- All long-running, retry-required, or scheduled work goes through Inngest, never raw cron

**File storage**
- Supabase Storage for operator brand assets, product images, intake uploads
- Cloudflare R2 as the upgrade path if Supabase Storage hits limits

**Observability**
- PostHog for product analytics
- Sentry for error monitoring
- Axiom or Vercel Log Drains for structured logging
- Audit logging at the database layer for all PHI access and operator actions

**Monorepo & tooling**
- Turborepo
- pnpm as the package manager
- Shared ESLint, TSConfig, and Tailwind configs in `packages/config/`

---

## Repository structure

```
gtmstack/
├── apps/
│   ├── marketing/                    # gtmstack.com
│   ├── operator/                     # app.gtmstack.com
│   ├── storefront/                   # operator branded stores
│   ├── provider/                     # providers.gtmstack.com
│   └── admin/                        # internal team admin
│
├── packages/
│   ├── ui/                           # shadcn components + theme tokens
│   ├── database-core/                # Supabase client for core
│   ├── database-clinical/            # Supabase client for clinical (separate)
│   ├── auth/                         # shared auth utilities
│   ├── payments/                     # Stripe Connect + CarePlug Pay
│   ├── ai/                           # Anthropic API + prompts + tools
│   ├── fulfillment/                  # vendor adapters + router
│   ├── email/                        # Resend client + templates
│   ├── sms/                          # Twilio client
│   ├── jobs/                         # Inngest job definitions
│   ├── compliance/                   # audit, state rules, encryption
│   ├── analytics/                    # PostHog wrappers
│   └── config/                       # shared tooling configs
│
├── supabase/
│   ├── core/migrations/
│   └── clinical/migrations/
│
├── docs/
│   ├── CLAUDE.md                     # this file
│   ├── sprints/                      # per-sprint briefs
│   ├── architecture/
│   ├── compliance/
│   └── runbooks/
│
└── turbo.json, package.json, etc.
```

---

## The design token system

The theme system is the foundation of the product. Tokens are not just colors and fonts — they extend to section padding rhythm, card border radius, button shape philosophy, image treatment, and motion language. The depth of the token system is what makes operator stores feel like different companies built them rather than the same template wearing different paint.

Tokens live in `packages/ui/tokens/`:

- `clinical.ts` — Clinical Performance theme (dark backgrounds, electric accents, sharp typography, minimal motion)
- `wellness.ts` — Wellness theme (warm cream backgrounds, sage/terracotta/gold accents, editorial typography, gentle motion)
- `community.ts` — Community theme (bold high-energy colors, condensed typography, denser layouts, more visible motion)

Components in `packages/ui/components/` read from the active theme via a `ThemeProvider`. They never hardcode colors, spacing, or typography. They consume tokens.

The Prime Wellness demo brand referenced throughout product and marketing assets runs on the wellness theme.

---

## The Prime Wellness demo brand

Prime Wellness is GTMStack's canonical demo brand. It exists as a real running storefront at `primewellness.gtmstack.shop` (or similar) on the live infrastructure. Every screenshot on the marketing site is harvested from this running store. Every reference in product documentation uses Prime Wellness as the placeholder operator.

This mirrors how Stripe uses Rocket Rides — the demo brand is a real working instance, not a static mockup.

Prime Wellness product stack:
- Daily Greens — $49 one-time / $39 subscription
- Sleep Stack — $79/month subscription
- Recovery Kit — $129 one-time / $99 subscription
- Recovery Membership — $149/month
- Wellness Consult — $199 per session
- Performance Stack — $159/month

Brand register: warm editorial wellness, sage green + cream + warm gold, premium serif headlines.

---

## Engineering conventions

**TypeScript**
- Strict mode on, no `any` without an explicit reason and comment
- Database types generated from Supabase, never hand-written
- Shared types live in their respective packages and are imported, never copied

**Component structure**
- Server components by default
- `'use client'` only when interactivity requires it
- Forms use server actions, not API routes
- Data fetching at the page level or via server components, never client-side fetching for initial render

**Database access**
- Always via the relevant `database-core` or `database-clinical` package, never direct Supabase client instantiation in app code
- Queries co-located with their feature in `queries/` subdirectories of the database packages
- Every PHI read goes through an audit-logged accessor in `database-clinical`

**Auth and authorization**
- Operator auth, customer auth, and provider auth are three separate contexts
- Every server action and protected route checks auth context first
- RLS policies are the second layer of defense, not the first

**Error handling**
- User-facing errors return structured error responses, never raw exceptions
- Server errors log to Sentry with operator context
- AI errors degrade gracefully — if Claude is unreachable, the system continues without AI augmentation rather than failing user actions

**Naming**
- Database tables: `snake_case`, plural (`operators`, `subscriptions`, `provider_reviews`)
- TypeScript: `camelCase` for variables, `PascalCase` for types and components
- File names: `kebab-case.ts` for non-component files, `PascalCase.tsx` for components

**Testing**
- Critical financial paths (subscription creation, refund processing, payment routing) require integration tests
- AI prompts have eval suites in `packages/ai/evals/`
- Compliance-critical code (audit logging, RLS policies, encryption) requires tests

---

## Compliance requirements

These are not optional. Every engineer decision involving PHI, payment data, or operator funds must respect these.

- All PHI access is audit-logged at the database layer
- PHI is encrypted at rest in the clinical Supabase project
- HIPAA-compliant data handling for any patient-identifying information
- State-by-state regulatory rules in `packages/compliance/state-rules.ts` determine product availability per operator location
- Controlled substance handling routes through specific pharmacy adapters with additional verification
- Stripe Connect KYC for operators meeting volume thresholds
- 1099 generation for operators via Stripe Connect annually
- Data retention and deletion policies enforced via scheduled Inngest jobs

---

## How sprints work

The full GTMStack build is structured as eight sprints. Each sprint has a brief in `docs/sprints/sprint-N-brief.md` that references this document rather than repeating it.

1. **Design Token & Theme System** — the foundation everything else sits on
2. **Universal Component Library** — the seven universal sections as theme-aware components
3. **Product Page Architecture** — the highest-leverage page in the storefront
4. **Intake Flow** — the premium healthcare experience that differentiates from supplement stores
5. **Subscription & Checkout** — Stripe Connect + CarePlug Pay routing
6. **Operator Configuration & AI Brand Voice** — the magic moment where a brand comes alive
7. **Patient Portal & AI Retention Sequences** — the post-purchase relationship
8. **Operator Analytics Dashboard** — the CRM the operator actually runs the business from

Sprint 1 is the active sprint at the time this document was written.

---

## Sprint 1 scope (active)

Sprint 1 delivers the design token system, the theme infrastructure, and a working hero section for the marketing site rendered in all three themes, validated side-by-side in Storybook.

**Acceptance criteria:**

1. `packages/ui/tokens/` contains complete token definitions for clinical, wellness, and community themes including colors, typography, spacing rhythm, card shapes, button philosophy, image treatment, and motion language
2. `packages/ui/theme-provider.tsx` exposes the active theme to all consuming components via CSS variables
3. Tailwind config reads from the active theme
4. Three typography pairings are configured (one per theme), self-hosted via next/font
5. A `<BrandHero>` component in `packages/ui/components/` renders correctly in all three themes
6. The hero is wired into `apps/marketing/app/(marketing)/page.tsx` with Prime Wellness as the demo brand
7. Storybook shows all three theme variants of `<BrandHero>` side-by-side
8. The marketing app deploys to Vercel preview successfully

**Out of scope for Sprint 1:**

- Any backend functionality
- Operator signup
- Storefront rendering
- AI integration
- Database setup beyond initial Supabase project creation
- Any of the other six universal sections (those are Sprint 2)

---

## Operating principles for Claude Code

When working on this codebase:

1. **Read this document first.** Then read the active sprint brief in `docs/sprints/`.
2. **Verify before assuming.** If you're about to write code that depends on an architectural decision, check this document first. The two-Supabase rule, the theme token system, and the four-apps structure are the most common places to drift.
3. **Stay inside the active sprint scope.** Sprint creep is the failure mode. If something feels like it belongs in a later sprint, write a note in `docs/sprints/upcoming.md` and keep moving.
4. **Reuse patterns from CarePlug and CarePlug Pay where they apply.** The fulfillment adapter pattern, the encryption helpers, the Resend email patterns, and the high-risk payment routing are all established. Don't reinvent them.
5. **Prefer terse, exact commands.** No explanation padding. No conversational preamble. Get to the work.
6. **When in doubt, ship the smaller version.** A working hero in one theme beats a broken hero in three. Land Sprint 1's acceptance criteria, then expand.

---

End of foundational document. The active sprint brief is the operational reference for day-to-day work.
