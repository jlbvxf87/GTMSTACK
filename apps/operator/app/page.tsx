import { redirect } from "next/navigation";

import { readOperatorSession } from "../lib/operator-session";

/**
 * Operator landing. Logged in → /dashboard. Logged out → /signup.
 * (Sprint 6 V1 stub — a real marketing landing is a separate concern.)
 */
export default async function OperatorLanding() {
  const session = await readOperatorSession();
  if (session.userId) {
    redirect("/dashboard");
  }
  redirect("/signup");
}
