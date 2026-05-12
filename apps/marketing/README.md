# apps/marketing

`gtmstack.com` — public marketing site. Screenshots harvested from the live Prime Wellness demo (`primewellness.gtmstack.shop`).

## Routes (Sprint 1 scope)

- `/` — landing, renders `<BrandHero>` from `@gtmstack/ui` with the wellness theme + Prime Wellness brand.

Later sprints add: operator types, template gallery, pricing, case studies.

## Scaffold

```bash
cd apps/marketing
pnpm create next-app@latest . --typescript --app --tailwind --eslint --src-dir --import-alias "@/*"
```

Then wire Tailwind to consume `@gtmstack/ui/tailwind-preset` and wrap the root layout in `<ThemeProvider theme="wellness">`.
