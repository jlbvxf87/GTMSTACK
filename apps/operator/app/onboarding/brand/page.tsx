import { redirect } from "next/navigation";
import { IntakeField, IntakeShell } from "@gtmstack/ui";
import { isAIMockMode } from "@gtmstack/ai";

import { requireOperator } from "../../../lib/operator-session";
import type { OperatorSession } from "../../../lib/operator-session";
import {
  completedIntakeKeysFor,
  currentIntakeKey,
  intakeStepsForOperator,
} from "../../../lib/onboarding-steps";

import { generateAction, acceptAction, regenerateAction } from "./actions";

/**
 * Step 2 — ★ AI Brand Voice ★ — the marquee feature.
 *
 * Empty state: operator describes brand in 1-3 sentences → Generate.
 * Populated state: editable fields rendered from Claude's response →
 * Regenerate OR Looks good → Continue.
 */
export default async function BrandStep({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await requireOperator();
  const sp = (await searchParams) ?? {};
  const error = sp.error;

  if (!session.theme) redirect("/onboarding/vertical");

  return (
    <IntakeShell
      brandName={session.brandName ?? "GTMStack"}
      brandHref="/dashboard"
      steps={intakeStepsForOperator()}
      currentStep={currentIntakeKey("brand")}
      completedSteps={completedIntakeKeysFor(["vertical"])}
      eyebrow="Step 2 of 5"
      headline={
        session.brandVoice
          ? "Here's your brand. Edit anything."
          : "Tell us about your brand."
      }
      subhead={
        session.brandVoice
          ? "Tweak any field. Regenerate to start over. When you're happy, continue."
          : "Two sentences is plenty. Describe the audience, what they care about, and how you want to sound."
      }
      backHref="/onboarding/vertical"
    >
      {session.brandVoice ? (
        <BrandVoiceEditor session={session} />
      ) : (
        <BrandVoicePrompt session={session} error={error} />
      )}
    </IntakeShell>
  );
}

function BrandVoicePrompt({
  session,
  error,
}: {
  session: OperatorSession;
  error: string | undefined;
}) {
  const mockMode = isAIMockMode();

  return (
    <form action={generateAction} className="flex flex-col gap-6">
      {mockMode ? (
        <div className="rounded-card border-card border-border bg-muted p-4">
          <p className="font-mono text-small uppercase tracking-[0.16em] text-muted-foreground">
            Dev mode — using mock brand voice
          </p>
          <p className="mt-2 text-small text-muted-foreground">
            Set <code className="font-mono">ANTHROPIC_API_KEY</code> in{" "}
            <code className="font-mono">.env.local</code> to swap mock responses for real Claude
            generation. No code changes needed.
          </p>
        </div>
      ) : null}

      <IntakeField
        name="description"
        label="Your brand, in your own words"
        multiline
        rows={6}
        required
        placeholder="Premium wellness brand for ambitious 30-something creators who care about cognitive performance, sleep, and recovery. Voice: warm, confident, evidence-led, never preachy."
        helperText="Audience · what they care about · what voice you want."
        maxLength={2000}
        error={
          error === "missing"
            ? "Add a few sentences first."
            : error === "ai"
              ? "AI call failed — try again or simplify your description."
              : undefined
        }
      />

      <input type="hidden" name="theme" value={session.theme ?? "wellness"} />
      <input type="hidden" name="brandName" value={session.brandName ?? ""} />

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {mockMode ? "Generate (mock)" : "Generate brand voice"}
        </button>
      </div>
    </form>
  );
}

function BrandVoiceEditor({ session }: { session: OperatorSession }) {
  const v = session.brandVoice!;

  return (
    <div className="flex flex-col gap-8">
      <form action={acceptAction} className="flex flex-col gap-8">
        <IntakeField name="tagline" label="Tagline" required defaultValue={v.tagline} maxLength={140} />
        <IntakeField name="eyebrow" label="Hero eyebrow" required defaultValue={v.eyebrow} maxLength={60} />
        <IntakeField name="headline" label="Hero headline" required defaultValue={v.headline} maxLength={120} />
        <IntakeField
          name="subhead"
          label="Hero subhead"
          required
          multiline
          rows={3}
          defaultValue={v.subhead}
          maxLength={280}
        />

        <div>
          <p className="font-body text-body font-medium text-foreground">Voice register</p>
          <p className="mt-stack text-small text-muted-foreground">
            {v.voiceRegister.join(" · ")}
          </p>
        </div>

        {v.productPositionings.length > 0 ? (
          <div>
            <p className="font-body text-body font-medium text-foreground">Product positioning drafts</p>
            <ul className="mt-stack space-y-2 text-body text-muted-foreground">
              {v.productPositionings.map((p) => (
                <li key={p.slug}>
                  <span className="font-medium text-foreground">{p.slug}</span> — {p.oneliner}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <p className="font-body text-body font-medium text-foreground">FAQ drafts</p>
          <ul className="mt-stack space-y-3 text-body text-muted-foreground">
            {v.faqDrafts.map((f, i) => (
              <li key={i}>
                <span className="block font-medium text-foreground">{f.question}</span>
                <span className="block">{f.answer}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05]"
          >
            Looks good → Continue
          </button>
        </div>
      </form>

      <form action={regenerateAction}>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-button border border-border bg-transparent px-[var(--px-button)] py-[var(--py-button)] font-body text-foreground transition-colors duration-DEFAULT ease-themed hover:bg-muted"
        >
          Regenerate
        </button>
      </form>
    </div>
  );
}
