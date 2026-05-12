import "server-only";
import { cookies } from "next/headers";

import type { Operator, OperatorPlan } from "@gtmstack/payments";

/**
 * Operator context — single cookie until Supabase Auth + operators table land
 * in Sprint 6. The cookie carries `{ id, plan, stripeAccountId?, state? }`.
 * Anything reading "who is the current operator" goes through here so swap-in
 * later requires touching only this file.
 *
 * Default operator: Prime Wellness on the `growth` plan. /connect can attach
 * a Stripe account id.
 */

const COOKIE_NAME = "gtm_op";

type StoredOperator = {
  id: string;
  plan: OperatorPlan;
  stripeAccountId?: string;
  state?: string;
};

const DEFAULT_OPERATOR: StoredOperator = {
  id: "prime-wellness",
  plan: "growth",
};

export async function readOperator(): Promise<Operator> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return { ...DEFAULT_OPERATOR };
  try {
    const decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    return { ...DEFAULT_OPERATOR, ...decoded };
  } catch {
    return { ...DEFAULT_OPERATOR };
  }
}

export async function writeOperator(next: Partial<StoredOperator>): Promise<void> {
  const current = await readOperator();
  const merged: StoredOperator = { ...current, ...next };
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
