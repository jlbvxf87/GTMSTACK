import { IntakeField, IntakeShell, ThemeProvider } from "@gtmstack/ui";

import { resolveStorefront } from "../../../lib/operator-resolver";
import { loginAction } from "./actions";

export default async function CustomerLogin({
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
      ? "Email and password required."
      : sp.error === "invalid"
        ? "Wrong email or password."
        : sp.error
          ? "Login failed."
          : undefined;

  return (
    <ThemeProvider theme={theme} as="div">
      <IntakeShell
        brandName={brand}
        steps={[
          { key: "goals", label: "Sign in" },
          { key: "health", label: "Account" },
          { key: "preferences", label: "Orders" },
          { key: "account", label: "Subs" },
          { key: "review", label: "Settings" },
        ]}
        currentStep="goals"
        eyebrow="Welcome back"
        headline={`Sign in to ${brand}.`}
        subhead="Manage your subscription, shipments, and provider messages."
      >
        <form action={loginAction} className="flex flex-col gap-6">
          <input type="hidden" name="operator" value={operatorSlug} />

          <IntakeField
            name="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            error={error === "Wrong email or password." ? error : undefined}
          />
          <IntakeField name="password" label="Password" type="text" required autoComplete="current-password" />

          <p className="text-small text-muted-foreground">
            New to {brand}?{" "}
            <a
              href={`/account/signup?operator=${operatorSlug}`}
              className="underline transition-colors duration-DEFAULT ease-themed hover:text-foreground"
            >
              Create an account
            </a>
            .
          </p>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
            >
              Sign in
            </button>
          </div>
        </form>
      </IntakeShell>
    </ThemeProvider>
  );
}
