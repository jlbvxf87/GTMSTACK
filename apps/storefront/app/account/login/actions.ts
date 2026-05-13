"use server";

import { redirect } from "next/navigation";

import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const operator = String(formData.get("operator") ?? "").trim();
  const backHref = operator ? `/account/login?operator=${operator}` : "/account/login";

  if (!email || !password) redirect(`${backHref}&error=missing`);
  if (!isSupabaseConfigured()) redirect(`${backHref}&error=invalid`);

  const client = await supabase();
  if (!client) redirect(`${backHref}&error=invalid`);

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) redirect(`${backHref}&error=invalid`);

  redirect(operator ? `/account?operator=${operator}` : "/account");
}
