import { z } from "zod";

/**
 * Brand voice — the output of `generateBrandVoice`. This is the canonical
 * "brand identity" shape. Everything downstream (storefront preview, hero
 * copy, product cards, FAQ section) reads from this shape.
 *
 * Stored on `storefronts.brand_voice` once the operator approves it.
 */
export const BrandIdentitySchema = z.object({
  tagline: z
    .string()
    .min(8, "Tagline too short")
    .max(140, "Tagline too long"),
  eyebrow: z
    .string()
    .min(2, "Eyebrow too short")
    .max(60, "Eyebrow too long"),
  headline: z
    .string()
    .min(6, "Headline too short")
    .max(120, "Headline too long"),
  subhead: z
    .string()
    .min(20, "Subhead too short")
    .max(280, "Subhead too long"),
  /** 3-6 short adjectives describing the voice (e.g. "warm", "evidence-led"). */
  voiceRegister: z.array(z.string().min(2).max(40)).min(3).max(6),
  /** One-liner per product slug. */
  productPositionings: z
    .array(
      z.object({
        slug: z.string(),
        oneliner: z.string().min(8).max(140),
      }),
    )
    .min(1)
    .max(12),
  /** 3-8 FAQ drafts the operator can edit. */
  faqDrafts: z
    .array(
      z.object({
        question: z.string().min(6).max(180),
        answer: z.string().min(20).max(800),
      }),
    )
    .min(3)
    .max(8),
});

export type BrandIdentity = z.infer<typeof BrandIdentitySchema>;

/**
 * Input the operator submits to brand-voice generation. The system prompt
 * uses every field to shape the output.
 */
export const BrandVoiceInputSchema = z.object({
  /** What the operator wrote — 1-3 sentences describing their brand. */
  description: z.string().min(20).max(2000),
  /** Theme family — controls Claude's stylistic guardrails. */
  theme: z.enum(["wellness", "clinical", "community"]),
  /** Operator's working brand name (may be blank to ask Claude to suggest one later). */
  brandName: z.string().min(1).max(80),
  /** Product slugs to write positioning lines for. Optional. */
  productSlugs: z.array(z.string()).default([]),
  /** Optional named products with current copy for context. */
  productContext: z
    .array(
      z.object({
        slug: z.string(),
        name: z.string(),
        currentDescription: z.string().optional(),
      }),
    )
    .default([]),
});

export type BrandVoiceInput = z.infer<typeof BrandVoiceInputSchema>;
