/**
 * Demo brand fixtures for Storybook and dev. NOT a runtime data source.
 *
 * Each fixture matches one of the three theme families so stories can render
 * <SiteHeader>, <BrandHero>, <FeatureGrid>, <SiteFooter> with brand-appropriate
 * content per theme. The wellness fixture is Prime Wellness — the canonical
 * demo brand referenced throughout product and marketing per docs/CLAUDE.md.
 */

import type {
  FooterLinkGroup,
  NavLink,
  Product,
} from "../types";

export type DemoBrand = {
  themeName: "clinical" | "wellness" | "community";
  name: string;
  tagline: string;
  /** Headline that fronts the hero. */
  headline: string;
  /** Sub-headline / subhead. */
  subhead: string;
  /** Top-line eyebrow over the hero. */
  eyebrow: string;
  /** Product grid eyebrow + headline + subhead. */
  productSection: {
    eyebrow: string;
    headline: string;
    subhead: string;
  };
  nav: NavLink[];
  navCta: NavLink;
  primaryCta: NavLink;
  secondaryCta: NavLink;
  products: Product[];
  footerGroups: FooterLinkGroup[];
  footerLegal: NavLink[];
  footerDisclaimer: string;
};

const sharedDisclaimer =
  "Statements on this site have not been evaluated by the FDA. Products are not intended to diagnose, treat, cure, or prevent any disease. " +
  "Brand operator owns marketing, education, and customer relationships. Licensed pharmacy and provider partners handle regulated review, dispensing, and fulfillment where required.";

export const primeWellness: DemoBrand = {
  themeName: "wellness",
  name: "Prime Wellness",
  tagline: "Clinician-designed wellness programs delivered monthly.",
  eyebrow: "Recovery · Energy · Daily Performance",
  headline: "Recovery, energy, and daily performance — in one program.",
  subhead:
    "A clinician-designed wellness stack delivered monthly. Subscribe once, track results, adjust with your coach.",
  productSection: {
    eyebrow: "The Programs",
    headline: "Built for the way real lives recover.",
    subhead:
      "Three stacks. One subscription. Each formulation reviewed by our clinical advisors and shipped to your door.",
  },
  nav: [
    { label: "Programs", href: "#programs" },
    { label: "How it works", href: "#how" },
    { label: "Science", href: "#science" },
    { label: "Stories", href: "#stories" },
  ],
  navCta: { label: "Start Your Program", href: "#start" },
  primaryCta: { label: "Start Your Program", href: "#start" },
  secondaryCta: { label: "How it works", href: "#how" },
  products: [
    {
      id: "daily-greens",
      name: "Daily Greens",
      eyebrow: "Daily foundation",
      description:
        "Adaptogenic greens blend with B-complex, magnesium glycinate, and a clinical-dose ashwagandha.",
      price: {
        oneTime: { amount: 4900, currency: "USD" },
        subscription: { monthly: { amount: 3900, currency: "USD" }, savingsPct: 20 },
      },
      ctaHref: "#daily-greens",
    },
    {
      id: "sleep-stack",
      name: "Sleep Stack",
      eyebrow: "Recovery evenings",
      description:
        "Glycine, l-theanine, and magnesium threonate for nights that actually restore. Coach check-ins included.",
      price: { subscription: { monthly: { amount: 7900, currency: "USD" } } },
      ctaHref: "#sleep-stack",
    },
    {
      id: "recovery-kit",
      name: "Recovery Kit",
      eyebrow: "Training-day support",
      description:
        "Collagen peptides, electrolyte mineral matrix, and a creatine + tart cherry recovery blend.",
      price: {
        oneTime: { amount: 12900, currency: "USD" },
        subscription: { monthly: { amount: 9900, currency: "USD" } },
      },
      ctaHref: "#recovery-kit",
    },
  ],
  footerGroups: [
    {
      heading: "Programs",
      links: [
        { label: "Daily Greens", href: "#daily-greens" },
        { label: "Sleep Stack", href: "#sleep-stack" },
        { label: "Recovery Kit", href: "#recovery-kit" },
        { label: "Performance Stack", href: "#performance" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "Our Clinical Team", href: "#team" },
        { label: "Science", href: "#science" },
        { label: "Stories", href: "#stories" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "Account", href: "#account" },
        { label: "Shipping & returns", href: "#shipping" },
        { label: "FAQ", href: "#faq" },
        { label: "Coach support", href: "#coach" },
      ],
    },
    {
      heading: "Newsletter",
      links: [{ label: "Subscribe", href: "#newsletter" }],
    },
  ],
  footerLegal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Accessibility", href: "#a11y" },
  ],
  footerDisclaimer: sharedDisclaimer,
};

