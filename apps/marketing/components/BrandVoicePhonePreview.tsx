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
      name: "Daily Greens",
      subtitle: "Energy · immunity · gut",
      priceCents: 3900,
      cadence: "month",
      vessel: "tub",
      tone: "cream",
      cardTone: cardTone("cream"),
    },
    {
      name: "Sleep Stack",
      subtitle: "Rest · recover · recharge",
      priceCents: 6900,
      cadence: "month",
      vessel: "bottle",
      tone: "ink",
      cardTone: cardTone("ink"),
    },
    {
      name: "Recovery Kit",
      subtitle: "Replenish · restore · perform",
      priceCents: 9900,
      cadence: "month",
      vessel: "bottle",
      tone: "amber",
      cardTone: cardTone("cream"),
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
        className="relative w-full max-w-[360px]"
        style={{ aspectRatio: "9 / 19.5" }}
      >
        {/* Phone bezel */}
        <div className="absolute inset-0 rounded-[2.75rem] bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45),0_15px_30px_-12px_rgba(0,0,0,0.3)]">
          <span
            aria-hidden
            className="absolute inset-y-10 left-[-2px] w-[2px] rounded-full bg-white/10"
          />
          <span
            aria-hidden
            className="absolute inset-y-10 right-[-2px] w-[2px] rounded-full bg-white/10"
          />

          {/* Screen */}
          <div className="absolute inset-[10px] overflow-hidden rounded-[2.25rem] bg-white">
            <div className="pointer-events-none absolute top-2 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

            <div className="flex items-center justify-between px-5 pt-[14px] text-[10px] font-semibold text-black">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <span aria-hidden>●●●</span>
                <span aria-hidden>📶</span>
                <span aria-hidden>🔋</span>
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
          {products.map((p) => (
            <li
              key={p.name}
              className={`flex items-center gap-2 rounded-xl ${p.cardTone.bg} ${p.cardTone.text} px-2.5 py-1.5`}
            >
              <span aria-hidden className="flex h-10 w-8 flex-none items-end justify-center">
                <ProductPackshot
                  productName={p.name}
                  vessel={p.vessel}
                  tone={p.tone}
                  size={32}
                />
              </span>
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
          ))}
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
