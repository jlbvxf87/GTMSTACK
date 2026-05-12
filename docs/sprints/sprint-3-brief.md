# Sprint 3 — Product Page Architecture

> See `docs/CLAUDE.md` for foundational architecture. This brief is operational.

## Goal

Deliver the **product detail page**. Per doctrine: *the highest-leverage page in the storefront*. Customers convert here, not on the marketing site.

Same theme system as Sprints 1–2. The product page works in clinical / wellness / community by virtue of token consumption — never by visual branching.

## Components

| Component | Responsibility |
|---|---|
| `ProductHero` | Gallery (left) + buy box (right). Subscribe-vs-one-time visible. Price block, primary CTA, trust line. The page's conversion surface. |
| `ProductDetailsBlock` | Long-form sections: "What's in it", "How it works", "Why it works". Accepts an array so operators can shape per product. |
| `ProductIngredients` | Ingredient panel — name, dose, role. Transparency by default. |
| `ProductReviews` | Review list with star ratings, attribution, verified-purchase badge. Includes average + count header. |
| `RelatedProducts` | Horizontal product strip; resolves related slugs to product cards. Reuses the same `ProductCard` as `FeatureGrid`. |

Plus a small refactor: extract `ProductCard` from `FeatureGrid` into its own exported component so `RelatedProducts` and any later cross-sell surface can reuse it without duplication.

## Type changes (additive, backward-compatible)

`Product` gains optional fields:

```ts
slug: string                       // required — drives /products/[slug] routing
gallery?: ProductGalleryImage[]    // hero gallery on the product page
longDescription?: string           // single paragraph below the hero
detailSections?: ProductDetailSection[]
ingredients?: Ingredient[]
reviews?: ProductReview[]
averageRating?: number             // computed from reviews if omitted
reviewCount?: number
relatedSlugs?: string[]
```

`Review`, `Ingredient`, `ProductDetailSection`, `ProductGalleryImage` types added.

## Route

`apps/marketing/app/products/[slug]/page.tsx` — temporary home for the product page. When `apps/storefront` scaffolds (Sprint 6), the page logic moves there unchanged because it consumes types from `@gtmstack/shared` and components from `@gtmstack/ui`. Static fallback to 404 if slug doesn't resolve.

## Acceptance criteria

1. All five components are theme-aware, server components by default (`use client` permitted only where strictly required — none expected this sprint).
2. Each component has a Storybook three-up story across clinical / wellness / community using demo brand fixtures.
3. Sleep Stack (Prime Wellness) has full demo content — gallery, long description, detail sections, ingredients, reviews, related slugs.
4. ApexRX's Peptide Performance and Iron Reserve's Whey Foundation also have product page content so the three-up stories are populated for all themes.
5. Visiting `http://localhost:3000/products/sleep-stack` renders a complete wellness-themed product page composing all five components.
6. Visiting an unknown slug returns 404 cleanly.
7. `pnpm --filter @gtmstack/ui typecheck` and `pnpm --filter @gtmstack/marketing typecheck` are clean.

## Out of scope

- **Cart state / add-to-cart behavior** — Sprint 5.
- **Real subscribe-vs-one-time interactivity** — Sprint 3 renders both options as visible radio cards but does not toggle price reactively. Sprint 5 wires that to checkout state.
- **Per-product reviews persistence** — Sprint 7 (patient portal / retention) handles real review writes.
- **Operator-side product editing UI** — Sprint 6.

## Working order

1. Extend `Product` type, add new types in `types.ts`.
2. Extract `ProductCard` from `FeatureGrid` → standalone file. Verify nothing breaks.
3. Build `ProductHero` (highest leverage). Story + three-up.
4. Build `ProductDetailsBlock`, `ProductIngredients`, `ProductReviews`, `RelatedProducts`. Story each.
5. Extend demo fixtures with product-page content for Sleep Stack / Peptide Performance / Whey Foundation.
6. Add the `/products/[slug]` route.
7. Typecheck. Commit. Push.

## Definition of done

- Open `http://localhost:3000/products/sleep-stack` → see a complete product page that converts.
- Open Storybook → every Sprint 3 component renders correctly in clinical / wellness / community side-by-side.
- A reviewer scrolling Storybook can answer "yes, the same product page architecture would work for hormone protocols and gym supplements without any code branching."
