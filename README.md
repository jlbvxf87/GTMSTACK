# GTMStack

Business deployment engine for branded wellness commerce.

> The product is not software. The product is business ownership at a price point and time horizon that wasn't previously available.

## Read first

- **[`docs/CLAUDE.md`](./docs/CLAUDE.md)** — architecture & engineering doctrine. Read at the start of every session.
- **[`docs/sprints/sprint-1-brief.md`](./docs/sprints/sprint-1-brief.md)** — active sprint scope.

This README intentionally stays thin. Doctrine lives in `docs/CLAUDE.md` and is the source of truth.

## Repo at a glance

```text
apps/
  marketing/   gtmstack.com
  operator/    app.gtmstack.com
  storefront/  operator branded stores
  provider/    providers.gtmstack.com
  admin/       internal team admin
packages/
  ui, database-core, database-clinical, auth, payments, ai,
  fulfillment, email, sms, jobs, compliance, analytics, config
supabase/
  core/migrations/        non-PHI
  clinical/migrations/    PHI — separate Supabase project, hard isolation
creative/                 design iterations (not shipped code)
docs/
  CLAUDE.md, sprints/, architecture/, compliance/, runbooks/
```

## Toolchain

```bash
node >= 20
pnpm >= 9
```

## Common commands

```bash
pnpm install
pnpm dev               # all apps via turbo
pnpm --filter marketing dev
pnpm --filter operator dev
pnpm build
pnpm typecheck
pnpm lint
```

## Remote

```text
git@github.com:jlbvxf87/GTMSTACK.git
```
