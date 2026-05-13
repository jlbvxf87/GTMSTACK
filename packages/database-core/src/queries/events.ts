import "server-only";

import type { AppSupabaseClient } from "../server-client";
import type { EventRow } from "../types";

/**
 * Recent events for the operator's organization, newest-first. Used by the
 * dashboard "recent activity" feed.
 */
export async function getRecentEvents(
  client: AppSupabaseClient,
  organizationId: string,
  limit = 25,
): Promise<EventRow[]> {
  const { data } = await client
    .from("events")
    .select("*")
    .eq("organization_id", organizationId)
    .order("occurred_at", { ascending: false })
    .limit(limit);
  return (data as EventRow[] | null) ?? [];
}

/**
 * Insert an event. Uses the admin client because webhook receivers and
 * background jobs need to write events even when there's no authenticated
 * user session (and RLS would reject those writes).
 */
export async function insertEvent(
  admin: AppSupabaseClient,
  args: {
    organizationId: string | null;
    type: string;
    payload: Record<string, unknown>;
  },
): Promise<EventRow | null> {
  const { data, error } = await admin
    .from("events")
    .insert({
      organization_id: args.organizationId,
      type: args.type,
      payload: args.payload,
    } as never)
    .select("*")
    .single();
  if (error) {
    console.error("[events.insertEvent]", error);
    return null;
  }
  return data as EventRow;
}
