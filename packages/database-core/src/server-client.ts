import "server-only";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

import type { Database } from "./types";

/**
 * Cookie store shape — matches what Next.js `await cookies()` returns. We pass
 * it in instead of importing `cookies()` inside this library because some
 * Next.js versions throw when cookies() is called outside the route's own
 * async scope.
 */
export type CookieStore = {
  getAll: () => { name: string; value: string }[];
  set?: (name: string, value: string, options: CookieOptions) => void;
};

/**
 * Server-side Supabase client. Reads + writes session cookies via the passed
 * cookie store. Use in route handlers, server actions, and async server
 * components.
 *
 * Returns `null` when `NEXT_PUBLIC_SUPABASE_CORE_URL` is not set — callers
 * fall back gracefully.
 *
 * Return type is inferred (not annotated) because @supabase/ssr's typings
 * compose strangely with @supabase/supabase-js v2.50+'s stricter generic
 * constraints. Letting TS infer is correct and avoids casts.
 */
export function createServerClient(cookieStore: CookieStore) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_CORE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_CORE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createSupabaseServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        if (!cookieStore.set) return;
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Calling set in a server component is not allowed — ignore. The
          // middleware (or a route handler) handles cookie refresh.
        }
      },
    },
  });
}

/**
 * Inferred return type of `createServerClient` minus the null branch. Use this
 * as the type for query helpers that receive a Supabase client.
 */
export type AppSupabaseClient = NonNullable<ReturnType<typeof createServerClient>>;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_CORE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_CORE_ANON_KEY,
  );
}
