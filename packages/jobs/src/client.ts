import { Inngest } from "inngest";

import type { JobEventName, JobPayloadByName } from "./events";

/**
 * GTMStack Inngest client.
 *
 * Mock-mode policy (consistent with @gtmstack/payments and @gtmstack/ai): when
 * `INNGEST_EVENT_KEY` is unset, `dispatch()` logs the would-be send to the dev
 * console and returns. Production wires the signing + event keys and the same
 * code path actually delivers.
 */

export const inngest = new Inngest({
  id: "gtmstack",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

export function isInngestMockMode(): boolean {
  return !process.env.INNGEST_EVENT_KEY;
}

export async function dispatch<Name extends JobEventName>(
  name: Name,
  data: JobPayloadByName[Name],
): Promise<void> {
  if (isInngestMockMode()) {
    // eslint-disable-next-line no-console
    console.log(`[jobs:mock] would dispatch ${name}`, data);
    return;
  }
  await inngest.send({ name, data: data as Record<string, unknown> });
}
