import { redirect } from "next/navigation";
import { IntakeChoiceGroup, IntakeShell, demoBrands } from "@gtmstack/ui";

import { requireOperator } from "../../../lib/operator-session";
import {
  completedIntakeKeysFor,
  currentIntakeKey,
  intakeStepsForOperator,
} from "../../../lib/onboarding-steps";
import { submitCatalog } from "./actions";

/**
 * Step 3 — Catalog. Operator picks which products to list. Action lives in
 * ./actions.ts to dodge Next.js's inline-server-action FormData quirk.
 */
export default async function CatalogStep({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await requireOperator();
  if (!session.theme || !session.brandVoice) redirect("/onboarding/brand");

  const sp = (await searchParams) ?? {};
  const error = sp.error ? "Pick at least one product to continue." : undefined;

  const catalog = demoBrands[session.theme].products;

  // Default: prefer the operator's existing selection. If they have no
  // selections yet (empty array from DB), pre-check every catalog item so a
  // single Continue click is enough.
  const defaults =
    session.productSlugs && session.productSlugs.length > 0
      ? session.productSlugs
      : catalog.map((p) => p.slug);

  return (
    <IntakeShell
      brandName={session.brandName ?? "GTMStack"}
      brandHref="/dashboard"
      steps={intakeStepsForOperator()}
      currentStep={currentIntakeKey("catalog")}
      completedSteps={completedIntakeKeysFor(["vertical", "brand"])}
      eyebrow="Step 3 of 5"
      headline="Pick the products you want to list."
      subhead="These come from the GTMStack marketplace. Sprint 7 expands this to your partner-supplied catalog. For now, pick from the curated demo set for your vertical."
      backHref="/onboarding/brand"
    >
      <form action={submitCatalog} className="flex flex-col gap-8">
        <IntakeChoiceGroup
          name="productSlugs"
          legend="Available programs"
          multiple
          columns={1}
          defaultValue={defaults}
          error={error}
          options={catalog.map((product) => ({
            value: product.slug,
            label: product.name,
            description: product.description ?? "",
          }))}
        />

        <div className="flex justify-between gap-3">
          <a
            href="/onboarding/brand"
            className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-muted"
          >
            Back
          </a>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
          >
            Continue
          </button>
        </div>
      </form>
    </IntakeShell>
  );
}
