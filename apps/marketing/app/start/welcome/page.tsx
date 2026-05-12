import { redirect } from "next/navigation";
import { IntakeShell, primeWellness, findProductBySlug } from "@gtmstack/ui";

import { resetIntake } from "../actions";
import { INTAKE_STEPS, completedKeys, readIntakeState } from "../state";

/**
 * /start/welcome
 *
 * Two entry paths after Sprint 5:
 *
 *   1. Direct checkout success (Stripe redirect) — has `?session_id=...` and
 *      optional `?slug=...`. Show a confirmation screen for that purchase.
 *
 *   2. Intake submission (post-Sprint 4 flow) — no session_id, but cookie has
 *      `submittedAt`. Show the original intake-style welcome.
 *
 * If neither is set, fall through to /start/review.
 */
export default async function WelcomeStep({
  searchParams,
}: {
  searchParams?: Promise<{ session_id?: string; slug?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const state = await readIntakeState();

  if (sp.session_id) {
    return <CheckoutConfirmation sessionId={sp.session_id} slug={sp.slug} />;
  }

  if (!state.submittedAt) redirect("/start/review");

  const firstName = state.account?.firstName ?? "there";

  return (
    <IntakeShell
      brandName={primeWellness.name}
      steps={INTAKE_STEPS}
      currentStep="review"
      completedSteps={[...completedKeys(state), "review"]}
      eyebrow="You're in"
      headline={`Welcome, ${firstName}.`}
      subhead="Your coach will reach out within one business day. In the meantime, here's what happens next."
    >
      <div className="flex flex-col gap-12">
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NextStep
            label="01"
            title="Coach intro"
            body="A 20-minute kickoff call — scheduled by email within one business day."
          />
          <NextStep
            label="02"
            title="Your first shipment"
            body="Your starter stack ships within 48 hours of the coach intro."
          />
          <NextStep
            label="03"
            title="Check back in"
            body="A 30-day check-in to adjust dosing and add support stacks."
          />
        </ol>

        <div className="rounded-card border-card border-border bg-muted p-6">
          <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
            Submitted
          </p>
          <p className="mt-stack font-display text-h3 text-foreground">
            {new Date(state.submittedAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p className="mt-stack text-body text-muted-foreground">
            Confirmation sent to{" "}
            <span className="font-medium text-foreground">{state.account?.email}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-inline">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
          >
            Back to programs
          </a>
          <form action={resetIntake}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-muted"
            >
              Start a new intake
            </button>
          </form>
        </div>
      </div>
    </IntakeShell>
  );
}

function CheckoutConfirmation({
  sessionId,
  slug,
}: {
  sessionId: string;
  slug: string | undefined;
}) {
  const match = slug ? findProductBySlug(slug) : null;
  const product = match?.product;
  const brand = match?.brand ?? null;

  return (
    <IntakeShell
      brandName={brand?.name ?? primeWellness.name}
      steps={INTAKE_STEPS}
      currentStep="review"
      completedSteps={["goals", "health", "preferences", "account", "review"]}
      eyebrow="Order confirmed"
      headline="You're in. Welcome aboard."
      subhead={
        product
          ? `Your ${product.name} ${product.price.subscription ? "subscription" : "order"} is active. First shipment in 48 hours.`
          : "Your order is active. First shipment in 48 hours."
      }
    >
      <div className="flex flex-col gap-12">
        <div className="rounded-card border-card border-border bg-muted p-6">
          <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
            Stripe session
          </p>
          <p className="mt-stack font-display text-h3 text-foreground break-all">{sessionId}</p>
          <p className="mt-stack text-body text-muted-foreground">
            A receipt is on the way. Manage your subscription anytime from the member dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-inline">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
          >
            Back to programs
          </a>
        </div>
      </div>
    </IntakeShell>
  );
}

function NextStep({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <li className="flex flex-col gap-2 rounded-card border-card border-border bg-background p-6 shadow-card">
      <span aria-hidden className="font-display text-h1 leading-none text-brand">
        {label}
      </span>
      <h2 className="font-display text-h3 text-foreground">{title}</h2>
      <p className="text-body text-muted-foreground">{body}</p>
    </li>
  );
}
