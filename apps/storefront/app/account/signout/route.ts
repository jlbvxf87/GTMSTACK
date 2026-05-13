import "server-only";
import { NextResponse, type NextRequest } from "next/server";

import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

async function handle(req: NextRequest) {
  if (isSupabaseConfigured()) {
    const client = await supabase();
    await client?.auth.signOut();
  }
  const operator = req.nextUrl.searchParams.get("operator") ?? "";
  const target = operator ? `/account/login?operator=${operator}` : "/account/login";
  return NextResponse.redirect(new URL(target, req.nextUrl.origin));
}

export const GET = handle;
export const POST = handle;
