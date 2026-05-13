import { redirect } from "next/navigation";

import { getCurrentProvider } from "@gtmstack/database-core";

import { supabase } from "../../lib/supabase";
import { loginAction } from "./actions";

/**
 * /login — provider auth. Unlike operator/customer signup, providers do NOT
 * self-serve. A `providers` row must be created by GTMStack staff (service-
 * role insert) before a physician can log in. After Supabase returns a user
 * we additionally check the providers table; a signed-in user without that
 * row gets bounced with `?error=unauthorized`.
 */
export default async function ProviderLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
}) {
  const client = await supabase();
  if (client) {
    const provider = await getCurrentProvider(client);
    if (provider) redirect("/queue");
  }

  const sp = (await searchParams) ?? {};
  const error =
    sp.error === "missing"
      ? "Email and password required."
      : sp.error === "invalid"
        ? "Wrong email or password."
        : sp.error === "unauthorized"
          ? "You're signed in but not registered as a network provider. Contact GTMStack to onboard."
          : sp.error === "config"
            ? "Provider portal is not configured. Set NEXT_PUBLIC_SUPABASE_CORE_URL."
            : undefined;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <p className="text-eyebrow uppercase tracking-wide text-muted-foreground">
        GTMStack provider portal
      </p>
      <h1 className="mt-2 font-display text-h1 text-foreground">Sign in.</h1>
      <p className="mt-3 text-body text-muted-foreground">
        Network physicians review patient intakes across all operators on GTMStack.
        Approvals and declines write back to the patient's record.
      </p>

      {error ? (
        <div className="mt-6 rounded-card border border-rose-500/70 bg-rose-500/10 px-4 py-3 text-small text-rose-700">
          {error}
        </div>
      ) : null}

      <form action={loginAction} className="mt-8 flex flex-col gap-5">
        <input type="hidden" name="next" value={sp.next ?? "/queue"} />

        <label className="flex flex-col gap-2">
          <span className="text-small text-foreground">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-card border border-border bg-background px-3 py-2 font-body text-body text-foreground"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-small text-foreground">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-card border border-border bg-background px-3 py-2 font-body text-body text-foreground"
          />
        </label>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
