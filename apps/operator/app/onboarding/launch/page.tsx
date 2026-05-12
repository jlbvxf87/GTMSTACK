import { redirect } from "next/navigation";
import { IntakeShell } from "@gtmstack/ui";

import { requireOperator, writeOperatorSession } from "../../../lib/operator-session";
import {
  completedIntakeKeysFor,
  currentIntakeKey,
  intakeStepsForOperator,
} from "../../../lib/onboarding-steps";

/**
 * Step 5 — Launch. Operator reviews everything and hits Go live. Sets
 * `onboarded = true` and redirects to the dashboard.
 */
export default async function LaunchStep() {
  const session = await requireOperator();
  if (!session.brandVoice || !session.plan || !session.stripeAccountId) {
    redirect("/onboarding/plan");
  }

  const storefrontUrl = `${session.storefrontSlug ?? "your-brand"}.gtmstack.shop`;

  return (
    <IntakeShell
      brandName={session.brandName ?? "GTMStack"}
      brandHref="/dashboard"
      steps={intakeStepsForOperator()}
      currentStep={currentIntakeKey("launch")}
      completedSteps={completedIntakeKeysFor(["vertical", "brand", "catalog", "plan"])}
      eyebrow="Step 5 of 5"
      headline="Ready to launch."
      subhead={`Once you confirm, your storefront goes live at ${storefrontUrl}. You can edit anything from your dashboard afterward.`}
      backHref="/onboarding/plan"
    >
      <div className="flex flex-col gap-8">
        <Summary
          rows={[
            { label: "Brand", value: session.brandName ?? "—" },
            { label: "Vertical", value: session.theme ?? "—" },
            { label: "Storefront", value: storefrontUrl },
            { label: "Products listed", value: String(session.productSlugs?.length ?? 0) },
            { label: "Plan", value: session.plan ?? "—" },
            { label: "Stripe", value: session.stripeAccountId ?? "—" },
            { label: "Tagline", value: session.brandVoice?.tagline ?? "—" },
          ]}
        />

        <form action={launch}>
          <button
            type="submit"
            className="w-full md:w-auto inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
          >
            Launch storefront
          </button>
        </form>
      </div>
    </IntakeShell>
  );
}

function Summary({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-stack rounded-card border-card border-border bg-background p-6 shadow-card sm:grid-cols-[max-content_1fr] sm:gap-x-6">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
            {row.label}
          </dt>
          <dd className="font-body text-body text-foreground break-all">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

async function launch(): Promise<void> {
  "use server";
  await writeOperatorSession({ onboarded: true });
  redirect("/dashboard");
}
