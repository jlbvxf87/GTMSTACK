import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { mockBrandIdentity } from "@gtmstack/ai";

/**
 * POST /api/landing-demo
 *
 * Public, unauthenticated endpoint that returns a mock brand identity. Used
 * by the "Try the AI brand voice" widget on the GTMStack landing — visitors
 * can sample the marquee feature before signing up.
 *
 * Returns mock output regardless of ANTHROPIC_API_KEY so landing-page traffic
 * doesn't accidentally bill real Claude. The real signup flow uses live
 * Claude.
 */

const InputSchema = z.object({
  description: z.string().min(20).max(2000),
  theme: z.enum(["wellness", "clinical", "community"]),
  brandName: z.string().min(1).max(80).optional().default("Your Brand"),
});

export async function POST(req: NextRequest) {
  let parsed;
  try {
    const body = await req.json();
    parsed = InputSchema.safeParse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = mockBrandIdentity({
    description: parsed.data.description,
    theme: parsed.data.theme,
    brandName: parsed.data.brandName,
    productSlugs: [],
    productContext: [],
  });

  return NextResponse.json(result);
}
