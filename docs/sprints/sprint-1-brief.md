# Sprint 1 — Design Token & Theme System

> See `docs/CLAUDE.md` for foundational architecture. This brief is the day-to-day operational reference.

## Goal

Deliver the design token system, theme infrastructure, and a working `<BrandHero>` rendered in all three themes — validated side-by-side in Storybook.

This is the foundation everything else sits on. Sprint 2 builds the seven universal sections on top of the same token system.

## Acceptance criteria

1. `packages/ui/src/tokens/` contains complete token definitions for **clinical**, **wellness**, and **community** themes including:
   - colors (background, foreground, brand, accent, muted, border, destructive)
   - typography (display, body, mono families + scale + line-heights)
   - spacing rhythm (section padding, stack gaps)
   - card shapes (radius, border, shadow)
   - button philosophy (radius, weight, hover behavior)
   - image treatment (radius, filter, aspect)
   - motion language (duration, easing, intensity)
2. `packages/ui/src/theme-provider.tsx` exposes the active theme to consuming components via CSS variables.
3. Tailwind config reads from the active theme via `@gtmstack/ui/tailwind-preset`.
4. Three typography pairings are configured (one per theme), self-hosted via `next/font`.
5. A `<BrandHero>` component in `packages/ui/src/components/` renders correctly in all three themes.
6. The hero is wired into `apps/marketing/app/(marketing)/page.tsx` with **Prime Wellness** as the demo brand (wellness theme).
7. Storybook shows all three theme variants of `<BrandHero>` side-by-side.
8. The marketing app deploys to Vercel preview successfully.

## Out of scope

- Any backend functionality
- Operator signup
- Storefront rendering
- AI integration
- Database setup beyond initial Supabase project creation
- The other six universal sections (Sprint 2)

## Working order

1. ✅ Tokens — define the `Theme` type, then write `clinical.ts` / `wellness.ts` / `community.ts`.
2. ✅ `ThemeProvider` — server component that emits CSS variables on a wrapper div.
3. ✅ Tailwind preset — maps CSS variables to Tailwind theme keys so `bg-brand`, `text-foreground`, `rounded-card`, etc. work.
4. `<BrandHero>` — server component, Tailwind-only styles, consumes theme via tokens (not direct colors).
5. Storybook config + three-theme story.
6. Wire into `apps/marketing/app/(marketing)/page.tsx`.
7. Vercel preview deploy.

Steps 1–3 are sketched in `packages/ui` already (pending toolchain install). Steps 4–7 wait on `pnpm install` working.

## Definition of done

A reviewer can:
- Open Storybook, see `<BrandHero>` in clinical / wellness / community side-by-side.
- See clear visual differentiation — not just color swaps.
- Pull the Vercel preview URL for `apps/marketing` and see the wellness version on `/` with Prime Wellness branding.
