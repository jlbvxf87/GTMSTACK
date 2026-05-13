import "server-only";
import { cookies } from "next/headers";

import {
  createServerClient as createCoreServerClient,
  createAdminClient,
  isSupabaseConfigured,
} from "@gtmstack/database-core";

/**
 * Request-scoped Supabase server client. Customers sign in with their own
 * auth context (separate from operators); the cookies passed here carry the
 * customer's session.
 */
export async function supabase() {
  const cookieStore = await cookies();
  return createCoreServerClient({
    getAll: () => cookieStore.getAll(),
    set: (name, value, options) => cookieStore.set(name, value, options),
  });
}

/** Service-role client. Used to resolve operators by slug for anonymous visitors. */
export function supabaseAdmin() {
  return createAdminClient();
}

export { isSupabaseConfigured };
