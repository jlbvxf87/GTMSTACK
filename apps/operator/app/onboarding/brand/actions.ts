"use server";

import { redirect } from "next/navigation";

import { generateBrandVoice } from "@gtmstack/ai";

import {
  readOperatorSession,
  requireOperator,
  writeOperatorSession,
} from "../../../lib/operator-session";
import { nextStepHref } from "../../../lib/onboarding-steps";

function defaultProductSlugsForTheme(theme: "wellness" | "clinical" | "community"): string[] {
  switch (theme) {
    case "clinical":
      return ["hormone-baseline", "peptide-performance", "longevity-panel"];
    case "community":
      return ["pre-lift", "whey-foundation", "post-recovery"];
    default:
      return ["daily-greens", "sleep-stack", "recovery-kit"];
  }
}

/**
 * Generate brand voice from operator's description. Calls Claude (or mock).
 * Stores the result in the session and re-renders the page in "edit" mode.
 */
export async function generateAction(formData: FormData): Promise<void> {
  const description = String(formData.get("description") ?? "").trim();
  const theme = String(formData.get("theme") ?? "wellness") as
    | "wellness"
    | "clinical"
    | "community";
  const brandName = String(formData.get("brandName") ?? "").trim();

  if (description.length < 20) {
    redirect("/onboarding/brand?error=missing");
  }

  try {
    const session = await readOperatorSession();
    const productSlugs =
      session.userId !== null && session.productSlugs?.length
        ? session.productSlugs
        : defaultProductSlugsForTheme(theme);

    const brandVoice = await generateBrandVoice({
      description,
      theme,
      brandName: brandName || "Operator Brand",
      productSlugs,
      productContext: [],
    });

    await writeOperatorSession({ brandVoice, theme });
    redirect("/onboarding/brand");
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    console.error("[brand-voice] generation failed:", err);
    redirect("/onboarding/brand?error=ai");
  }
}

/** Save edits to the generated brand voice and move on to Step 3. */
export async function acceptAction(formData: FormData): Promise<void> {
  const session = await requireOperator();
  if (!session.brandVoice) redirect("/onboarding/brand");

  const patched = {
    ...session.brandVoice,
    tagline: String(formData.get("tagline") ?? session.brandVoice.tagline),
    eyebrow: String(formData.get("eyebrow") ?? session.brandVoice.eyebrow),
    headline: String(formData.get("headline") ?? session.brandVoice.headline),
    subhead: String(formData.get("subhead") ?? session.brandVoice.subhead),
  };

  await writeOperatorSession({ brandVoice: patched });
  redirect(nextStepHref("brand"));
}

/** Clear the generated brand voice and return to the description form. */
export async function regenerateAction(): Promise<void> {
  await writeOperatorSession({ brandVoice: undefined });
  redirect("/onboarding/brand");
}
