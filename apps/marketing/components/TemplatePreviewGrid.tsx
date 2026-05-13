/**
 * Three template-family preview cards. Static, hand-rendered storefront
 * snippets per theme so the layout is uniform across all three cards (the
 * previous "live BrandHero inside browser frame at fractional scale"
 * version had inconsistent heights and clipped content awkwardly).
 *
 * Each card has identical dimensions: browser-chrome strip on top, fixed
 * aspect content area with a themed sample hero. Cards align cleanly side-
 * by-side at lg+ and stack on smaller breakpoints.
 */

type ThemeKey = "clinical" | "wellness" | "community";

type Sample = {
  key: ThemeKey;
  name: string;
  url: string;
  eyebrow: string;
  description: string;
  // Inline brand colors for the rendered sample (don't depend on theme tokens
  // so the page-level theme override doesn't bleed in).
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  border: string;
  fontFamily: string;
};

const SAMPLES: Sample[] = [
  {
    key: "clinical",
    name: "Clinical Performance",
    url: "apexrx.gtmstack.shop",
    eyebrow: "Hormone · Peptide · Longevity",
    description: "Dark, sharp, electric. For provider-supervised clinical brands.",
    bg: "#0a0c10",
    fg: "#edf0f6",
    accent: "#00e0ff",
    muted: "#141820",
    border: "#202632",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    key: "wellness",
    name: "Wellness",
    url: "primewellness.gtmstack.shop",
    eyebrow: "Recovery · Energy · Performance",
    description: "Warm, editorial, premium serif. For clinician-formulated wellness brands.",
    bg: "#faf6ef",
    fg: "#2c2a26",
    accent: "#5e7a5a",
    muted: "#f0e9de",
    border: "#e0d7c8",
    fontFamily: "'Fraunces', Georgia, serif",
  },
  {
    key: "community",
    name: "Community",
    url: "ironreserve.gtmstack.shop",
    eyebrow: "Built · Tested · Earned",
    description: "Bold, condensed, athlete-direct. For training communities + gym brands.",
    bg: "#fffcf5",
    fg: "#121216",
    accent: "#f23c1e",
    muted: "#f6f0e4",
    border: "#e8e0d0",
    fontFamily: "'Anton', 'Bebas Neue', Impact, sans-serif",
  },
];

export function TemplatePreviewGrid() {
  return (
    <section id="templates" className="w-full bg-white text-black">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <p className="font-body text-small font-semibold uppercase tracking-[0.18em] text-black/50">
          One codebase, three brand languages
        </p>
        <h2 className="mt-stack max-w-3xl font-body text-[clamp(2rem,4vw+1rem,3.5rem)] font-bold leading-tight tracking-tight text-black">
          Templates that feel like different companies.
        </h2>
        <p className="mt-stack max-w-2xl text-h3 text-black/70">
          Same conversion architecture, three theme families. Pick one in setup; switch anytime.
          Tokens drive every color, font, radius, and motion.
        </p>

        <ul role="list" className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLES.map((s) => (
            <li key={s.key} className="flex h-full flex-col">
              <ThemePreviewCard sample={s} />

              <div className="mt-5 flex flex-col gap-1">
                <p className="font-mono text-small uppercase tracking-[0.16em] text-black/50">
                  {s.eyebrow}
                </p>
                <h3 className="font-body text-h3 font-bold tracking-tight text-black">
                  {s.name}
                </h3>
                <p className="text-body text-black/70">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="/preview/prime-wellness"
            className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-6 py-3 font-body font-semibold text-black transition-colors hover:bg-black/[0.04]"
          >
            Walk a real storefront
          </a>
          <span className="font-mono text-small uppercase tracking-[0.16em] text-black/40">
            Live demo · Prime Wellness
          </span>
        </div>
      </div>
    </section>
  );
}

function ThemePreviewCard({ sample }: { sample: Sample }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-black/10 bg-black/[0.04] px-3 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
        </div>
        <div className="mx-auto max-w-[200px] truncate rounded-full bg-white px-3 py-1 text-center font-mono text-[10px] tracking-tight text-black/50">
          {sample.url}
        </div>
        <div className="h-2.5 w-2.5" />
      </div>

      {/* Themed sample */}
      <div
        className="aspect-[4/3]"
        style={{
          backgroundColor: sample.bg,
          color: sample.fg,
          fontFamily: sample.fontFamily,
        }}
      >
        <div className="flex h-full flex-col p-5">
          {/* Nav strip */}
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ opacity: 0.7 }}
            >
              {sample.name === "Wellness"
                ? "Prime Wellness"
                : sample.name === "Clinical Performance"
                  ? "ApexRX"
                  : "Iron Reserve"}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-[9px] font-semibold"
              style={{
                backgroundColor: sample.accent,
                color: sample.bg,
              }}
            >
              Start
            </span>
          </div>

          {/* Eyebrow + headline */}
          <div className="mt-auto">
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.18em]"
              style={{ opacity: 0.55 }}
            >
              {sample.eyebrow}
            </p>
            <p
              className="mt-1 text-[clamp(1rem,2.4vw,1.5rem)] font-bold leading-tight tracking-tight"
              style={{ letterSpacing: sample.key === "wellness" ? "-0.02em" : undefined }}
            >
              {sample.key === "clinical"
                ? "Clinical-grade protocols."
                : sample.key === "wellness"
                  ? "Built for real lives."
                  : "Fuel the work."}
            </p>
            <div className="mt-3 flex gap-2">
              <span
                className="rounded-full px-3 py-1 text-[9px] font-semibold"
                style={{ backgroundColor: sample.accent, color: sample.bg }}
              >
                Subscribe
              </span>
              <span
                className="rounded-full border px-3 py-1 text-[9px] font-semibold"
                style={{ borderColor: sample.border, opacity: 0.8 }}
              >
                Programs
              </span>
            </div>
          </div>

          {/* Product strip */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg p-2"
                style={{ backgroundColor: sample.muted, border: `1px solid ${sample.border}` }}
              >
                <div
                  className="aspect-square rounded"
                  style={{ backgroundColor: sample.border, opacity: 0.5 }}
                />
                <div
                  className="mt-1.5 h-1.5 w-3/4 rounded"
                  style={{ backgroundColor: sample.fg, opacity: 0.4 }}
                />
                <div
                  className="mt-1 h-1.5 w-1/2 rounded"
                  style={{ backgroundColor: sample.accent, opacity: 0.8 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
