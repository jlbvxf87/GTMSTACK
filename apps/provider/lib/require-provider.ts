import "server-only";
import { redirect } from "next/navigation";

import { getCurrentProvider } from "@gtmstack/database-core";

import { supabase } from "./supabase";

/**
 * Resolves the current provider — either returns the ProviderRow + Supabase
 * client, or redirects to /login. Use at the top of every protected page +
 * action.
 *
 * The check has two layers:
 *   1. Supabase auth user exists (set by signInWithPassword)
 *   2. There's a matching row in public.providers (set manually by GTMStack
 *      staff via service-role insert when onboarding a partner physician)
 *
 * Both layers are required. A signed-in user without a providers row gets
 * bounced — being able to authenticate is not the same as being credentialed
 * to review patient intakes.
 */
export async function requireProvider() {
  const client = await supabase();
  if (!client) redirect("/login?error=config");

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) redirect("/login");

  const provider = await getCurrentProvider(client);
  if (!provider) redirect("/login?error=unauthorized");

  return { client, user, provider };
}
