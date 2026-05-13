import "server-only";

import type { AppSupabaseClient } from "../server-client";
import type {
  CustomerRow,
  OrderRow,
  SubscriptionRow,
} from "../types";

/**
 * Resolve the current customer for a given organization (operator). Returns
 * null if no customer row exists for this auth user + org pair.
 */
export async function getCurrentCustomer(
  client: AppSupabaseClient,
  organizationId: string,
): Promise<CustomerRow | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;
  const { data } = await client
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .eq("organization_id", organizationId)
    .maybeSingle();
  return (data as CustomerRow | null) ?? null;
}

export type ProvisionCustomerInput = {
  userId: string;
  email: string;
  organizationId: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Create a customer row for a newly-signed-up shopper. Idempotent on
 * (user_id, organization_id). Uses admin client so signup-from-anonymous
 * works before the user has a session attached server-side.
 */
export async function provisionCustomer(
  admin: unknown,
  input: ProvisionCustomerInput,
): Promise<CustomerRow> {
  const client = admin as AppSupabaseClient;
  const { data: existing } = await client
    .from("customers")
    .select("*")
    .eq("user_id", input.userId)
    .eq("organization_id", input.organizationId)
    .maybeSingle();
  if (existing) return existing as CustomerRow;

  const { data, error } = await client
    .from("customers")
    .insert({
      user_id: input.userId,
      email: input.email,
      organization_id: input.organizationId,
      first_name: input.firstName ?? null,
      last_name: input.lastName ?? null,
    } as never)
    .select("*")
    .single();
  if (error) throw error;
  return data as CustomerRow;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function getOrdersForCustomer(
  client: AppSupabaseClient,
  customerId: string,
  limit = 50,
): Promise<OrderRow[]> {
  const { data } = await client
    .from("orders")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as OrderRow[] | null) ?? [];
}

export async function getOrdersForOrganization(
  client: AppSupabaseClient,
  organizationId: string,
  limit = 50,
): Promise<OrderRow[]> {
  const { data } = await client
    .from("orders")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as OrderRow[] | null) ?? [];
}

/**
 * Insert an order row. Webhook receivers use this with the admin client to
 * bypass RLS (anonymous webhook callback has no auth context).
 */
export async function insertOrder(
  admin: unknown,
  args: {
    organizationId: string;
    customerId: string;
    productSlug: string;
    amountCents: number;
    mode: "subscription" | "payment";
    stripeSessionId?: string;
    status?: string;
  },
): Promise<OrderRow | null> {
  const client = admin as AppSupabaseClient;
  const { data, error } = await client
    .from("orders")
    .insert({
      organization_id: args.organizationId,
      customer_id: args.customerId,
      product_slug: args.productSlug,
      amount_cents: args.amountCents,
      mode: args.mode,
      stripe_session_id: args.stripeSessionId,
      status: args.status ?? "active",
    } as never)
    .select("*")
    .single();
  if (error) {
    console.error("[customers.insertOrder]", error);
    return null;
  }
  return data as OrderRow;
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

export async function getSubscriptionsForCustomer(
  client: AppSupabaseClient,
  customerId: string,
): Promise<SubscriptionRow[]> {
  const { data } = await client
    .from("subscriptions")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  return (data as SubscriptionRow[] | null) ?? [];
}

export async function getSubscriptionsForOrganization(
  client: AppSupabaseClient,
  organizationId: string,
): Promise<SubscriptionRow[]> {
  const { data } = await client
    .from("subscriptions")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });
  return (data as SubscriptionRow[] | null) ?? [];
}

export async function insertSubscription(
  admin: unknown,
  args: {
    organizationId: string;
    customerId: string;
    productSlug: string;
    amountCents: number;
    stripeSubscriptionId?: string;
    status?: string;
    currentPeriodEnd?: string;
  },
): Promise<SubscriptionRow | null> {
  const client = admin as AppSupabaseClient;
  const { data, error } = await client
    .from("subscriptions")
    .insert({
      organization_id: args.organizationId,
      customer_id: args.customerId,
      product_slug: args.productSlug,
      amount_cents: args.amountCents,
      stripe_subscription_id: args.stripeSubscriptionId,
      status: args.status ?? "active",
      current_period_end: args.currentPeriodEnd,
    } as never)
    .select("*")
    .single();
  if (error) {
    console.error("[customers.insertSubscription]", error);
    return null;
  }
  return data as SubscriptionRow;
}

export async function updateSubscriptionStatus(
  admin: unknown,
  stripeSubscriptionId: string,
  status: "active" | "paused" | "canceled",
): Promise<void> {
  const client = admin as AppSupabaseClient;
  const { error } = await client
    .from("subscriptions")
    .update({ status } as never)
    .eq("stripe_subscription_id", stripeSubscriptionId);
  if (error) console.error("[customers.updateSubscriptionStatus]", error);
}

/**
 * Look up an organization id by `operators.storefront_slug` OR by
 * `organizations.slug`. Used by webhook handlers to resolve "operator slug"
 * from the canonical event payload into the actual organization uuid.
 */
export async function findOrganizationIdBySlug(
  admin: unknown,
  slug: string,
): Promise<string | null> {
  const client = admin as AppSupabaseClient;
  // Try organizations.slug first.
  const { data: org } = await client
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (org) return (org as { id: string }).id;
  // Fall back to operator.storefront_slug.
  const { data: op } = await client
    .from("operators")
    .select("organization_id")
    .eq("storefront_slug", slug)
    .maybeSingle();
  return (op as { organization_id: string } | null)?.organization_id ?? null;
}
