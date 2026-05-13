import "server-only";
import { NextResponse, type NextRequest } from "next/server";

import { clearOperatorSession } from "../../lib/operator-session";

export async function POST(req: NextRequest) {
  await clearOperatorSession();
  return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
}

export async function GET(req: NextRequest) {
  // Allow `<a href="/signout">` for convenience in dev.
  await clearOperatorSession();
  return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
}