export const apexRx: DemoBrand = {
  themeName: "clinical",
  name: "ApexRX",
  tagline: "Clinical-grade performance, hormone, and longevity protocols.",
  eyebrow: "Performance · Hormone · Longevity",
  headline: "Clinical-grade protocols, delivered to your door.",
  subhead:
    "Provider-supervised hormone, recovery, and longevity programs. Every protocol reviewed by a licensed physician.",
  productSection: {
    eyebrow: "The Protocols",
    headline: "Built for measurable outcomes.",
    subhead:
      "Every program starts with a labs panel and a provider review. Adjust monthly based on what your data shows.",
  },
  nav: [
    { label: "Protocols", href: "#protocols" },
    { label: "Provider Network", href: "#providers" },
    { label: "Outcomes", href: "#outcomes" },
    { label: "Members", href: "#members" },
  ],
  navCta: { label: "Get Started", href: "#start" },
  primaryCta: { label: "Get Started", href: "#start" },
  secondaryCta: { label: "View Protocols", href: "#protocols" },
  products: [
    {
      id: "hrt-baseline",
      name: "Hormone Baseline",
      eyebrow: "Provider-supervised",
      description:
        "At-home labs + telehealth provider review + monthly fulfillment of an individualized hormone protocol.",
      price: { subscription: { monthly: { amount: 24900, currency: "USD" } } },
      ctaHref: "#hrt",
    },
    {
      id: "peptide-stack",
      name: "Peptide Performance",
      eyebrow: "Recovery + performance",
      description:
        "BPC-157, TB-500, and supporting peptides fulfilled by 503A compounding pharmacy partners.",
      price: { subscription: { monthly: { amount: 39900, currency: "USD" } } },
      ctaHref: "#peptides",
    },
    {
      id: "longevity",
      name: "Longevity Panel",
      eyebrow: "Quarterly diagnostics",
      description:
        "Quarterly comprehensive labs (40+ biomarkers) and a 30-min provider readout.",
      price: { subscription: { monthly: { amount: 14900, currency: "USD" } } },
      ctaHref: "#longevity",
    },
  ],
  footerGroups: [
    {
      heading: "Protocols",
      links: [
        { label: "Hormone Baseline", href: "#hrt" },
        { label: "Peptide Performance", href: "#peptides" },
        { label: "Longevity Panel", href: "#longevity" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "Provider Network", href: "#providers" },
        { label: "Outcomes", href: "#outcomes" },
        { label: "Press", href: "#press" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "Member Portal", href: "#portal" },
        { label: "FAQ", href: "#faq" },
        { label: "Contact", href: "#contact" },
      ],
    },
  ],
  footerLegal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Telehealth Notice", href: "#telehealth" },
  ],
  footerDisclaimer:
    "ApexRX is a brand operator. Telehealth consultations are provided by independent licensed physicians. Compounded medications are dispensed by licensed 503A pharmacy partners. ApexRX does not prescribe, dispense, or compound.",
};

export const ironReserve: DemoBrand = {
  themeName: "community",
  name: "Iron Reserve",
  tagline: "Daily fuel for athletes who train like it matters.",
  eyebrow: "Built · Tested · Earned",
  headline: "Fuel the work. Earn the result.",
  subhead:
    "Daily supplements made for athletes who train like it matters. No fluff. Tested batch-by-batch.",
  productSection: {
    eyebrow: "The Stack",
    headline: "What goes in the bag every morning.",
    subhead:
      "Designed by competing athletes. Third-party tested. Subscribe and never miss a training block.",
  },
  nav: [
    { label: "The Stack", href: "#stack" },
    { label: "Athletes", href: "#athletes" },
    { label: "Training", href: "#training" },
    { label: "Crew", href: "#crew" },
  ],
  navCta: { label: "Shop The Stack", href: "#shop" },
  primaryCta: { label: "Shop The Stack", href: "#shop" },
  secondaryCta: { label: "Join The Crew", href: "#crew" },
  products: [
    {
      id: "preworkout",
      name: "Pre-Lift",
      eyebrow: "Train",
      description: "Citrulline, beta-alanine, caffeine. Clean panel, transparent dosing.",
      price: {
        oneTime: { amount: 4900, currency: "USD" },
        subscription: { monthly: { amount: 3900, currency: "USD" } },
      },
      ctaHref: "#pre",
    },
    {
      id: "whey",
      name: "Whey Foundation",
      eyebrow: "Build",
      description: "Grass-fed isolate, 27g per scoop, no artificial sweeteners.",
      price: { subscription: { monthly: { amount: 5900, currency: "USD" } } },
      ctaHref: "#whey",
    },
    {
      id: "recovery",
      name: "Post Recovery",
      eyebrow: "Repair",
      description: "Creatine + electrolytes + tart cherry. The bottle on every gym bag.",
      price: { subscription: { monthly: { amount: 4900, currency: "USD" } } },
      ctaHref: "#post",
    },
  ],
  footerGroups: [
    {
      heading: "Stack",
      links: [
        { label: "Pre-Lift", href: "#pre" },
        { label: "Whey Foundation", href: "#whey" },
        { label: "Post Recovery", href: "#post" },
      ],
    },
    {
      heading: "Crew",
      links: [
        { label: "Athletes", href: "#athletes" },
        { label: "Training", href: "#training" },
        { label: "The Reserve Pod", href: "#pod" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "Account", href: "#account" },
        { label: "Shipping", href: "#shipping" },
        { label: "Contact", href: "#contact" },
      ],
    },
  ],
  footerLegal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
  ],
  footerDisclaimer: sharedDisclaimer,
};

export const demoBrands = {
  clinical: apexRx,
  wellness: primeWellness,
  community: ironReserve,
} as const;
