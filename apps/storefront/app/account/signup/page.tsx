import { IntakeField, IntakeShell, ThemeProvider } from "@gtmstack/ui";

import { resolveStorefront } from "../../../lib/operator-resolver";
import { signupAction } from "./actions";

export default async function CustomerSignup({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const ctx = await resolveStorefront({ searchParams: sp });
  const brand = ctx?.operator.brand_name ?? ctx?.organization.name ?? "Storefront";
  const theme = ctx?.storefront.theme ?? "wellness";
  const operatorSlug = ctx?.operator.storefront_slug ?? "";

  const error =
    sp.error === "missing"
      ? "Fill every required field."
      : sp.error === "weak"
        ? "Password must be at least 8 characters."
        : sp.error === "exists"
          ? "An account with that email already exists. Try signing in."
          : sp.error === "auth"
            ? "Sign up failed. Try again or use a different email."
            : undefined;

  return (
    <ThemeProvider theme={theme} as="div">
      <IntakeShell
        brandName={brand}
        steps={[
          { key: "goals", label: "Account" },
          { key: "health", label: "Verify" },
          { key: "preferences", label: "Pick" },
          { key: "account", label: "Pay" },
          { key: "review", label: "Done" },
        ]}
        currentStep="goals"
        eyebrow="Create your account"
        headline={`Join ${brand}.`}
        subhead="One account manages your subscription, shipments, coach messages, and provider relationship in one place."
      >
        <form action={signupAction} className="flex flex-col gap-6">
          <input type="hidden" name="operator" value={operatorSlug} />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <IntakeField name="firstName" label="First name" required autoComplete="given-name" />
            <IntakeField name="lastName" label="Last name" required autoComplete="family-name" />
          </div>
          <IntakeField name="email" label="Email" type="email" required autoComplete="email" />
          <IntakeField
            name="password"
            label="Password"
            type="text"
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={error?.includes("Password") ? error : undefined}
          />

          <p className="text-small text-muted-foreground">
            Already a member?{" "}
            <a
              href={`/account/login?operator=${operatorSlug}`}
              className="underline transition-colors duration-DEFAULT ease-themed hover:text-foreground"
            >
              Sign in
            </a>
            .
          </p>

          {error && !error.includes("Password") ? (
            <p className="text-small text-destructive">{error}</p>
          ) : null}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
            >
              Create account
            </button>
          </div>
        </form>
      </IntakeShell>
    </ThemeProvider>
  );
}
