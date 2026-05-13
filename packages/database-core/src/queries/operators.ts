import "server-only";

import type { AppSupabaseClient } from "../server-client";
import type { OperatorRow, OrganizationRow } from "../types";

/** Get the operator + their organization for the currently-signed-in user. */
export async function getCurrentOperator(
  client: AppSupabaseClient,
): Promise<{ operator: OperatorRow; organization: OrganizationRow } | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  const { data: operator } = await client
    .from("operators")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!operator) return null;

  const { data: organization } = await client
    .from("organizations")
    .select("*")
    .eq("id", (operator as OperatorRow).organization_id)
    .maybeSingle();
  if (!organization) return null;

  return {
    operator: operator as OperatorRow,
    organization: organization as OrganizationRow,
  };
}

export type ProvisionOperatorInput = {
  userId: string;
  email: string;
  brandName: string;
  storefrontSlug: string;
};

/**
 * Create org + operator rows for a newly-signed-up user. Uses the admin
 * (service-role) client so it can write across tables and bypass RLS during
 * provisioning. Idempotent on `(owner_user_id)` for the org and `(user_id)`
 * for the operator.
 */
export async function provisionOperator(
  admin: AppSupabaseClient,
  input: ProvisionOperatorInput,
): Promise<{ operator: OperatorRow; organization: OrganizationRow }> {
  const { data: existingOrg } = await admin
    .from("organizations")
    .select("*")
    .eq("owner_user_id", input.userId)
    .maybeSingle();

  let organization: OrganizationRow;
  if (existingOrg) {
    organization = existingOrg as OrganizationRow;
  } else {
    const { data, error } = await admin
      .from("organizations")
      .insert({
        owner_user_id: input.userId,
        name: input.brandName,
        slug: input.storefrontSlug,
      } as never)
      .select("*")
      .single();
    if (error) throw error;
    organization = data as OrganizationRow;
  }

  const { data: existingOperator } = await admin
    .from("operators")
    .select("*")
    .eq("user_id", input.userId)
    .maybeSingle();

  let operator: OperatorRow;
  if (existingOperator) {
    operator = existingOperator as OperatorRow;
  } else {
    const { data, error } = await admin
      .from("operators")
      .insert({
        user_id: input.userId,
        organization_id: organization.id,
        plan: "starter",
        brand_name: input.brandName,
        storefront_slug: input.storefrontSlug,
        onboarded: false,
      } as never)
      .select("*")
      .single();
    if (error) throw error;
    operator = data as OperatorRow;
  }

  return { operator, organization };
}

/**
 * Patch the operator row for the signed-in user. Uses the user's client (RLS
 * applies — operator can only update their own row).
 */
export async function updateOperator(
  client: AppSupabaseClient,
  patch: Partial<OperatorRow>,
): Promise<OperatorRow | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;
  const { data, error } = await client
    .from("operators")
    .update(patch as never)
    .eq("user_id", user.id)
    .select("*")
    .single();
  if (error) {
    console.error("[operators.updateOperator]", error);
    return null;
  }
  return data as OperatorRow;
}
