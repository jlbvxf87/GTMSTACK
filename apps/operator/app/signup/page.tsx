import { redirect } from "next/navigation";
import { IntakeField, IntakeShell } from "@gtmstack/ui";

import { writeOperatorSession, readOperatorSession } from "../../lib/operator-session";
import { intakeStepsForOperator } from "../../lib/onboarding-steps";

/**
 * /signup — minimal signup page for Sprint 6 V1.
 *
 * Cookie-based session: takes email + working brand name, stamps a session,
 * jumps to /onboarding/vertical. No password yet; Sprint 6.5 wires Supabase
 * Auth (email/password OR magic link) with this same UX shape.
 */
export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await readOperatorSession();
  if (session.userId) redirect("/dashboard");

  const sp = (await searchParams) ?? {};
  const error = sp.error
    ? "Email and brand name are required."
    : undefined;

  return (
    <IntakeShell
      brandName="GTMStack"
      steps={intakeStepsForOperator()}
      currentStep="goals"
      eyebrow="Start your stack"
      headline="Launch a branded wellness business in hours."
      subhead="Storefront, payments, AI customer ops, compliant fulfillment — wired in. You bring the audience."
    >
      <form action={signup} className="flex flex-col gap-6">
        <IntakeField
          name="email"
          label="Your email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          helperText="We confirm here. Sprint 6.5 wires real auth."
          error={error}
        />

        <IntakeField
          name="brandName"
          label="Working brand name"
          required
          maxLength={80}
          placeholder="Prime Wellness, ApexRX, Iron Reserve..."
          helperText="The name customers see. You can change this anytime."
        />

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Continue to setup
          </button>
        </div>
      </form>
    </IntakeShell>
  );
}

async function signup(formData: FormData): Promise<void> {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  const brandName = String(formData.get("brandName") ?? "").trim();

  if (!email || !brandName) {
    redirect("/signup?error=1");
  }

  await writeOperatorSession({
    email,
    brandName,
    storefrontSlug: slugify(brandName),
  });

  redirect("/onboarding/vertical");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
