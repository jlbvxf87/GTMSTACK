import "server-only";
import { NextResponse, type NextRequest } from "next/server";

import { route as pickRoute, type CheckoutIntent } from "@gtmstack/payments";
import {
  createAdminClient,
  findOrganizationIdBySlug,
  insertPendingIntake,
  isSupabaseConfigured,
} from "@gtmstack/database-core";
import { JOB_EVENTS, dispatch } from "@gtmstack/jobs";

import { findProduct, toCheckoutProduct } from "../../../lib/find-product";
import { readOperator } from "../../../lib/operator-context";
import { readIntakeState } from "../../start/state";

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
        // Sprint 7b: persist the intake as a pending_intake row so the
        // provider portal can pick it up. We only do this on the
        // requires_provider_review branch — Tier 1 products never hit the
        // intake review pipeline.
        await persistPendingIntake({
          operatorSlug: operator.id,
          productSlug: input.slug,
          customerEmail: input.customerEmail,
        });

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

/**
 * Persist a clinical-tier intake as a `pending_intakes` row so the provider
 * portal can pick it up. Best-effort — never throws into the user-facing
 * checkout redirect. Returns silently when Supabase isn't configured or the
 * operator hasn't been provisioned yet.
 */
async function persistPendingIntake(args: {
  operatorSlug: string;
  productSlug: string;
  customerEmail?: string;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const state = await readIntakeState();
    const email = args.customerEmail ?? state.account?.email;
    if (!email) {
      console.warn("[checkout] skipping pending_intake — no customer email yet");
      return;
    }

    const admin = createAdminClient();
    if (!admin) return;

    const organizationId = await findOrganizationIdBySlug(admin, args.operatorSlug);
    if (!organizationId) {
      console.warn(
        "[checkout] skipping pending_intake — operator org not provisioned:",
        args.operatorSlug,
      );
      return;
    }

    const intake = await insertPendingIntake(admin, {
      organizationId,
      customerEmail: email,
      productSlug: args.productSlug,
      payload: state as Record<string, unknown>,
    });

    if (intake) {
      await dispatch(JOB_EVENTS.INTAKE_SUBMITTED, {
        organizationId,
        pendingIntakeId: intake.id,
        customerEmail: email,
        productSlug: args.productSlug,
      });
    }
  } catch (err) {
    // Don't fail the checkout flow over telemetry. Log and continue.
    console.error("[checkout] pending_intake persist failed:", err);
  }
}
