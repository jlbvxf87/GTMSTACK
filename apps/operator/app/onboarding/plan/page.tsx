import { redirect } from "next/navigation";
import { IntakeChoiceGroup, IntakeShell } from "@gtmstack/ui";
import { isMockMode, stripeConnectAdapter } from "@gtmstack/payments";
import type { OperatorPlan } from "@gtmstack/payments";

import { requireOperator, writeOperatorSession } from "../../../lib/operator-session";
import {
  completedIntakeKeysFor,
  currentIntakeKey,
  intakeStepsForOperator,
  nextStepHref,
} from "../../../lib/onboarding-steps";

/**
 * Step 4 — Plan + Stripe Connect.
 *
 * Two sub-steps on one screen:
 *   1. Pick SaaS tier (Starter / Growth / Pro / Clinical).
 *   2. Connect Stripe for payouts.
 *
 * The clinical plan is only selectable if the operator picked the clinical
 * theme. Mock mode short-circuits Stripe to a synthetic account id.
 */
export default async function PlanStep({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; connected?: string }>;
}) {
  const session = await requireOperator();
  if (!session.productSlugs?.length) redirect("/onboarding/catalog");

  const sp = (await searchParams) ?? {};
  const error = sp.error;

  const isClinical = session.theme === "clinical";
  const planOptions = [
    {
      value: "starter",
      label: "Starter — Free",
      description: "8% platform fee on every sale. Sub-domain only. Solo operator.",
    },
    {
      value: "growth",
      label: "Growth — $199 / mo",
      description: "5% platform fee. Custom domain. Up to 3 team members. Full AI.",
    },
    {
      value: "pro",
      label: "Pro — $499 / mo",
      description: "4% platform fee. Unlimited team. Priority support. Custom integrations.",
    },
    {
      value: "clinical",
      label: isClinical
        ? "Clinical — $1,499 / mo"
        : "Clinical — $1,499 / mo (requires Clinical vertical)",
      description:
        "6% platform fee on MSO portion. Provider-network access, intake compliance, audit logs, PHI handling. Required for peptides / hormones.",
    },
  ];

  // Use the Stripe Connect adapter to mint an onboarding link. Mock mode
  // returns a synthetic one that round-trips to /connect-callback.
  const origin = process.env.NEXT_PUBLIC_OPERATOR_URL ?? "http://localhost:3001";
  const onboardingLink = await stripeConnectAdapter.createConnectOnboardingLink({
    operatorId: session.userId,
    returnUrl: `${origin}/onboarding/plan/connect-callback`,
    refreshUrl: `${origin}/onboarding/plan`,
  });

  return (
    <IntakeShell
      brandName={session.brandName ?? "GTMStack"}
      brandHref="/dashboard"
      steps={intakeStepsForOperator()}
      currentStep={currentIntakeKey("plan")}
      completedSteps={completedIntakeKeysFor(["vertical", "brand", "catalog"])}
      eyebrow="Step 4 of 5"
      headline="Pick a plan, connect payouts."
      subhead="Operator fee structure is set here. Stripe handles KYC, payouts, 1099s — we never see your bank account."
      backHref="/onboarding/catalog"
    >
      <div className="flex flex-col gap-12">
        <form action={submitPlan} className="flex flex-col gap-8">
          <IntakeChoiceGroup
            name="plan"
            legend="SaaS plan"
            columns={1}
            required
            defaultValue={session.plan ?? (isClinical ? "clinical" : "growth")}
            options={planOptions}
            error={error === "plan" ? "Pick a plan." : error === "plan_mismatch" ? "Clinical plan requires the Clinical vertical." : undefined}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-muted"
            >
              Save plan
            </button>
          </div>
        </form>

        <div className="rounded-card border-card border-border bg-muted p-8 shadow-card">
          <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
            Payouts
          </p>
          <h2 className="mt-stack font-display text-h3 text-foreground">
            {session.stripeAccountId ? "Stripe connected." : "Connect Stripe to receive payouts."}
          </h2>
          <p className="mt-stack max-w-prose text-body text-muted-foreground">
            {session.stripeAccountId ? (
              <>
                Account: <span className="font-mono text-foreground">{session.stripeAccountId}</span>
              </>
            ) : isMockMode() ? (
              "Dev mode — clicking below stamps a synthetic Stripe Connect account id. Add a real STRIPE_PLATFORM_SECRET_KEY to use real Stripe."
            ) : (
              "We hand you off to Stripe to finish onboarding (business info, bank account, ID verification). Takes about 5 minutes."
            )}
          </p>
          {session.stripeAccountId ? null : (
            <a
              href={onboardingLink.url}
              className="mt-stack inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
            >
              {isMockMode() ? "Simulate connect" : "Connect with Stripe"}
            </a>
          )}
        </div>

        <form action={proceed} className="flex justify-between gap-3">
          <a
            href="/onboarding/catalog"
            className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-muted"
          >
            Back
          </a>
          <button
            type="submit"
            disabled={!session.plan || !session.stripeAccountId}
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:brightness-100"
          >
            {!session.plan
              ? "Save a plan first"
              : !session.stripeAccountId
                ? "Connect Stripe first"
                : "Continue"}
          </button>
        </form>
      </div>
    </IntakeShell>
  );
}

async function submitPlan(formData: FormData): Promise<void> {
  "use server";
  const plan = String(formData.get("plan") ?? "") as OperatorPlan;
  const session = await requireOperator();

  if (!["starter", "growth", "pro", "clinical"].includes(plan)) {
    redirect("/onboarding/plan?error=plan");
  }

  if (plan === "clinical" && session.theme !== "clinical") {
    redirect("/onboarding/plan?error=plan_mismatch");
  }

  await writeOperatorSession({ plan });
  redirect("/onboarding/plan");
}

async function proceed(): Promise<void> {
  "use server";
  const session = await requireOperator();
  if (!session.plan || !session.stripeAccountId) {
    redirect("/onboarding/plan?error=incomplete");
  }
  redirect(nextStepHref("plan"));
}
