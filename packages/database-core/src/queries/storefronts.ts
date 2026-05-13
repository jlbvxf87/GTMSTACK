import "server-only";

import type { AppSupabaseClient } from "../server-client";
import type {
  BrandVoiceJson,
  StorefrontRow,
  StorefrontTheme,
} from "../types";

/** Get the storefront for the signed-in operator's organization. */
export async function getCurrentStorefront(
  client: AppSupabaseClient,
  organizationId: string,
): Promise<StorefrontRow | null> {
  const { data } = await client
    .from("storefronts")
    .select("*")
    .eq("organization_id", organizationId)
    .maybeSingle();
  return (data as StorefrontRow | null) ?? null;
}

/**
 * Upsert the storefront for an organization. Creates if absent; otherwise
 * patches the fields provided.
 */
export async function upsertStorefront(
  client: AppSupabaseClient,
  args: {
    organizationId: string;
    slug: string;
    theme: StorefrontTheme;
    brandVoice?: BrandVoiceJson;
  },
): Promise<StorefrontRow | null> {
  const { data: existing } = await client
    .from("storefronts")
    .select("*")
    .eq("organization_id", args.organizationId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await client
      .from("storefronts")
      .update({
        slug: args.slug,
        theme: args.theme,
        ...(args.brandVoice ? { brand_voice: args.brandVoice } : {}),
      } as never)
      .eq("id", (existing as StorefrontRow).id)
      .select("*")
      .single();
    if (error) {
      console.error("[storefronts.upsert update]", error);
      return null;
    }
    return data as StorefrontRow;
  }

  const { data, error } = await client
    .from("storefronts")
    .insert({
      organization_id: args.organizationId,
      slug: args.slug,
      theme: args.theme,
      brand_voice: args.brandVoice ?? null,
      status: "draft",
    } as never)
    .select("*")
    .single();
  if (error) {
    console.error("[storefronts.upsert insert]", error);
    return null;
  }
  return data as StorefrontRow;
}
