import type { BrandIdentity, BrandVoiceInput } from "./schemas";

/**
 * Canned BrandIdentity per theme. Returned when `ANTHROPIC_API_KEY` is unset
 * so the brand-voice UX is fully testable without paying for inference. Each
 * theme uses tone that matches what real Claude would produce.
 */
export function mockBrandIdentity(input: BrandVoiceInput): BrandIdentity {
  const base = MOCK_BY_THEME[input.theme];
  return {
    ...base,
    productPositionings: input.productSlugs.length
      ? input.productSlugs.map((slug) => ({
          slug,
          oneliner:
            base.productPositionings.find((p) => p.slug === slug)?.oneliner ??
            defaultProductOneliner(slug, input.theme),
        }))
      : base.productPositionings,
  };
}

function defaultProductOneliner(slug: string, theme: BrandVoiceInput["theme"]): string {
  const pretty = slug
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
  if (theme === "clinical") return `${pretty} — protocol-grade, provider-supervised.`;
  if (theme === "community") return `${pretty}. Honest panel. Earned results.`;
  return `${pretty} — for the way real lives recover.`;
}

const MOCK_BY_THEME: Record<BrandVoiceInput["theme"], BrandIdentity> = {
  wellness: {
    tagline: "Clinician-designed wellness, built for the way you actually live.",
    eyebrow: "Recovery · Energy · Daily Performance",
    headline: "Built for the way real lives recover.",
    subhead:
      "A clinician-formulated wellness stack delivered monthly. Subscribe once, track results, adjust with your coach.",
    voiceRegister: ["warm", "confident", "evidence-led", "never preachy"],
    productPositionings: [
      { slug: "daily-greens", oneliner: "The foundation. Every morning, no exceptions." },
      { slug: "sleep-stack", oneliner: "For nights that actually restore." },
      { slug: "recovery-kit", oneliner: "Train hard. Recover harder." },
    ],
    faqDrafts: [
      {
        question: "Is this a subscription or a one-time purchase?",
        answer:
          "Both — subscription is the default because that's how programs deliver results. Switch between the two from your dashboard anytime.",
      },
      {
        question: "Who formulates the stacks?",
        answer:
          "A clinical advisory team led by a board-certified physician and a registered dietitian. Every formula goes through literature review, ingredient audit, and at least two rounds of dosage refinement before launch.",
      },
      {
        question: "Where are the products manufactured?",
        answer:
          "All products are produced in NSF-certified, FDA-registered facilities in the United States. Every batch is third-party tested for purity and label accuracy.",
      },
      {
        question: "Can I pause or cancel anytime?",
        answer:
          "Anytime, from your dashboard. Pause for up to three months, swap stacks, or cancel — no email or phone call required.",
      },
    ],
  },
  clinical: {
    tagline: "Clinical-grade protocols, supervised by licensed physicians.",
    eyebrow: "Performance · Hormone · Longevity",
    headline: "Numbers move when the protocol moves.",
    subhead:
      "Labs-first, provider-supervised protocols delivered monthly. Every prescription reviewed by an independent licensed physician.",
    voiceRegister: ["clinical", "precise", "data-led", "uncompromising"],
    productPositionings: [
      { slug: "hormone-baseline", oneliner: "Baseline. Reviewed. Adjusted. Monthly." },
      { slug: "peptide-performance", oneliner: "Recovery and performance on a protocol." },
      { slug: "longevity-panel", oneliner: "Quarterly diagnostics. Outcomes that move." },
    ],
    faqDrafts: [
      {
        question: "Who reviews my labs and prescribes the protocol?",
        answer:
          "An independent licensed physician in your state. We coordinate the visit and follow-ups; the provider holds the prescriptive relationship and authority.",
      },
      {
        question: "Where are compounded medications produced?",
        answer:
          "Licensed 503A compounding pharmacy partners licensed in your state. We disclose the partner pharmacy on your protocol page before fulfillment.",
      },
      {
        question: "What if I need to escalate something between visits?",
        answer:
          "Use the message thread in your member portal. Your provider responds inside two business hours on weekdays; urgent issues escalate to the clinical operations team immediately.",
      },
      {
        question: "Can I cancel mid-protocol?",
        answer:
          "Yes. Protocols are monthly with no minimum term. We follow the provider's tapering guidance for molecules that require it.",
      },
    ],
  },
  community: {
    tagline: "Daily fuel for athletes who train like it matters.",
    eyebrow: "Built · Tested · Earned",
    headline: "Fuel the work. Earn the result.",
    subhead:
      "Honest panels, transparent dosing, batch-by-batch testing. No proprietary blends. No marketing fluff.",
    voiceRegister: ["direct", "athlete-first", "unfiltered", "earned not promised"],
    productPositionings: [
      { slug: "pre-lift", oneliner: "Before the first set. Honest dose, no fluff." },
      { slug: "whey-foundation", oneliner: "Real protein. Real mixability. Real food." },
      { slug: "post-recovery", oneliner: "Refill what training emptied." },
    ],
    faqDrafts: [
      {
        question: "What's actually in each tub?",
        answer:
          "Exactly what's on the label. No proprietary blends, no underdosed actives. Full panel on every product page.",
      },
      {
        question: "Third-party tested?",
        answer:
          "Every batch. Certificates of analysis go up on the product page within five days of release.",
      },
      {
        question: "How do subscriptions work?",
        answer:
          "Monthly by default, 60-day cadence available. Pause, swap, cancel from the dashboard — no email gates.",
      },
      {
        question: "Where do you ship?",
        answer:
          "Across the United States. International is on the roadmap; we email subscribers when it goes live.",
      },
    ],
  },
};
