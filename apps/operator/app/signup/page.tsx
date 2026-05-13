import { redirect } from "next/navigation";
import { IntakeField, IntakeShell } from "@gtmstack/ui";

import { readOperatorSession } from "../../lib/operator-session";
import { intakeStepsForOperator } from "../../lib/onboarding-steps";
import { signupAction } from "./actions";

/**
 * /signup — real Supabase Auth signup (email + password + brand name).
 *
 * After successful signup, a server action provisions org + operator rows
 * and redirects to /onboarding/vertical.
 */
export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await readOperatorSession();
  if (session.userId) redirect("/dashboard");

  const sp = (await searchParams) ?? {};
  const error =
    sp.error === "missing"
      ? "Fill in every field to continue."
      : sp.error === "weak_password"
        ? "Password must be at least 8 characters."
        : sp.error === "exists"
          ? "An account with that email already exists. Try logging in."
          : sp.error === "auth"
            ? "Sign up failed. Check the address and try again."
            : sp.error
              ? "Something went wrong. Try again."
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
      <form action={signupAction} className="flex flex-col gap-6">
        <IntakeField
          name="email"
          label="Your email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />

        <IntakeField
          name="password"
          label="Password"
          type="text"
          required
          autoComplete="new-password"
          placeholder="At least 8 characters"
          helperText="Used to log back in later. Sprint 7 adds password reset + magic links."
          error={error?.includes("Password") ? error : undefined}
        />

        <IntakeField
          name="brandName"
          label="Working brand name"
          required
          maxLength={80}
          placeholder="Prime Wellness, ApexRX, Iron Reserve..."
          helperText="The name customers see. You can change this anytime."
          error={error && !error.includes("Password") ? error : undefined}
        />

        <p className="text-small text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="underline transition-colors duration-DEFAULT ease-themed hover:text-foreground">
            Log in
          </a>
          .
        </p>

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
