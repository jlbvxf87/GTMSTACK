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

export { resolveStorefrontBySlug } from "./queries/operator-lookup";
export type { StorefrontResolution } from "./queries/operator-lookup";

export {
  getCurrentCustomer,
  provisionCustomer,
  getOrdersForCustomer,
  getOrdersForOrganization,
  insertOrder,
  getSubscriptionsForCustomer,
  getSubscriptionsForOrganization,
  insertSubscription,
  updateSubscriptionStatus,
  findOrganizationIdBySlug,
} from "./queries/customers";
export type { ProvisionCustomerInput } from "./queries/customers";

export {
  insertPendingIntake,
  listPendingIntakes,
  getPendingIntake,
  reviewPendingIntake,
  listIntakeMessages,
  insertIntakeMessage,
  getCurrentProvider,
  provisionProvider,
} from "./queries/intakes";
export type { InsertPendingIntakeInput } from "./queries/intakes";

export {
  getOrdersTimeSeries,
  getNewCustomersTimeSeries,
  getMrrTimeSeries,
  getTopProducts,
  getChurnSnapshot,
} from "./queries/analytics";
export type { DailyPoint, TopProduct, ChurnSnapshot } from "./queries/analytics";
