import type { Product } from "@gtmstack/ui";
import { findProductBySlug as findInUiFixtures } from "@gtmstack/ui";

import type { CheckoutProduct } from "@gtmstack/payments";

/**
 * Find a product by slug across the demo brand fixtures shipped from @gtmstack/ui.
 * When apps/operator + Supabase land in Sprint 6, this gets replaced with a real
 * `database-core` query keyed on operator + slug. Callers of this helper change
 * only their import path.
 */
export function findProduct(slug: string): Product | null {
  return findInUiFixtures(slug)?.product ?? null;
}

/** Project a Product into the minimal shape the payments package needs. */
export function toCheckoutProduct(product: Product): CheckoutProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tier: product.tier,
    requiresProviderReview: product.requiresProviderReview,
    price: {
      oneTime: product.price.oneTime,
      subscription: product.price.subscription
        ? { monthly: product.price.subscription.monthly }
        : undefined,
    },
  };
}
