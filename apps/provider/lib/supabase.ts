import "server-only";
import { cookies } from "next/headers";

import {
  createServerClient as createCoreServerClient,
  createAdminClient,
  isSupabaseConfigured,
} from "@gtmstack/database-core";

export async function supabase() {
  const cookieStore = await cookies();
  return createCoreServerClient({
    getAll: () => cookieStore.getAll(),
    set: (name, value, options) => cookieStore.set(name, value, options),
  });
}

export function supabaseAdmin() {
  return createAdminClient();
}

export { isSupabaseConfigured };
