import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic SDK singleton with prompt caching enabled.
 *
 * Use this for every Claude call in the platform. Returns `null` when no
 * `ANTHROPIC_API_KEY` is set — callers fall back to `mock.ts` so dev works
 * without a key.
 *
 * Doctrine: Anthropic Claude is the primary brain. Prompts versioned as code
 * in packages/ai/src/prompts/. Caching reduces system-prompt costs by ~90%.
 */

let singleton: Anthropic | null | undefined;

export function getAnthropic(): Anthropic | null {
  if (singleton !== undefined) return singleton;
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key || key === "REPLACE_ME") {
    singleton = null;
    return null;
  }
  singleton = new Anthropic({ apiKey: key });
  return singleton;
}

export function isAIMockMode(): boolean {
  return getAnthropic() === null;
}

/** Default model. Sonnet 4.6 is the right speed/cost tradeoff for most flows. */
export const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

/** Higher-stakes reasoning (e.g. provider draft review). */
export const REASONING_MODEL = process.env.ANTHROPIC_REASONING_MODEL ?? "claude-opus-4-7";
