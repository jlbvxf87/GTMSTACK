# Sprint 4 — Intake Flow

> See `docs/CLAUDE.md` for foundational architecture. This brief is operational.

## Goal

Deliver the **intake flow** — the multi-step form that differentiates a GTMStack operator from a plain supplement store. After this sprint, a customer can fill out a guided intake end-to-end and land on a confirmation page. Real PHI handling + provider review wiring is Sprint 7; this sprint owns the *UX* and the *form mechanics*.

Same theme system as Sprints 1–3.

## Components

| Component | Responsibility |
|---|---|
| `IntakeStepper` | Top progress indicator. Numbered steps, current state, completed checkmarks. |
| `IntakeShell` | Page chrome: brand header, stepper, content slot, "Step N of M" line, back link. |
| `IntakeField` | Single labeled form field — label + input + help text + error. Variants: `text`, `email`, `tel`, `textarea`. |
| `IntakeChoiceGroup` | Radio / checkbox card group for goal selection. Supports single + multi-select. |
| `IntakeReviewSummary` | Final-step review screen — collapsible sections summarizing prior steps, with "Edit" links back to each. |

All theme-aware. Server components where possible; choice groups use native radio/checkbox so no client JS is needed for the form itself.

## Type additions

```ts
type IntakeStepKey = "goals" | "health" | "preferences" | "account" | "review";
type IntakeStep = {
  key: IntakeStepKey;
  label: string;
  hint?: string;
};
type IntakeChoice = {
  value: string;
  label: string;
  description?: string;
};
```

## Mechanics

**State persistence**: signed cookies via Next.js `cookies()`. No DB this sprint. State carries between steps as a single `intake-state` cookie. Cookie value is a base64-JSON `IntakeState` object signed with a secret from env (`INTAKE_COOKIE_SECRET` for now; will rotate to Supabase Auth signed session in Sprint 7).

**Step advancement**: server actions, not API routes. Each step's form posts to a `submitStep<N>` action that:
1. Validates input via a zod schema.
2. Merges into the cookie state.
3. Redirects to the next step (or back to the same step with errors).

**No client JS**. Browser handles form submission, server handles state. Errors are rendered server-side on the same page.

**Doctrine compliance**: AI never makes decisions on intake data. The intake page contains a placeholder section noting that future provider review will happen for clinical operators (Sprint 7). For Sprint 4, all three operator themes get the same generic intake — operator-specific question sets are Sprint 6 (operator config).

## Route

```
apps/marketing/app/start/
  layout.tsx                  // <ThemeProvider wellness> + IntakeShell wrapper
  page.tsx                    // Step 1 — goals
  health/page.tsx             // Step 2 — health & lifestyle
  preferences/page.tsx        // Step 3 — preferences
  account/page.tsx            // Step 4 — contact info
  review/page.tsx             // Step 5 — review & submit
  welcome/page.tsx            // Final confirmation
  actions.ts                  // Server actions for each step
  state.ts                    // Cookie read/write + zod schemas + IntakeState type
```

## Acceptance criteria

1. New components all theme-aware, each with a Storybook three-up story.
2. `/start` is reachable from the homepage CTA. The first step renders cleanly in the wellness theme.
3. Filling out all five steps and submitting lands the user on `/start/welcome` with their submitted data shown.
4. Reloading or navigating back preserves prior steps' answers (cookie state).
5. Server-side validation rejects bad input (missing required fields, invalid email) and re-renders the step with inline errors.
6. `pnpm --filter @gtmstack/ui typecheck` and `pnpm --filter @gtmstack/marketing typecheck` are clean.

## Out of scope

- Real PHI storage / Supabase clinical project writes — Sprint 7.
- Provider review of intake answers — Sprint 7.
- Per-operator custom question sets — Sprint 6.
- Save-and-resume by email — Sprint 7 (needs auth).
- Stripe checkout from intake — Sprint 5.

## Working order

1. Add new types in `packages/ui/src/components/types.ts`.
2. Build the five intake components in `packages/ui` with stories.
3. Build the state module + zod schemas + server actions in `apps/marketing/app/start/`.
4. Build the six route segments composing the components.
5. Wire homepage hero CTA to `/start`.
6. Typecheck, commit, push.

## Definition of done

A reviewer can:
- Click "Start Your Program" on the homepage → land on `/start`.
- Fill out goals → health → preferences → account → review → submit.
- See `/start/welcome` confirming what they submitted.
- Reload mid-flow and pick up where they left off.
- Open Storybook and see each intake component rendered correctly in all three themes.
