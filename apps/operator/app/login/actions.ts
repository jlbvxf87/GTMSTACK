"use server";

import { redirect } from "next/navigation";

import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  if (!isSupabaseConfigured()) {
    redirect("/login?error=invalid");
  }

  const client = await supabase();
  if (!client) redirect("/login?error=invalid");

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/login?error=invalid");
  }

  redirect(next);
}
