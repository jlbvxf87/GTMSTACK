"use server";

import { redirect } from "next/navigation";
import { provisionOperator } from "@gtmstack/database-core";

import { supabase, supabaseAdmin, isSupabaseConfigured } from "../../lib/supabase";
import { writeOperatorSession } from "../../lib/operator-session";

/**
 * Signup server action. Creates a Supabase Auth user, then provisions the
 * matching `organizations` + `operators` rows via the admin (service-role)
 * client.
 *
 * Falls back to cookie session if Supabase isn't configured (dev convenience).
 */
export async function signupAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const brandName = String(formData.get("brandName") ?? "").trim();

  if (!email || !password || !brandName) {
    redirect("/signup?error=missing");
  }
  if (password.length < 8) {
    redirect("/signup?error=weak_password");
  }

  const storefrontSlug = slugify(brandName);

  if (!isSupabaseConfigured()) {
    // Cookie fallback path (Sprint 6 behavior). Same UX, no real auth.
    await writeOperatorSession({
      email,
      brandName,
      storefrontSlug,
    });
    redirect("/onboarding/vertical");
  }

  const client = await supabase();
  if (!client) {
    // Shouldn't happen since isSupabaseConfigured returned true, but be safe.
    redirect("/signup?error=auth");
  }

  // 1) Create the Supabase Auth user.
  const { data: authData, error: authError } = await client.auth.signUp({
    email,
    password,
  });

  if (authError) {
    const code =
      authError.message.toLowerCase().includes("already")
        ? "exists"
        : "auth";
    redirect(`/signup?error=${code}`);
  }

  const user = authData.user;
  if (!user) {
    redirect("/signup?error=auth");
  }

  // 2) Provision organization + operator rows via service-role client.
  const admin = supabaseAdmin();
  if (!admin) {
    redirect("/signup?error=auth");
  }

  try {
    await provisionOperator(admin, {
      userId: user.id,
      email,
      brandName,
      storefrontSlug,
    });
  } catch (err) {
    console.error("[signup] provisionOperator failed:", err);
    redirect("/signup?error=auth");
  }

  // 3) Continue to onboarding.
  redirect("/onboarding/vertical");
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "operator"
  );
}
