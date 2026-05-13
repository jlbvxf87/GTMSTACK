import "server-only";
import { cookies } from "next/headers";

import {
  createServerClient as createCoreServerClient,
  createAdminClient,
  isSupabaseConfigured,
} from "@gtmstack/database-core";

/**
 * Bound-to-Next-cookies Supabase server client.
 *
 * The `cookies()` import has to happen inside the route's own async scope
 * (Next 15 requirement), so we wrap it here and pass the resulting store into
 * @gtmstack/database-core. Every route handler / server action / async server
 * component calls this to get a request-scoped client.
 */
export async function supabase() {
  const cookieStore = await cookies();
  return createCoreServerClient({
    getAll: () => cookieStore.getAll(),
    set: (name, value, options) => cookieStore.set(name, value, options),
  });
}

/** Service-role client for trusted writes (provisioning, webhook ingestion). */
export function supabaseAdmin() {
  return createAdminClient();
}

export { isSupabaseConfigured };
