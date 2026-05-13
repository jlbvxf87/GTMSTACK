"use server";

import { redirect } from "next/navigation";
import { provisionCustomer } from "@gtmstack/database-core";

import { supabase, supabaseAdmin, isSupabaseConfigured } from "../../../lib/supabase";
import { resolveStorefront } from "../../../lib/operator-resolver";

export async function signupAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const operator = String(formData.get("operator") ?? "").trim();

  const backHref = operator ? `/account/signup?operator=${operator}` : "/account/signup";

  if (!email || !password || !firstName || !lastName) {
    redirect(`${backHref}&error=missing`);
  }
  if (password.length < 8) {
    redirect(`${backHref}&error=weak`);
  }
  if (!isSupabaseConfigured()) {
    redirect(`${backHref}&error=auth`);
  }

  const ctx = await resolveStorefront({ searchParams: { operator } });
  if (!ctx) {
    redirect(`${backHref}&error=auth`);
  }

  const client = await supabase();
  if (!client) redirect(`${backHref}&error=auth`);

  const { data: authData, error: authError } = await client.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  });

  if (authError) {
    const code = authError.message.toLowerCase().includes("already") ? "exists" : "auth";
    redirect(`${backHref}&error=${code}`);
  }
  const user = authData.user;
  if (!user) redirect(`${backHref}&error=auth`);

  const admin = supabaseAdmin();
  if (!admin) redirect(`${backHref}&error=auth`);

  try {
    await provisionCustomer(admin, {
      userId: user.id,
      email,
      organizationId: ctx.organization.id,
      firstName,
      lastName,
    });
  } catch (err) {
    console.error("[customer signup] provisionCustomer failed:", err);
    redirect(`${backHref}&error=auth`);
  }

  redirect(`/account?operator=${operator}`);
}
