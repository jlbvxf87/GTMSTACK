import "server-only";
import { NextResponse, type NextRequest } from "next/server";

import { writeOperator } from "../../../lib/operator-context";

/**
 * GET /connect/callback
 *
 * The "return URL" Stripe Connect redirects the operator back to after
 * onboarding (or that the mock onboarding helper synthesizes). Captures
 * `stripe_account_id` from the query string, persists it to the operator
 * cookie, and forwards to `after`.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const stripeAccountId = sp.get("stripe_account_id");
  const operatorId = sp.get("operator_id");
  const after = sp.get("after") ?? "/";

  if (stripeAccountId) {
    await writeOperator({
      ...(operatorId ? { id: operatorId } : {}),
      stripeAccountId,
    });
  }

  const origin = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  return NextResponse.redirect(new URL(after, origin));
}
