export * from "./types";
export { createServerClient, isSupabaseConfigured } from "./server-client";
export type { AppSupabaseClient, CookieStore } from "./server-client";
export { createBrowserClient } from "./browser-client";
export { createAdminClient } from "./admin-client";

export {
  getCurrentOperator,
  provisionOperator,
  updateOperator,
} from "./queries/operators";
export type { ProvisionOperatorInput } from "./queries/operators";

export {
  getCurrentStorefront,
  upsertStorefront,
} from "./queries/storefronts";

export { getRecentEvents, insertEvent } from "./queries/events";

export {
  getProductSlugsForStorefront,
  getProductListingsForStorefront,
  setProductSlugsForStorefront,
} from "./queries/product-listings";
