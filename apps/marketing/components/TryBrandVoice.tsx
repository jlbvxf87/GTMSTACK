"use client";

import { useState } from "react";
import type { BrandIdentity } from "@gtmstack/ai";

import { BrandVoicePhonePreview } from "./BrandVoicePhonePreview";

/**
 * Inline "try the AI brand voice" widget. Lives on the landing page so
 * visitors can taste the marquee feature without signing up. Submits to the
 * public /api/landing-demo endpoint, which returns a mock identity (no real
 * Claude billed for landing traffic).
 */

const PRESETS: Array<{ label: string; theme: "wellness" | "clinical" | "community"; description: string }> = [
  {
    label: "Premium wellness",
    theme: "wellness",
    description:
      "Clinician-formulated wellness stacks for ambitious creators in their 30s and 40s. Sleep, recovery, daily performance. Warm, confident, evidence-led, never preachy.",
  },
  {
    label: "Clinical performance",
    theme: "clinical",
    description:
      "Provider-supervised hormone and peptide protocols for high performers who want measurable outcomes. Labs first, data-driven, no fluff.",
  },
  {
    label: "Athlete community",
    theme: "community",
    description:
      "Honest dosing supplements for athletes who train like it matters. Powerlifting, strength, crossfit. Direct, transparent panels, earned not promised.",
  },
];

export function TryBrandVoice({
  operatorAppUrl,
}: {
  operatorAppUrl: string;
}) {
  const [theme, setTheme] = useState<"wellness" | "clinical" | "community">("wellness");
  const [description, setDescription] = useState<string>(PRESETS[0]!.description);
  const [result, setResult] = useState<BrandIdentity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/landing-demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          description,
          theme,
          brandName: "Your Brand",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as BrandIdentity;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(p: (typeof PRESETS)[number]) {
    setTheme(p.theme);
    setDescription(p.description);
    setResult(null);
  }

  return (
    <section id="try" className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <header className="mb-12 max-w-3xl">
          <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
            Try it now
          </p>
          <h2 className="font-display text-h1 text-foreground">
            Type your brand. See your brand.
          </h2>
          <p className="mt-stack text-h3 text-muted-foreground">
            Describe what you're building in one paragraph. Claude generates a complete identity
            — tagline, hero copy, FAQ drafts, voice register. Same flow operators get in onboarding.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Input */}
          <form
            onSubmit={handleGenerate}
            className="flex flex-col gap-4 rounded-card border-card border-border bg-muted p-6 shadow-card"
          >
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={[
                    "rounded-full border px-3 py-1.5 font-mono text-small uppercase tracking-[0.14em] transition-colors duration-DEFAULT ease-themed",
                    theme === p.theme && description === p.description
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <label className="flex flex-col gap-2">
              <span className="font-body text-body font-medium text-foreground">
                Your brand, in your own words
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                maxLength={2000}
                className="w-full rounded-card border-card border-border bg-background px-4 py-3 font-body text-body text-foreground transition-colors duration-DEFAULT ease-themed focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
              />
            </label>

            <button
              type="submit"
              disabled={loading || description.trim().length < 20}
              className="inline-flex items-center justify-center self-start rounded-button bg-brand px-[var(--px-button)] py-[var(--py-button)] font-body font-[var(--weight-button)] text-brand-foreground transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-[1.05] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:brightness-100"
            >
              {loading ? "Generating…" : "Generate brand voice"}
            </button>

            <p className="text-small text-muted-foreground">
              Mock output on the landing — real Claude generates personalized output inside operator
              onboarding.
            </p>
          </form>

          {/* Result — phone-frame storefront preview */}
          <div className="relative flex flex-col gap-6">
            {error ? (
              <p className="text-small text-destructive">Error: {error}</p>
            ) : null}

            <BrandVoicePhonePreview
              brandName="Your Brand"
              result={result}
              loading={loading}
              theme={theme}
            />

            {result ? (
              <div className="flex justify-center">
                <a
                  href={`${operatorAppUrl}/signup`}
                  className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3.5 font-body font-semibold text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] transition-[transform,filter] duration-DEFAULT ease-themed hover:-translate-y-[1px] hover:brightness-110"
                >
                  Sign up to save this brand voice →
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
