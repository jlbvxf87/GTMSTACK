"use client";

import type { BrandIdentity } from "@gtmstack/ai";

import { ProductPackshot, type ProductPackshotProps } from "./ProductPackshot";

/**
 * Phone-frame storefront preview for the landing's brand voice demo.
 *
 * Takes a `BrandIdentity` (the same shape onboarding writes to
 * storefronts.brand_voice) and renders a believable mini storefront inside
 * an iPhone bezel: status bar, brand header, hero (eyebrow + headline +
 * subhead + CTA + voice register chips), three product cards from the
 * positionings, two FAQ items, mini footer.
 *
 * Empty + loading + result states all sit inside the same bezel so the
 * preview never reflows the surrounding layout.
 */

export type BrandVoicePhonePreviewProps = {
  brandName?: string;
  result: BrandIdentity | null;
  loading: boolean;
  /** Drives the real product set shown in the storefront preview. */
  theme: "wellness" | "clinical" | "community";
};

// ---------------------------------------------------------------------------
// Real-product catalog by theme. These are the same product names + price
// points the demo brands (Prime Wellness, ApexRX, Iron Reserve) carry, so
// the preview reads as a customer's actual storefront — same products, same
// pricing, same voice — not synthetic placeholders.
// ---------------------------------------------------------------------------

type PreviewProduct = {
  name: string;
  subtitle: string;
  priceCents: number;
  cadence: "month" | "one-time";
  /**
   * If `photo` is set we render a real cropped product photograph; otherwise
   * we fall back to the SVG packshot using `vessel` + `tone`. The wellness
   * theme uses real photos cropped from the operator's hero composition; the
   * other two themes still use SVG until we drop in clinical/community
   * product photography.
   */
  photo?: string;
  vessel: ProductPackshotProps["vessel"];
  tone: ProductPackshotProps["tone"];
  cardTone: { bg: string; text: string; mutedText: string };
};

const PRODUCTS_BY_THEME: Record<
  BrandVoicePhonePreviewProps["theme"],
  PreviewProduct[]
> = {
  wellness: [
    {
      name: "Performance Stack",
      subtitle: "Strength · focus · endurance",
      priceCents: 7900,
      cadence: "month",
      photo: "/brand/preview-product-1.png",
      vessel: "tub",
      tone: "ink",
      cardTone: cardTone("cream"),
    },
    {
      name: "Sleep Stack",
      subtitle: "Rest · recover · recharge",
      priceCents: 6900,
      cadence: "month",
      photo: "/brand/preview-product-2.png",
      vessel: "bottle",
      tone: "ink",
      cardTone: cardTone("ink"),
    },
    {
      name: "Recovery Kit",
      subtitle: "Replenish · restore · perform",
      priceCents: 12900,
      cadence: "month",
      photo: "/brand/preview-product-3.png",
      vessel: "bottle",
      tone: "ink",
      cardTone: cardTone("cream"),
    },
    {
      name: "Daily Greens",
      subtitle: "Energy · immunity · gut",
      priceCents: 4900,
      cadence: "month",
      photo: "/brand/preview-product-4.png",
      vessel: "tub",
      tone: "cream",
      cardTone: cardTone("ink"),
    },
  ],
  clinical: [
    {
      name: "Hormone Baseline",
      subtitle: "Labs · monthly review",
      priceCents: 29900,
      cadence: "month",
      vessel: "sachet",
      tone: "ink",
      cardTone: cardTone("ink"),
    },
    {
      name: "Peptide Performance",
      subtitle: "Provider-supervised",
      priceCents: 39900,
      cadence: "month",
      vessel: "bottle",
      tone: "amber",
      cardTone: cardTone("cream"),
    },
    {
      name: "Daily Adaptogens",
      subtitle: "Cortisol · stress · focus",
      priceCents: 4900,
      cadence: "month",
      vessel: "bottle",
      tone: "ink",
      cardTone: cardTone("ink"),
    },
  ],
  community: [
    {
      name: "Pre-Lift",
      subtitle: "Honest panel · no fluff",
      priceCents: 4500,
      cadence: "month",
      vessel: "tub",
      tone: "ink",
      cardTone: cardTone("ink"),
    },
    {
      name: "Whey Foundation",
      subtitle: "Isolate · 25g protein",
      priceCents: 5500,
      cadence: "month",
      vessel: "tub",
      tone: "cream",
      cardTone: cardTone("cream"),
    },
    {
      name: "Recovery",
      subtitle: "Sleep · joints · soreness",
      priceCents: 6500,
      cadence: "month",
      vessel: "sachet",
      tone: "ink",
      cardTone: cardTone("ink"),
    },
  ],
};

