import { BrandHero } from "@gtmstack/ui";

/**
 * Sprint 1 acceptance criterion #6 — `<BrandHero>` wired in with Prime Wellness as the demo
 * brand. The wellness theme is applied at the layout level, so this page just composes.
 */
export default function MarketingHome() {
  return (
    <main>
      <BrandHero
        brand={{ name: "Prime Wellness" }}
        eyebrow="Recovery · Energy · Daily Performance"
        headline="Recovery, energy, and daily performance — in one program."
        subhead="A clinician-designed wellness stack delivered monthly. Subscribe once, track results, adjust with your coach."
        primaryCta={{ label: "Start Your Program", href: "#start" }}
        secondaryCta={{ label: "How it works", href: "#how" }}
      />
    </main>
  );
}
