import "server-only";
import { NextResponse, type NextRequest } from "next/server";

import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

/**
 * GET /auth/callback
 *
 * Supabase Auth's confirmation / OAuth callback. The hosted email link sends
 * the user here with `?code=...`; we exchange the code for a session (which
 * sets the auth cookies via the supabase client) and redirect onward.
 *
 * Wire this URL into Supabase dashboard → Authentication → URL Configuration:
 *   Site URL:  http://localhost:3001   (dev) / https://app.gtmstack.com (prod)
 *   Redirect URLs:  http://localhost:3001/auth/callback (dev) etc.
 *
 * Until email confirmation is re-enabled in Supabase (Authentication →
 * Providers → Email), this route just no-ops + redirects to /dashboard for
 * convenience.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  if (!code || !isSupabaseConfigured()) {
    return NextResponse.redirect(new URL(next, url.origin));
  }

  const client = await supabase();
  if (!client) {
    return NextResponse.redirect(new URL(next, url.origin));
  }

  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback] exchange failed:", error.message);
    return NextResponse.redirect(
      new URL(`/login?error=invalid`, url.origin),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
