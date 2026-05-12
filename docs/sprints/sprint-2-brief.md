# Sprint 2 — Universal Component Library

> See `docs/CLAUDE.md` for foundational architecture. This brief is operational.

## Goal

Deliver the **seven universal sections** as theme-aware components in `packages/ui`. After this sprint, a complete operator storefront page can be composed from these seven blocks alone — and ships in clinical / wellness / community automatically because every block consumes tokens, not direct values.

## The seven

1. **`SiteHeader`** — top nav, logo + links + primary CTA, sticky on scroll, mobile menu.
2. **`BrandHero`** — Sprint 1 deliverable. Headline + subhead + CTAs + hero image. Already shipped.
3. **`FeatureGrid`** — product / program grid. 3–6 cards, each with image, name, eyebrow, price, optional subscription badge, single CTA per card.
4. **`ProgramDetails`** — value props / how it works. Numbered steps or icon-led claims (3–4 items), section eyebrow + headline + supporting paragraph.
5. **`SocialProof`** — testimonials. 1 large quote with attribution + 3 short quotes in a row; rating row optional.
6. **`FAQAccordion`** — frequently asked questions, expand/collapse, structured for the search engines too (FAQPage JSON-LD).
7. **`SiteFooter`** — link columns, brand mark, compliance disclaimer (operator vs. licensed partner separation must be visible per doctrine).

## Acceptance criteria

1. Each section is a server component (no `"use client"` unless interactivity strictly requires it — accordion expand likely justifies `use client`).
2. Each section reads ONLY from token-driven Tailwind classes. No hard-coded colors / fonts / radii.
3. Each section has a Storybook story showing it in **all three themes** stacked (same `ThreeUp` pattern as `BrandHero.stories.tsx`).
4. `FeatureGrid` accepts a `products: Product[]` prop typed against `@gtmstack/shared` schemas (or a local placeholder type if shared hasn't shipped yet).
5. `SiteFooter` renders the operator/partner role separation disclaimer text — wording approved by compliance (placeholder text acceptable for V1, marked `TODO: compliance review`).
6. `apps/marketing/app/(marketing)/page.tsx` composes all seven sections in order. `localhost:3000` shows a full Prime Wellness storefront page, not just a hero.
7. The marketing app still typechecks clean (`pnpm --filter @gtmstack/marketing typecheck`).

## Out of scope

- Real product data (mocked).
- Real testimonials (placeholder text).
- Search / filter / pagination on `FeatureGrid` — that's Sprint 3 (Product Page).
- Cart / checkout state — Sprint 5.
- Operator config UI — Sprint 6.

## Working order

1. `SiteHeader` + `SiteFooter` — page chrome. Once these exist, every other section renders inside a complete-looking page.
2. `FeatureGrid` — second-most-visible section, sets the visual tone for cards system-wide.
3. `ProgramDetails`, `SocialProof`, `FAQAccordion` — supporting sections.
4. Wire all seven into `apps/marketing/(marketing)/page.tsx`.
5. Storybook three-up for each, plus one `FullPage.stories.tsx` composing the whole sequence in each theme.

## Definition of done

- Open `localhost:3000` → scroll past a complete Prime Wellness storefront page.
- Open Storybook → see every section in clinical / wellness / community side-by-side.
- A new operator could ship a storefront tomorrow with just these seven blocks and their own content.
