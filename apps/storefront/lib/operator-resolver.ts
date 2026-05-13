import "server-only";
import { headers } from "next/headers";

import {
  resolveStorefrontBySlug,
  type StorefrontResolution,
} from "@gtmstack/database-core";
import { demoBrands, primeWellness } from "@gtmstack/ui";

import { supabaseAdmin } from "./supabase";

/**
 * Resolve "which operator's storefront is this request for?"
 *
 * Production: read the `Host` header. `apex-wellness.gtmstack.shop` →
 * operator slug `apex-wellness`. The `.gtmstack.shop` apex (and `localhost`,
 * `vercel.app`) fall back to a configured demo operator.
 *
 * Dev: `?operator=<slug>` query param wins over Host. Lets you point at
 * `localhost:3002/?operator=apex-wellness` without DNS.
 */

const APEX_DOMAINS = new Set([
  "gtmstack.shop",
  "www.gtmstack.shop",
  "localhost",
  "127.0.0.1",
]);

const DEMO_FALLBACK_SLUG = "prime-wellness";

export type StorefrontContext = StorefrontResolution & {
  resolved: "subdomain" | "query" | "demo-fallback";
};

export async function resolveStorefront(args: {
  searchParams: Record<string, string | string[] | undefined> | undefined;
}): Promise<StorefrontContext | null> {
  const querySlug = pickString(args.searchParams?.operator);
  if (querySlug) {
    const ctx = await tryResolve(querySlug);
    if (ctx) return { ...ctx, resolved: "query" };
  }

  const headerList = await headers();
  const host = headerList.get("host") ?? "";
  const subdomainSlug = subdomainFromHost(host);
  if (subdomainSlug) {
    const ctx = await tryResolve(subdomainSlug);
    if (ctx) return { ...ctx, resolved: "subdomain" };
  }

  // Demo fallback — render Prime Wellness from the fixture so the dev URL
  // localhost:3002 (no host match, no query param) still shows something
  // recognizable. Apps/marketing remains the canonical pitch site.
  return demoFallback();
}

async function tryResolve(slug: string): Promise<StorefrontResolution | null> {
  const admin = supabaseAdmin();
  if (!admin) return null;
  try {
    return await resolveStorefrontBySlug(admin, slug);
  } catch (err) {
    console.error("[operator-resolver] resolve failed for slug", slug, err);
    return null;
  }
}

function subdomainFromHost(host: string): string | null {
  const bare = host.toLowerCase().split(":")[0] ?? "";
  if (!bare || APEX_DOMAINS.has(bare)) return null;
  // `apex-wellness.gtmstack.shop` → `apex-wellness`
  const match = bare.match(/^([a-z0-9-]+)\.gtmstack\.shop$/);
  return match?.[1] ?? null;
}

function pickString(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v ?? undefined;
}

/**
 * Pure-fixture fallback for the demo URL. Returns a synthesized
 * StorefrontContext from `primeWellness` so the page renders even when no
 * matching operator exists in the DB. Mirrors the original Prime Wellness
 * storefront preview that lived at apps/marketing/preview/prime-wellness.
 */
function demoFallback(): StorefrontContext {
  const b = primeWellness;
  return {
    resolved: "demo-fallback",
    organization: {
      id: "demo-org",
      owner_user_id: "demo-user",
      name: b.name,
      slug: DEMO_FALLBACK_SLUG,
      vertical: b.themeName,
      created_at: new Date().toISOString(),
    },
    operator: {
      id: "demo-operator",
      organization_id: "demo-org",
      brand_name: b.name,
      storefront_slug: DEMO_FALLBACK_SLUG,
      plan: "growth",
    },
    storefront: {
      id: "demo-storefront",
      organization_id: "demo-org",
      slug: DEMO_FALLBACK_SLUG,
      theme: b.themeName,
      brand_voice: {
        tagline: b.tagline,
        eyebrow: b.eyebrow,
        headline: b.headline,
        subhead: b.subhead,
        voiceRegister: ["warm", "confident", "evidence-led"],
        productPositionings: b.products.map((p) => ({
          slug: p.slug,
          oneliner: p.description ?? p.name,
        })),
        faqDrafts: b.faqSection.items.map((q) => ({
          question: q.question,
          answer: q.answer,
        })),
      },
      status: "live",
      created_at: new Date().toISOString(),
    },
    productListings: b.products.map((p, i) => ({
      id: `demo-listing-${i}`,
      storefront_id: "demo-storefront",
      product_slug: p.slug,
      retail_price_cents:
        p.price.subscription?.monthly.amount ?? p.price.oneTime?.amount ?? null,
      enabled: true,
      created_at: new Date().toISOString(),
    })),
  };
}

/**
 * Hydrate the resolved operator's product listings into full `Product`
 * objects from the demo-brand fixtures. Until apps/operator's product editor
 * ships (Sprint 8+), product metadata (description, images, ingredients,
 * etc.) still lives in fixtures keyed by slug.
 */
export function hydrateProducts(ctx: StorefrontContext) {
  const themeKey = (ctx.storefront.theme ?? "wellness") as
    | "wellness"
    | "clinical"
    | "community";
  const brand = demoBrands[themeKey];
  const productMap = new Map(brand.products.map((p) => [p.slug, p]));
  return ctx.productListings
    .map((listing) => {
      const product = productMap.get(listing.product_slug);
      if (!product) return null;
      // Override price if operator set a retail override (Sprint 8 feature).
      if (
        listing.retail_price_cents &&
        product.price.subscription?.monthly
      ) {
        return {
          ...product,
          price: {
            ...product.price,
            subscription: {
              ...product.price.subscription,
              monthly: {
                ...product.price.subscription.monthly,
                amount: listing.retail_price_cents,
              },
            },
          },
        };
      }
      return product;
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
}
