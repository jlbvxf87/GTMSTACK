import "server-only";
import { NextResponse, type NextRequest } from "next/server";

import { route as pickRoute, type CheckoutIntent } from "@gtmstack/payments";

import { findProduct, toCheckoutProduct } from "../../../lib/find-product";
import { readOperator } from "../../../lib/operator-context";

/**
 * POST /api/checkout
 *
 * Reads form data `{ slug, mode, fromIntake?, customerEmail? }`, picks an
 * adapter via the payments router, and redirects:
 *
 *   - Tier 1 + processable    → real or mock Stripe Checkout URL
 *   - requiresProviderReview  → /start/review-pending
 *   - no connected account    → /connect
 *   - missing partner adapter → /products/[slug]?reason=partner_missing
 *
 * Both POST (preferred — from forms) and GET (for development convenience)
 * are accepted.
 */

export async function POST(req: NextRequest) {
  const form = await req.formData();
  return handle({
    slug: String(form.get("slug") ?? ""),
    mode: form.get("mode") === "payment" ? "payment" : "subscription",
    customerEmail: form.get("customerEmail") ? String(form.get("customerEmail")) : undefined,
    origin: getOrigin(req),
  });
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  return handle({
    slug: sp.get("slug") ?? "",
    mode: sp.get("mode") === "payment" ? "payment" : "subscription",
    customerEmail: sp.get("customerEmail") ?? undefined,
    origin: getOrigin(req),
  });
}

async function handle(input: {
  slug: string;
  mode: "subscription" | "payment";
  customerEmail?: string;
  origin: string;
}) {
  const product = findProduct(input.slug);
  if (!product) {
    return NextResponse.redirect(new URL("/products/does-not-exist", input.origin));
  }

  const operator = await readOperator();
  const decision = pickRoute(toCheckoutProduct(product), operator);

  if (decision.kind === "gate") {
    switch (decision.reason.code) {
      case "requires_provider_review": {
        const url = new URL("/start/review-pending", input.origin);
        url.searchParams.set("slug", input.slug);
        return NextResponse.redirect(url);
      }
      case "no_connected_account": {
        const url = new URL("/connect", input.origin);
        url.searchParams.set("after", `/products/${input.slug}`);
        return NextResponse.redirect(url);
      }
      case "plan_insufficient": {
        const url = new URL(`/products/${input.slug}`, input.origin);
        url.searchParams.set("reason", "plan_required");
        url.searchParams.set("required_plan", decision.reason.required);
        return NextResponse.redirect(url);
      }
      case "missing_partner_integration": {
        const url = new URL(`/products/${input.slug}`, input.origin);
        url.searchParams.set("reason", "partner_missing");
        return NextResponse.redirect(url);
      }
    }
  }

  const intent: CheckoutIntent = {
    operator,
    product: toCheckoutProduct(product),
    mode: input.mode,
    quantity: 1,
    origin: input.origin,
    customerEmail: input.customerEmail,
  };

  try {
    const session = await decision.adapter.createCheckoutSession(intent);
    return NextResponse.redirect(session.url);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[checkout] adapter error:", message);
    const url = new URL(`/products/${input.slug}`, input.origin);
    url.searchParams.set("reason", "checkout_failed");
    return NextResponse.redirect(url);
  }
}

function getOrigin(req: NextRequest): string {
  const url = req.nextUrl;
  return `${url.protocol}//${url.host}`;
}