function cardTone(t: "ink" | "cream"): PreviewProduct["cardTone"] {
  if (t === "ink") {
    return {
      bg: "bg-[#0E0E10]",
      text: "text-white",
      mutedText: "text-white/65",
    };
  }
  return {
    bg: "bg-[#F3EFE6]",
    text: "text-[#0E0E10]",
    mutedText: "text-black/60",
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BrandVoicePhonePreview({
  brandName = "Your Brand",
  result,
  loading,
  theme,
}: BrandVoicePhonePreviewProps) {
  return (
    <div className="flex justify-center">
      <div
        className="relative w-full max-w-[420px] sm:max-w-[440px]"
        style={{ aspectRatio: "9 / 19.5" }}
      >
        {/* Phone bezel — gradient gives a subtle metallic edge instead of
            flat black, and a faint inner ring suggests the inset where the
            display sits below the chassis. */}
        <div
          className="absolute inset-0 rounded-[2.75rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45),0_15px_30px_-12px_rgba(0,0,0,0.3)]"
          style={{
            background:
              "linear-gradient(135deg, #1a1a1c 0%, #060607 50%, #1a1a1c 100%)",
          }}
        >
          {/* Glass highlight along the top-left rim */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2.75rem]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,0) 75%, rgba(255,255,255,0.06) 100%)",
            }}
          />

          {/* Physical side buttons */}
          {/* Mute switch (top-left) */}
          <span
            aria-hidden
            className="absolute left-[-3px] top-[112px] h-[28px] w-[3px] rounded-l-sm bg-[#0a0a0b]"
          />
          {/* Volume up */}
          <span
            aria-hidden
            className="absolute left-[-3px] top-[160px] h-[52px] w-[3px] rounded-l-sm bg-[#0a0a0b]"
          />
          {/* Volume down */}
          <span
            aria-hidden
            className="absolute left-[-3px] top-[228px] h-[52px] w-[3px] rounded-l-sm bg-[#0a0a0b]"
          />
          {/* Power button (right) */}
          <span
            aria-hidden
            className="absolute right-[-3px] top-[176px] h-[76px] w-[3px] rounded-r-sm bg-[#0a0a0b]"
          />

          {/* Screen — slightly larger inset (8px) so the bezel reads as
              thinner like a recent iPhone, with an inner ring for depth. */}
          <div className="absolute inset-[8px] overflow-hidden rounded-[2.4rem] bg-white ring-1 ring-black/40">
            {/* Dynamic Island — pill with a tiny lens dot, top-center */}
            <div className="pointer-events-none absolute top-[8px] left-1/2 z-20 flex h-[28px] w-[104px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-3">
              <span
                aria-hidden
                className="block h-[7px] w-[7px] rounded-full bg-[#0a0a0b] ring-1 ring-[#1c1c1e]"
              />
            </div>

            <div className="relative z-10 flex items-center justify-between px-5 pt-[15px] text-[10px] font-semibold text-black">
              <span>9:41</span>
              {/* Right-side status icons — drawn rather than emoji for
                  cross-platform consistency */}
              <span className="flex items-center gap-1.5">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </span>
            </div>

            <ScreenContent
              brandName={brandName}
              result={result}
              loading={loading}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenContent({
  brandName,
  result,
  loading,
  theme,
}: {
  brandName: string;
  result: BrandIdentity | null;
  loading: boolean;
  theme: BrandVoicePhonePreviewProps["theme"];
}) {
  if (loading) {
    return (
      <div className="flex h-[calc(100%-2rem)] flex-col gap-3 px-5 pt-10">
        <Skeleton w="60%" h="0.6rem" />
        <Skeleton w="92%" h="1.5rem" />
        <Skeleton w="88%" h="1.5rem" />
        <Skeleton w="70%" h="0.7rem" />
        <Skeleton w="40%" h="2rem" />
        <div className="mt-3 grid grid-cols-1 gap-2">
          <Skeleton w="100%" h="3rem" />
          <Skeleton w="100%" h="3rem" />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-[calc(100%-2rem)] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">
          Your storefront will render here
        </p>
        <p className="mt-2 text-[12px] leading-snug text-black/50">
          Describe your brand on the left and hit Generate. The hero, voice,
          and FAQ on a real customer page — built in seconds.
        </p>
      </div>
    );
  }

  const products = PRODUCTS_BY_THEME[theme];

  return (
    <div className="scrollbar-hide absolute inset-x-0 top-9 bottom-0 flex flex-col overflow-y-auto">
      {/* Brand header */}
      <header className="flex flex-none items-center justify-between border-b border-black/[0.06] px-4 py-2">
        <p className="font-body text-[10px] font-bold tracking-tight text-black">
          {brandName.toUpperCase()}
        </p>
        <span aria-hidden className="text-[12px] text-black/60">
          ☰
        </span>
      </header>

      {/* Hero photo banner — real lifestyle shot from the brand */}
      <div className="relative flex-none">
        <img
          src="/brand/preview-banner.png"
          alt=""
          aria-hidden
          className="block h-[112px] w-full object-cover"
        />
        {/* Gradient veil for legibility */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-2">
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/80">
            {result.eyebrow || "New from your brand"}
          </p>
        </div>
      </div>

      {/* Hero copy */}
      <section className="flex-none px-4 pt-3 pb-3">
        <h1 className="font-body text-[17px] font-bold leading-[1.05] tracking-tight text-black">
          {result.headline}
        </h1>
        <p className="mt-1.5 line-clamp-2 text-[10px] leading-snug text-black/60">
          {result.subhead}
        </p>
        <button
          type="button"
          className="mt-2.5 inline-flex w-full items-center justify-center rounded-full bg-black px-3 py-2 text-[11px] font-semibold text-white"
        >
          Start your program
        </button>

        {/* Voice register chips */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {result.voiceRegister.slice(0, 3).map((v) => (
            <span
              key={v}
              className="rounded-full border border-black/15 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-black/60"
            >
              {v}
            </span>
          ))}
        </div>
      </section>

      {/* Tagline strip */}
      {result.tagline ? (
        <section className="flex-none border-y border-black/10 bg-black/[0.03] px-4 py-1.5">
          <p className="line-clamp-1 font-body text-[10px] italic leading-snug text-black/70">
            "{result.tagline}"
          </p>
        </section>
      ) : null}

      {/* Real products */}
      <section className="flex-none px-4 py-3">
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40">
          Programs
        </p>
        <ul role="list" className="mt-1.5 flex flex-col gap-1.5">
          {products.map((p) => {
            const isInk = p.cardTone.bg.includes("0E0E10");
            return (
              <li
                key={p.name}
                className={`flex items-center gap-2.5 rounded-xl ${p.cardTone.bg} ${p.cardTone.text} px-2 py-1.5`}
              >
                {p.photo ? (
                  <span
                    aria-hidden
                    className={`flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-lg ${
                      isInk ? "bg-white/[0.04]" : "bg-white"
                    }`}
                  >
                    <img
                      src={p.photo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </span>
                ) : (
                  <span aria-hidden className="flex h-10 w-8 flex-none items-end justify-center">
                    <ProductPackshot
                      productName={p.name}
                      vessel={p.vessel}
                      tone={p.tone}
                      size={32}
                    />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold">{p.name}</p>
                  <p className={`mt-0 truncate text-[9px] ${p.cardTone.mutedText}`}>
                    {p.subtitle}
                  </p>
                </div>
                <div className="flex flex-none flex-col items-end">
                  <p className="text-[11px] font-bold">${(p.priceCents / 100).toFixed(0)}</p>
                  <p className={`text-[8px] ${p.cardTone.mutedText}`}>
                    /{p.cadence === "month" ? "mo" : "once"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* FAQ */}
      {result.faqDrafts.length > 0 ? (
        <section className="flex-none border-t border-black/10 px-4 py-3">
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40">
            FAQ
          </p>
          <div className="mt-1.5">
            <p className="text-[10px] font-semibold text-black">
              {result.faqDrafts[0]!.question}
            </p>
            <p className="mt-1 line-clamp-2 text-[9px] leading-snug text-black/60">
              {result.faqDrafts[0]!.answer}
            </p>
          </div>
        </section>
      ) : null}

      {/* Footer — pushed to the bottom of the screen so empty space never
          shows below it. mt-auto on flex column does the work. */}
      <footer className="mt-auto flex-none bg-black px-4 py-2.5 text-white">
        <p className="font-body text-[9px] font-bold tracking-tight">
          {brandName.toUpperCase()}
        </p>
        <p className="mt-0.5 text-[8px] text-white/50">
          Powered by GTMStack · Secure checkout
        </p>
      </footer>
    </div>
  );
}

function Skeleton({ w, h }: { w: string; h: string }) {
  return (
    <div
      className="rounded bg-black/[0.07]"
      style={{ width: w, height: h }}
    />
  );
}

// ---------------------------------------------------------------------------
// Status-bar icons. Drawn rather than emoji so they render consistently
// across platforms (and stay monochrome to match the bezel aesthetic).
// ---------------------------------------------------------------------------

function SignalIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden>
      <rect x="0" y="6" width="2" height="4" rx="0.5" fill="currentColor" />
      <rect x="3.5" y="4" width="2" height="6" rx="0.5" fill="currentColor" />
      <rect x="7" y="2" width="2" height="8" rx="0.5" fill="currentColor" />
      <rect x="10.5" y="0" width="2" height="10" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" aria-hidden>
      <path
        d="M6.5 0C9.5 0 12 1 13 2.2L11.5 4C11 3.4 9 2.5 6.5 2.5S2 3.4 1.5 4L0 2.2C1 1 3.5 0 6.5 0Z"
        fill="currentColor"
      />
      <path
        d="M6.5 3.5C8.5 3.5 10 4.2 10.7 5L9.3 6.5C9 6 8 5.5 6.5 5.5S4 6 3.7 6.5L2.3 5C3 4.2 4.5 3.5 6.5 3.5Z"
        fill="currentColor"
      />
      <circle cx="6.5" cy="8.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="24" height="11" viewBox="0 0 24 11" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="20"
        height="10"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
      />
      <rect x="2" y="2" width="17" height="7" rx="1.25" fill="currentColor" />
      <rect x="21" y="3.5" width="2" height="4" rx="1" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}
