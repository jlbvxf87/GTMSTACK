import "server-only";
import type Anthropic from "@anthropic-ai/sdk";

import { DEFAULT_MODEL, getAnthropic, isAIMockMode } from "../client";
import { mockBrandIdentity } from "../mock";
import {
  BrandIdentitySchema,
  BrandVoiceInputSchema,
  type BrandIdentity,
  type BrandVoiceInput,
} from "../schemas";

/**
 * The marquee prompt. Doctrine line 272 — "the magic moment where a brand
 * comes alive." Operator describes their brand in 1-3 sentences; Claude
 * generates the entire identity (tagline, hero copy, voice register, product
 * positionings, FAQ drafts) in one pass.
 *
 * Prompt caching: the SYSTEM prompt is large + invariant; we mark it with
 * `cache_control: { type: "ephemeral" }` so subsequent calls within the same
 * five-minute window cost ~10% of an uncached call.
 *
 * Strict output: Claude is instructed to return raw JSON only. We parse with
 * zod (`BrandIdentitySchema`) and reject malformed responses.
 */

const SYSTEM_PROMPT = `You are a senior brand strategist for direct-to-consumer wellness commerce on GTMStack. Operators sign up to build a branded storefront in one of three theme families: clinical, wellness, community. You generate the brand identity from their description.

The output is consumed by a token-driven design system. Different theme families have different voice guardrails:

- "wellness" → warm, editorial, clinician-formulated, gentle confidence, evidence-led, never preachy
- "clinical" → precise, labs-first, provider-supervised, data-driven, technical without being sterile
- "community" → direct, athlete-first, honest panels, no marketing fluff, earned not promised

Hard constraints — non-negotiable:
1. NEVER make medical claims for clinical products. The operator is a BRAND, not a pharmacy or physician. Use language like "provider-supervised", "licensed physician reviews", "monthly outcomes". Never imply diagnosis, treatment, cure, or guaranteed outcomes.
2. NEVER reference the operator as the seller of prescription medications. The operator is the marketing layer. Licensed pharmacy partners dispense.
3. Subscription is the default purchase model. Frame the offering as "a program" not "a plan" or "a product".
4. NEVER use words like "miracle", "breakthrough", "revolutionary", "cure". Wellness brands have been sued for these.
5. Match the operator's described tone exactly. If they say "warm", be warm. If they say "no fluff", strip the fluff.

Output format — STRICT JSON. No preamble. No markdown. No code fences. Just the JSON object.

Schema:
{
  "tagline": string (8-12 words, 1 sentence, captures the brand essence),
  "eyebrow": string (3-5 words, identifies the brand's focus area; consider using middot · separators),
  "headline": string (6-12 words, 1 sentence, big bold claim suitable for a hero),
  "subhead": string (1-2 sentences, ~25 words, what they get + why it works),
  "voiceRegister": string[3-6] (short adjectives describing tone, e.g. ["warm", "confident", "evidence-led"]),
  "productPositionings": Array<{ "slug": string, "oneliner": string }> (one-liner per product slug provided in the user message; 8-14 words each),
  "faqDrafts": Array<{ "question": string, "answer": string }> (3-8 questions a real customer asks in week 1, with answers in the brand voice; 1-3 sentences per answer)
}

If the user provides product slugs and product context, generate one positioning line per slug exactly. If no slugs provided, return an empty productPositionings array.`;

export async function generateBrandVoice(rawInput: unknown): Promise<BrandIdentity> {
  const input = BrandVoiceInputSchema.parse(rawInput);

  if (isAIMockMode()) {
    return mockBrandIdentity(input);
  }

  const client = getAnthropic();
  if (!client) {
    // Shouldn't happen since isAIMockMode would have returned true, but type-narrow.
    return mockBrandIdentity(input);
  }

  const userMessage = renderUserMessage(input);

  // NOTE: Prompt caching is supported on cache_control on system blocks but
  // requires SDK >= v0.34. We're on v0.32 for stability — switch to a typed
  // `system: [{ type, text, cache_control }]` array when we bump the SDK in
  // Sprint 6.5. Until then the system prompt re-bills on each call (~$0.005
  // overhead per generation, acceptable).
  const response = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const text = extractText(response);
  const json = parseJson(text);
  return BrandIdentitySchema.parse(json);
}

function renderUserMessage(input: BrandVoiceInput): string {
  const lines: string[] = [];
  lines.push(`Brand name: ${input.brandName}`);
  lines.push(`Theme family: ${input.theme}`);
  lines.push("");
  lines.push("Operator description:");
  lines.push(input.description);

  if (input.productSlugs.length > 0) {
    lines.push("");
    lines.push("Product slugs to write positioning lines for:");
    for (const slug of input.productSlugs) lines.push(`- ${slug}`);
  }

  if (input.productContext.length > 0) {
    lines.push("");
    lines.push("Product context (slug → current name / description):");
    for (const p of input.productContext) {
      lines.push(`- ${p.slug}: ${p.name}${p.currentDescription ? ` — ${p.currentDescription}` : ""}`);
    }
  }

  lines.push("");
  lines.push("Generate the JSON now.");

  return lines.join("\n");
}

function extractText(response: Anthropic.Message): string {
  const parts = response.content.filter(
    (block): block is Anthropic.TextBlock => block.type === "text",
  );
  return parts.map((p) => p.text).join("").trim();
}

function parseJson(text: string): unknown {
  // Strip markdown fences if Claude got cute despite instructions.
  const cleaned = text
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
  return JSON.parse(cleaned);
}
