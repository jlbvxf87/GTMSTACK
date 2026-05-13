import { serve } from "inngest/next";

import { allFunctions, inngest } from "@gtmstack/jobs";

/**
 * /api/inngest — Inngest webhook + function registry endpoint.
 *
 * Inngest's dashboard discovers the GTMStack function set by hitting this
 * route. The same route receives delivery callbacks. In mock mode
 * (INNGEST_EVENT_KEY unset) the registry is still served — the dashboard
 * just can't deliver events — so apps/operator developers can see what
 * would be registered without paying Inngest yet.
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: allFunctions,
});
