import "server-only";

import {
  getCurrentCustomer,
  getOrdersForCustomer,
  getSubscriptionsForCustomer,
  type CustomerRow,
  type OrderRow,
  type SubscriptionRow,
} from "@gtmstack/database-core";

import { supabase, isSupabaseConfigured } from "./supabase";

export type CustomerSession = {
  customer: CustomerRow;
  orders: OrderRow[];
  subscriptions: SubscriptionRow[];
};

/**
 * Resolve the signed-in customer for a given operator. Returns null if no
 * session OR no customer row for this org. Loads orders + subscriptions
 * in parallel because the member portal always needs them.
 */
export async function readCustomerSession(
  organizationId: string,
): Promise<CustomerSession | null> {
  if (!isSupabaseConfigured()) return null;
  const client = await supabase();
  if (!client) return null;

  const customer = await getCurrentCustomer(client, organizationId);
  if (!customer) return null;

  const [orders, subscriptions] = await Promise.all([
    getOrdersForCustomer(client, customer.id),
    getSubscriptionsForCustomer(client, customer.id),
  ]);

  return { customer, orders, subscriptions };
}

export async function requireCustomer(
  organizationId: string,
  redirectTo: string,
): Promise<CustomerSession> {
  const session = await readCustomerSession(organizationId);
  if (!session) {
    const { redirect } = await import("next/navigation");
    redirect(redirectTo);
  }
  return session as CustomerSession;
}
