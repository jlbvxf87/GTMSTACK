"use server";

import { redirect } from "next/navigation";

import { writeOperatorSession } from "../../../lib/operator-session";
import { nextStepHref } from "../../../lib/onboarding-steps";

/**
 * Submit handler for the catalog step.
 *
 * Lives in its own `"use server"` file (not inline in page.tsx) because
 * inline server actions in Next.js 14 occasionally hand the action a
 * plain-object body instead of a real FormData instance — `formData.getAll`
 * then throws `TypeError: getAll is not a function`. Co-located action files
 * are the documented pattern that avoids that quirk.
 */
export async function submitCatalog(formData: FormData): Promise<void> {
  // Defensive read — handles both real FormData and the rare serialized
  // shape Next.js sometimes passes through.
  const productSlugs = readMulti(formData, "productSlugs[]");

  if (productSlugs.length === 0) {
    redirect("/onboarding/catalog?error=1");
  }

  await writeOperatorSession({ productSlugs });
  redirect(nextStepHref("catalog"));
}

/**
 * Reads a multi-valued field from either a real FormData instance or the
 * serialized fallback shape some Next.js dev builds pass.
 */
function readMulti(formData: FormData, name: string): string[] {
  if (typeof (formData as unknown as { getAll?: unknown }).getAll === "function") {
    return formData.getAll(name).map(String);
  }
  // Fallback: iterate entries.
  const out: string[] = [];
  try {
    for (const [k, v] of formData as unknown as Iterable<[string, FormDataEntryValue]>) {
      if (k === name) out.push(String(v));
    }
  } catch {
    // Last resort — empty array; caller treats as validation error.
  }
  return out;
}
