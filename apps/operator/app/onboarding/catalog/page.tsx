import { redirect } from "next/navigation";
import { IntakeChoiceGroup, IntakeShell, demoBrands } from "@gtmstack/ui";

import { requireOperator, writeOperatorSession } from "../../../lib/operator-session";
import {
  completedIntakeKeysFor,
  currentIntakeKey,
  intakeStepsForOperator,
  nextStepHref,
} from "../../../lib/onboarding-steps";

/**
 * Step 3 — Catalog. Operator picks which products to list. For Sprint 6 V1
 * the catalog comes from the demo-brand fixtures keyed by theme. When real
 * partner-supplied catalogs land in Sprint 7, the data source swaps but the
 * UI stays the same.
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
      <form action={submit} className="flex flex-col gap-8">
        <IntakeChoiceGroup
          name="productSlugs"
          legend="Available programs"
          multiple
          columns={1}
          defaultValue={session.productSlugs ?? catalog.map((p) => p.slug)}
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

async function submit(formData: FormData): Promise<void> {
  "use server";
  const productSlugs = formData.getAll("productSlugs[]").map(String);
  if (productSlugs.length === 0) {
    redirect("/onboarding/catalog?error=1");
  }
  await writeOperatorSession({ productSlugs });
  redirect(nextStepHref("catalog"));
}
