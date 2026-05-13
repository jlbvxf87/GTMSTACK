import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

import type { Database } from "./types";

/**
 * Browser-side Supabase client for client components. Reads anon key from
 * NEXT_PUBLIC env vars (those are baked into the bundle).
 *
 * Returns `null` if env is missing — caller falls back gracefully.
 *
 * Return type is inferred; see server-client.ts for the rationale.
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_CORE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_CORE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createSupabaseBrowserClient<Database>(url, anonKey);
}
