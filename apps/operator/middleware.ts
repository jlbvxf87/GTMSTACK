import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware — refreshes the Supabase session cookie on every request.
 *
 * Without this, the Supabase access token expires (default 1 hour) and the
 * user gets silently logged out. With it, the SDK rotates the token in the
 * background and the operator stays signed in for as long as the refresh
 * token is valid (default 7 days).
 *
 * No-op when Supabase env isn't configured — falls back to cookie session.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_CORE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_CORE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Side-effectful — this is what refreshes the token + writes cookies.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Run on everything except Next's static assets + the favicon.
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
