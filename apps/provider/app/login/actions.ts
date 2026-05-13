"use server";

import { redirect } from "next/navigation";

import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { getCurrentProvider } from "@gtmstack/database-core";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/queue");

  if (!email || !password) {
    redirect("/login?error=missing");
  }
  if (!isSupabaseConfigured()) {
    redirect("/login?error=config");
  }

  const client = await supabase();
  if (!client) redirect("/login?error=config");

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/login?error=invalid");
  }

  // Second gate: must be in providers table.
  const provider = await getCurrentProvider(client);
  if (!provider) {
    redirect("/login?error=unauthorized");
  }

  redirect(next);
}
