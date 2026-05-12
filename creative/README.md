# creative/

Design surface — mocks, logo iterations, landing-page directions, storefront concepts.

**This folder is not shipped code.** Production marketing lives in `apps/web`. Use `creative/` to iterate freely without touching anything the app depends on.

## Layout

```text
creative/
├─ v0-original/   First static landing page direction (preserved from the original Desktop/GTM STACK folder)
└─ <next>/        Each new direction gets its own folder (v1-..., concept-name, etc.)
```

## Workflow

1. New direction → new sibling folder under `creative/` (e.g. `creative/v1-operator-first/`).
2. Iterate freely — drop in `index.html`, PNGs, Figma exports, whatever.
3. When a direction is chosen for production, port the relevant parts into `apps/web/app/page.tsx` and the design tokens into `packages/ui/`. The creative folder stays as the source archive.

## Not included here

- Real Tailwind / shadcn components — those live in `packages/ui` once `apps/web` is scaffolded.
- Anything imported by `apps/web` at build time — keep build-time deps in `apps/web/public` or `packages/ui`.
