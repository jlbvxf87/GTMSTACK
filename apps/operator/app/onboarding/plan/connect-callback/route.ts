import "server-only";
import { NextResponse, type NextRequest } from "next/server";

import { writeOperatorSession } from "../../../../lib/operator-session";

/**
 * Stripe Connect onboarding callback. Stripe (or the mock helper) redirects
 * here after the operator finishes onboarding. Captures the
 * `stripe_account_id` and persists it to the operator session, then sends
 * the operator back to the plan step.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const stripeAccountId = sp.get("stripe_account_id");
  if (stripeAccountId) {
    await writeOperatorSession({ stripeAccountId });
  }
  return NextResponse.redirect(new URL("/onboarding/plan", req.nextUrl.origin));
}
