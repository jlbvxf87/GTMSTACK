import "server-only";

import type { AppSupabaseClient } from "../server-client";
import type {
  OperatorRow,
  OrganizationRow,
  ProductListingRow,
  StorefrontRow,
} from "../types";

/**
 * Resolve an operator + their storefront + their listed products by
 * `storefronts.slug`. Used by apps/storefront to render a branded storefront
 * for any operator given just a subdomain (or `?operator=slug` query param
 * in dev).
 *
 * Uses an admin client (service role) because the request comes in
 * anonymously — the visitor isn't signed in, but we still need to fetch the
 * operator's public-facing data. RLS would block the user-scoped client.
 *
 * NOTE: this returns ONLY public-facing fields. Don't pass through anything
 * private (stripe_account_id, etc).
 */
export type StorefrontResolution = {
  organization: OrganizationRow;
  operator: Pick<
    OperatorRow,
    "id" | "organization_id" | "brand_name" | "storefront_slug" | "plan"
  >;
  storefront: StorefrontRow;
  productListings: ProductListingRow[];
};

export async function resolveStorefrontBySlug(
  admin: unknown,
  slug: string,
): Promise<StorefrontResolution | null> {
  const client = admin as AppSupabaseClient;

  const { data: storefront } = await client
    .from("storefronts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!storefront) return null;

  const sf = storefront as StorefrontRow;

  const { data: organization } = await client
    .from("organizations")
    .select("*")
    .eq("id", sf.organization_id)
    .maybeSingle();
  if (!organization) return null;

  const { data: operator } = await client
    .from("operators")
    .select("id, organization_id, brand_name, storefront_slug, plan")
    .eq("organization_id", sf.organization_id)
    .maybeSingle();
  if (!operator) return null;

  const { data: listings } = await client
    .from("product_listings")
    .select("*")
    .eq("storefront_id", sf.id)
    .eq("enabled", true);

  return {
    organization: organization as OrganizationRow,
    operator: operator as StorefrontResolution["operator"],
    storefront: sf,
    productListings: (listings as ProductListingRow[] | null) ?? [],
  };
}
