import { redirect } from "next/navigation";
import { IntakeField, IntakeShell } from "@gtmstack/ui";

import { readOperatorSession } from "../../lib/operator-session";
import { intakeStepsForOperator } from "../../lib/onboarding-steps";
import { loginAction } from "./actions";

/**
 * /login — Supabase email + password login. After successful login, redirects
 * to /dashboard (if onboarded) or /onboarding/vertical (if mid-setup).
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
}) {
  const session = await readOperatorSession();
  if (session.userId) redirect("/dashboard");

  const sp = (await searchParams) ?? {};
  const error =
    sp.error === "missing"
      ? "Email and password required."
      : sp.error === "invalid"
        ? "Wrong email or password."
        : sp.error
          ? "Login failed. Try again."
          : undefined;

  return (
    <IntakeShell
      brandName="GTMStack"
      steps={intakeStepsForOperator()}
      currentStep="goals"
      eyebrow="Welcome back"
      headline="Sign in to your dashboard."
      subhead="Manage your storefront, products, brand voice, payouts, and AI conversations."
    >
      <form action={loginAction} className="flex flex-col gap-6">
        <input type="hidden" name="next" value={sp.next ?? "/dashboard"} />

        <IntakeField
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          error={error === "Wrong email or password." ? error : undefined}
        />

        <IntakeField
          name="password"
          label="Password"
          type="text"
          required
          autoComplete="current-password"
        />

        <p className="text-small text-muted-foreground">
          Don't have an account?{" "}
          <a href="/signup" className="underline transition-colors duration-DEFAULT ease-themed hover:text-foreground">
            Sign up
          </a>
          .
        </p>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
          >
            Log in
          </button>
        </div>
      </form>
    </IntakeShell>
  );
}
