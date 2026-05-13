import "server-only";
import { cookies } from "next/headers";

import type { OperatorPlan } from "@gtmstack/payments";
import type { BrandIdentity } from "@gtmstack/ai";
import type { StorefrontTheme } from "@gtmstack/database-core";
import {
  getCurrentOperator,
  getCurrentStorefront,
  updateOperator,
  upsertStorefront,
} from "@gtmstack/database-core";

import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Operator session.
 *
 * In Supabase mode (NEXT_PUBLIC_SUPABASE_CORE_URL set), reads/writes go to
 * Supabase via @gtmstack/database-core. Auth is real Supabase Auth.
 *
 * In cookie mode (env missing), falls back to a signed cookie.
 */

const COOKIE_NAME = "gtm_operator";

export type OperatorSession = {
  userId: string;
  email: string;
  organizationId: string;
  onboarded: boolean;
  theme?: StorefrontTheme;
  brandVoice?: BrandIdentity;
  brandName?: string;
  storefrontSlug?: string;
  productSlugs?: string[];
  plan?: OperatorPlan;
  stripeAccountId?: string;
};

export type EmptySession = { userId: null };

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function readOperatorSession(): Promise<OperatorSession | EmptySession> {
  if (!isSupabaseConfigured()) {
    return readFromCookie();
  }

  const client = await supabase();
  if (!client) return readFromCookie();

  const match = await getCurrentOperator(client);
  if (!match) {
    // Supabase configured but no signed-in user.
    return { userId: null };
  }

  const { operator, organization } = match;
  const storefront = await getCurrentStorefront(client, organization.id);

  return {
    userId: operator.user_id,
    email: organization.name,
    organizationId: organization.id,
    onboarded: operator.onboarded,
    theme: storefront?.theme,
    brandVoice: (storefront?.brand_voice ?? undefined) as BrandIdentity | undefined,
    brandName: operator.brand_name ?? organization.name,
    storefrontSlug: operator.storefront_slug ?? storefront?.slug,
    plan: operator.plan,
    stripeAccountId: operator.stripe_account_id ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export async function writeOperatorSession(
  patch: Partial<OperatorSession>,
): Promise<void> {
  if (!isSupabaseConfigured()) {
    return writeToCookie(patch);
  }

  const client = await supabase();
  if (!client) return writeToCookie(patch);

  const match = await getCurrentOperator(client);
  if (!match) {
    return writeToCookie(patch);
  }

  // Operator-row fields
  const operatorPatch: Record<string, unknown> = {};
  if (patch.plan !== undefined) operatorPatch.plan = patch.plan;
  if (patch.stripeAccountId !== undefined)
    operatorPatch.stripe_account_id = patch.stripeAccountId;
  if (patch.brandName !== undefined) operatorPatch.brand_name = patch.brandName;
  if (patch.storefrontSlug !== undefined)
    operatorPatch.storefront_slug = patch.storefrontSlug;
  if (patch.onboarded !== undefined) operatorPatch.onboarded = patch.onboarded;
  if (Object.keys(operatorPatch).length > 0) {
    await updateOperator(client, operatorPatch);
  }

  // Storefront-row fields (theme + brand voice). We upsert a storefront row
  // the first time the operator picks a theme or generates brand voice.
  if (patch.theme || patch.brandVoice) {
    const currentStorefront = await getCurrentStorefront(client, match.organization.id);
    await upsertStorefront(client, {
      organizationId: match.organization.id,
      slug:
        patch.storefrontSlug ??
        match.operator.storefront_slug ??
        match.organization.slug,
      theme: patch.theme ?? currentStorefront?.theme ?? "wellness",
      brandVoice: patch.brandVoice,
    });
  }
}

export async function clearOperatorSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  if (isSupabaseConfigured()) {
    const client = await supabase();
    await client?.auth.signOut();
  }
}

export async function requireOperator(): Promise<OperatorSession> {
  const s = await readOperatorSession();
  if (s.userId === null) {
    const { redirect } = await import("next/navigation");
    redirect(isSupabaseConfigured() ? "/login" : "/signup");
  }
  return s as OperatorSession;
}

// ---------------------------------------------------------------------------
// Cookie fallback (Sprint 6 V1 behavior, kept for non-Supabase dev mode)
// ---------------------------------------------------------------------------

async function readFromCookie(): Promise<OperatorSession | EmptySession> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return { userId: null };
  try {
    const decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    if (typeof decoded?.userId !== "string") return { userId: null };
    return decoded as OperatorSession;
  } catch {
    return { userId: null };
  }
}

async function writeToCookie(patch: Partial<OperatorSession>): Promise<void> {
  const existing = await readFromCookie();
  const base: OperatorSession =
    existing.userId === null
      ? {
          userId: patch.userId ?? newId("usr"),
          email: patch.email ?? "",
          organizationId: patch.organizationId ?? newId("org"),
          onboarded: false,
        }
      : existing;
  const merged: OperatorSession = { ...base, ...patch };
  const store = await cookies();
  store.set(
    COOKIE_NAME,
    Buffer.from(JSON.stringify(merged), "utf8").toString("base64"),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    },
  );
}

function newId(prefix: string): string {
  const bytes = new Uint8Array(8);
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${prefix}_${hex}`;
}
