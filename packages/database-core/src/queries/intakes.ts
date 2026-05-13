import "server-only";

import type { AppSupabaseClient } from "../server-client";
import type {
  IntakeMessageRow,
  PendingIntakeRow,
  ProviderRow,
} from "../types";

// ---------------------------------------------------------------------------
// pending_intakes
// ---------------------------------------------------------------------------

export type InsertPendingIntakeInput = {
  organizationId: string;
  customerEmail: string;
  customerId?: string | null;
  productSlug: string;
  payload: Record<string, unknown>;
};

export async function insertPendingIntake(
  admin: unknown,
  input: InsertPendingIntakeInput,
): Promise<PendingIntakeRow | null> {
  const client = admin as AppSupabaseClient;
  const { data, error } = await client
    .from("pending_intakes")
    .insert({
      organization_id: input.organizationId,
      customer_email: input.customerEmail,
      customer_id: input.customerId ?? null,
      product_slug: input.productSlug,
      payload: input.payload,
    } as never)
    .select("*")
    .single();
  if (error) {
    console.error("[intakes.insertPendingIntake]", error);
    return null;
  }
  return data as PendingIntakeRow;
}

export async function listPendingIntakes(
  client: AppSupabaseClient,
  args: { status?: PendingIntakeRow["status"]; limit?: number } = {},
): Promise<PendingIntakeRow[]> {
  let q = client
    .from("pending_intakes")
    .select("*")
    .order("created_at", { ascending: false });
  if (args.status) q = q.eq("status", args.status);
  q = q.limit(args.limit ?? 50);
  const { data } = await q;
  return (data as PendingIntakeRow[] | null) ?? [];
}

export async function getPendingIntake(
  client: AppSupabaseClient,
  id: string,
): Promise<PendingIntakeRow | null> {
  const { data } = await client
    .from("pending_intakes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as PendingIntakeRow | null) ?? null;
}

export async function reviewPendingIntake(
  client: AppSupabaseClient,
  args: {
    intakeId: string;
    decision: "approved" | "declined" | "more_info";
    decisionNotes?: string;
  },
): Promise<PendingIntakeRow | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;
  const { data: provider } = await client
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!provider) return null;

  const { data, error } = await client
    .from("pending_intakes")
    .update({
      status: args.decision,
      reviewed_by_provider_id: (provider as { id: string }).id,
      reviewed_at: new Date().toISOString(),
      decision_notes: args.decisionNotes ?? null,
    } as never)
    .eq("id", args.intakeId)
    .select("*")
    .single();
  if (error) {
    console.error("[intakes.reviewPendingIntake]", error);
    return null;
  }
  return data as PendingIntakeRow;
}

// ---------------------------------------------------------------------------
// intake_messages
// ---------------------------------------------------------------------------

export async function listIntakeMessages(
  client: AppSupabaseClient,
  pendingIntakeId: string,
): Promise<IntakeMessageRow[]> {
  const { data } = await client
    .from("intake_messages")
    .select("*")
    .eq("pending_intake_id", pendingIntakeId)
    .order("created_at", { ascending: true });
  return (data as IntakeMessageRow[] | null) ?? [];
}

export async function insertIntakeMessage(
  client: AppSupabaseClient,
  args: {
    pendingIntakeId: string;
    author: "provider" | "patient" | "system";
    body: string;
  },
): Promise<IntakeMessageRow | null> {
  const { data, error } = await client
    .from("intake_messages")
    .insert({
      pending_intake_id: args.pendingIntakeId,
      author: args.author,
      body: args.body,
    } as never)
    .select("*")
    .single();
  if (error) {
    console.error("[intakes.insertIntakeMessage]", error);
    return null;
  }
  return data as IntakeMessageRow;
}

// ---------------------------------------------------------------------------
// providers
// ---------------------------------------------------------------------------

export async function getCurrentProvider(
  client: AppSupabaseClient,
): Promise<ProviderRow | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;
  const { data } = await client
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  return (data as ProviderRow | null) ?? null;
}

export async function provisionProvider(
  admin: unknown,
  input: {
    userId: string;
    email: string;
    displayName?: string;
    licensedStates?: string[];
  },
): Promise<ProviderRow | null> {
  const client = admin as AppSupabaseClient;
  const { data: existing } = await client
    .from("providers")
    .select("*")
    .eq("user_id", input.userId)
    .maybeSingle();
  if (existing) return existing as ProviderRow;

  const { data, error } = await client
    .from("providers")
    .insert({
      user_id: input.userId,
      email: input.email,
      display_name: input.displayName ?? null,
      licensed_states: input.licensedStates ?? [],
    } as never)
    .select("*")
    .single();
  if (error) {
    console.error("[intakes.provisionProvider]", error);
    return null;
  }
  return data as ProviderRow;
}
