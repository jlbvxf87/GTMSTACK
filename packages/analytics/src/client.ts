import "server-only";
import { PostHog } from "posthog-node";

import type { AnalyticsEvent, TrackProperties } from "./events";

/**
 * Server-side PostHog client.
 *
 * Mock-mode policy (same shape as @gtmstack/payments and @gtmstack/jobs):
 * when `POSTHOG_KEY` isn't set, track() logs to the dev console and returns.
 * Same code path lights up automatically when an operator wires their own
 * PostHog key — no app-level conditionals required.
 *
 * NB: PostHog Node is fire-and-forget; we deliberately don't await flush
 * after each call. Use `flush()` at the end of long-running scripts.
 */

let cached: PostHog | null | undefined;

export function isAnalyticsMockMode(): boolean {
  return !process.env.POSTHOG_KEY;
}

function getClient(): PostHog | null {
  if (isAnalyticsMockMode()) return null;
  if (cached !== undefined) return cached;
  const key = process.env.POSTHOG_KEY;
  const host = process.env.POSTHOG_HOST ?? "https://us.i.posthog.com";
  if (!key) {
    cached = null;
    return null;
  }
  cached = new PostHog(key, { host, flushAt: 1, flushInterval: 0 });
  return cached;
}

export async function track(args: {
  event: AnalyticsEvent;
  distinctId: string;
  properties?: TrackProperties;
}): Promise<void> {
  const client = getClient();
  if (!client) {
    // eslint-disable-next-line no-console
    console.log(`[analytics:mock] ${args.event}`, {
      distinctId: args.distinctId,
      ...(args.properties ?? {}),
    });
    return;
  }
  client.capture({
    event: args.event,
    distinctId: args.distinctId,
    properties: args.properties,
  });
}

export async function flush(): Promise<void> {
  const client = getClient();
  if (!client) return;
  await client.shutdown();
  cached = undefined;
}
