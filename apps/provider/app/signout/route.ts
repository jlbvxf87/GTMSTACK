import "server-only";
import { NextResponse, type NextRequest } from "next/server";

import { supabase } from "../../lib/supabase";

async function signOut(req: NextRequest) {
  const client = await supabase();
  if (client) await client.auth.signOut();
  return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
}

export const GET = signOut;
export const POST = signOut;
