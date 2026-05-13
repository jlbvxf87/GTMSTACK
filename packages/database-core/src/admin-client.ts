import "server-only";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "./types";

/**
 * Service-role Supabase client. Bypasses RLS — only use server-side for trusted
 * operations (initial operator provisioning, webhook event ingestion, admin
 * dashboards). Never expose the service-role key in browser code.
 *
 * Return type is inferred for the same reason as server-client.ts.
 */
let singleton: ReturnType<typeof createClient<Database>> | null | undefined;

export function createAdminClient() {
  if (singleton !== undefined) return singleton;
  const url = process.env.NEXT_PUBLIC_SUPABASE_CORE_URL;
  const serviceKey = process.env.SUPABASE_CORE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    singleton = null;
    return null;
  }
  singleton = createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return singleton;
}
