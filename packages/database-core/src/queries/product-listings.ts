import "server-only";

import type { AppSupabaseClient } from "../server-client";
import type { ProductListingRow } from "../types";

/**
 * Get product listings for a storefront. Returns just the slugs by default —
 * that's what the operator session model carries. Full rows available when
 * the dashboard / catalog editor needs them.
 */
export async function getProductSlugsForStorefront(
  client: AppSupabaseClient,
  storefrontId: string,
): Promise<string[]> {
  const { data } = await client
    .from("product_listings")
    .select("product_slug")
    .eq("storefront_id", storefrontId)
    .eq("enabled", true);
  if (!data) return [];
  return (data as { product_slug: string }[]).map((r) => r.product_slug);
}

export async function getProductListingsForStorefront(
  client: AppSupabaseClient,
  storefrontId: string,
): Promise<ProductListingRow[]> {
  const { data } = await client
    .from("product_listings")
    .select("*")
    .eq("storefront_id", storefrontId)
    .order("created_at", { ascending: true });
  return (data as ProductListingRow[] | null) ?? [];
}

/**
 * Replace the set of enabled product slugs on a storefront. Idempotent.
 *
 * Strategy: upsert rows for the requested slugs, then mark anything else
 * disabled. Avoids the destructive delete + re-insert pattern that loses
 * `retail_price_cents` overrides operators may have set later.
 */
export async function setProductSlugsForStorefront(
  client: AppSupabaseClient,
  storefrontId: string,
  slugs: string[],
): Promise<void> {
  const existing = await getProductListingsForStorefront(client, storefrontId);
  const existingBySlug = new Map(existing.map((r) => [r.product_slug, r]));

  // Enable / insert the requested slugs.
  for (const slug of slugs) {
    const found = existingBySlug.get(slug);
    if (found) {
      if (!found.enabled) {
        await client
          .from("product_listings")
          .update({ enabled: true } as never)
          .eq("id", found.id);
      }
    } else {
      await client
        .from("product_listings")
        .insert({
          storefront_id: storefrontId,
          product_slug: slug,
          enabled: true,
        } as never);
    }
  }

  // Disable anything that's no longer in the requested set.
  const requested = new Set(slugs);
  for (const row of existing) {
    if (!requested.has(row.product_slug) && row.enabled) {
      await client
        .from("product_listings")
        .update({ enabled: false } as never)
        .eq("id", row.id);
    }
  }
}
