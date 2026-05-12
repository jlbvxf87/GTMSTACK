/**
 * Demo brand fixtures for Storybook and dev. NOT a runtime data source.
 *
 * Each fixture matches one of the three theme families so stories can render
 * the universal section library with brand-appropriate content per theme.
 * The wellness fixture is Prime Wellness — the canonical demo brand
 * referenced throughout product and marketing per docs/CLAUDE.md.
 *
 * One product per brand carries the full product-page content (gallery,
 * detail sections, ingredients, reviews) so Sprint 3 storefront pages have
 * something real to render in each theme:
 *   - wellness  → Sleep Stack
 *   - clinical  → Peptide Performance
 *   - community → Whey Foundation
 */

import type {
  FAQItem,
  FooterLinkGroup,
  NavLink,
  ProgramStep,
  Product,
  Testimonial,
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
  programSection: {
    eyebrow: string;
    headline: string;
    subhead: string;
    steps: ProgramStep[];
  };
  proofSection: {
    eyebrow: string;
    headline: string;
    featured: Testimonial;
    supporting: Testimonial[];
  };
  faqSection: {
    eyebrow: string;
    headline: string;
    subhead: string;
    items: FAQItem[];
  };
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
      slug: "daily-greens",
      name: "Daily Greens",
      eyebrow: "Daily foundation",
      description:
        "Adaptogenic greens blend with B-complex, magnesium glycinate, and a clinical-dose ashwagandha.",
      price: {
        oneTime: { amount: 4900, currency: "USD" },
        subscription: { monthly: { amount: 3900, currency: "USD" }, savingsPct: 20 },
      },
      ctaHref: "/products/daily-greens",
    },
    {
      id: "sleep-stack",
      slug: "sleep-stack",
      name: "Sleep Stack",
      eyebrow: "Recovery evenings",
      description:
        "Glycine, l-theanine, and magnesium threonate for nights that actually restore. Coach check-ins included.",
      price: {
        oneTime: { amount: 9900, currency: "USD" },
        subscription: { monthly: { amount: 7900, currency: "USD" }, savingsPct: 20 },
      },
      ctaHref: "/products/sleep-stack",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1556228724-4d6c0c66bba8?auto=format&fit=crop&w=1200&q=80",
          alt: "Sleep Stack bottle on a calm bedside table",
        },
        {
          url: "https://images.unsplash.com/photo-1611259859321-4dbc89b1c2d4?auto=format&fit=crop&w=600&q=80",
          alt: "Capsules in a soft beam of light",
        },
        {
          url: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=600&q=80",
          alt: "Linen bedding closeup",
        },
        {
          url: "https://images.unsplash.com/photo-1617886322168-72b886573c5f?auto=format&fit=crop&w=600&q=80",
          alt: "Member journaling in the evening",
        },
      ],
      longDescription:
        "A clinically-dosed evening stack designed to deepen recovery sleep — without next-day sluggishness. Built with magnesium L-threonate for cognitive recovery, glycine for sleep architecture, and l-theanine to calm sympathetic tone before bed.",
      detailSections: [
        {
          id: "how-it-works",
          title: "How it works",
          body: "Three actives work on three different mechanisms of evening recovery. Magnesium L-threonate crosses the blood–brain barrier and supports synaptic recovery. Glycine has been shown to improve subjective and objective sleep quality. L-theanine reduces sympathetic activation so you fall asleep without sedation. Take one serving 30 minutes before bed for two weeks; most members notice a difference inside week one.",
        },
        {
          id: "what-its-not",
          title: "What it's not",
          body: "Sleep Stack does not contain melatonin, prescription sedatives, or downstream sleep aids. It is not designed to override poor sleep habits or to mask a clinical sleep disorder. If symptoms persist longer than four weeks, escalate to a provider for evaluation.",
        },
        {
          id: "for-whom",
          title: "Who it's for",
          body: "Adults who fall asleep fine but wake at 3 a.m., athletes whose training is outpacing their recovery, and anyone whose smartwatch reports sleep efficiency under 85% on most nights.",
        },
      ],
      ingredients: [
        {
          id: "magtheonate",
          name: "Magnesium L-threonate",
          source: "Magtein®",
          dose: "2,000 mg",
          role: "Crosses the blood–brain barrier to support synaptic recovery and cognitive resilience.",
        },
        {
          id: "glycine",
          name: "Glycine",
          dose: "3 g",
          role: "Improves subjective and objective sleep quality; non-habit-forming.",
        },
        {
          id: "ltheanine",
          name: "L-Theanine",
          source: "Suntheanine®",
          dose: "200 mg",
          role: "Reduces evening sympathetic activation without sedation.",
        },
        {
          id: "apigenin",
          name: "Apigenin",
          dose: "50 mg",
          role: "Supports a calmer nervous system before bed.",
        },
      ],
      averageRating: 4.8,
      reviewCount: 234,
      reviews: [
        {
          id: "r1",
          rating: 5,
          headline: "Sleeping through the night for the first time in years",
          quote:
            "I've tried magnesium glycinate, melatonin, even prescription sleep aids. Sleep Stack is the first thing where I'm not awake at 3 a.m. doing math on tomorrow. Took maybe four nights to notice.",
          attribution: "Maya R.",
          attributionDetail: "Member since 2024 · Sleep Stack",
          verified: true,
        },
        {
          id: "r2",
          rating: 5,
          headline: "Wake up actually rested",
          quote:
            "My HRV is up about 12 points on weeks I take it consistently. No grogginess. The coach check-in helped me find the right dose timing.",
          attribution: "Daniel K.",
          attributionDetail: "Member since 2024",
          verified: true,
        },
        {
          id: "r3",
          rating: 4,
          quote:
            "Took about two weeks to feel any difference, but once it kicked in, the change was real. Wish it shipped faster, otherwise no complaints.",
          attribution: "Priya S.",
          attributionDetail: "Member since 2025",
          verified: true,
        },
      ],
      relatedSlugs: ["daily-greens", "recovery-kit"],
    },
    {
      id: "recovery-kit",
      slug: "recovery-kit",
      name: "Recovery Kit",
      eyebrow: "Training-day support",
      description:
        "Collagen peptides, electrolyte mineral matrix, and a creatine + tart cherry recovery blend.",
      price: {
        oneTime: { amount: 12900, currency: "USD" },
        subscription: { monthly: { amount: 9900, currency: "USD" } },
      },
      ctaHref: "/products/recovery-kit",
    },
  ],
  programSection: {
    eyebrow: "How it works",
    headline: "From baseline to better in four weeks.",
    subhead:
      "Same simple flow whether you start with one stack or three. Every step is reviewable in your dashboard.",
    steps: [
      {
        id: "1",
        label: "01",
        title: "Choose your stack",
        body: "Three programs designed for the way real lives actually recover. Subscribe and customize anytime.",
      },
      {
        id: "2",
        label: "02",
        title: "Onboard with a coach",
        body: "A 20-minute kickoff call sets a baseline, surfaces blockers, and picks the first month's targets.",
      },
      {
        id: "3",
        label: "03",
        title: "Receive your program",
        body: "Monthly shipment of clinician-formulated stacks. Pause, swap, or upgrade from the dashboard.",
      },
      {
        id: "4",
        label: "04",
        title: "Track and adjust",
        body: "Coach check-ins every 30 days. Adjust dosages, add support stacks, or cancel — your call.",
      },
    ],
  },
  proofSection: {
    eyebrow: "Stories from the program",
    headline: "Built around how members actually live.",
    featured: {
      id: "f1",
      quote:
        "I'd tried everything from boutique compounders to drugstore basics. Prime Wellness is the first program where I noticed the difference inside two weeks — and the coach check-ins kept me consistent.",
      attribution: "Maya R.",
      attributionDetail: "Member since 2024 · Sleep Stack + Recovery Kit",
      rating: 5,
    },
    supporting: [
      {
        id: "s1",
        quote: "The subscription model means I never run out — and the coach knows my history.",
        attribution: "Daniel K.",
        attributionDetail: "Daily Greens",
        rating: 5,
      },
      {
        id: "s2",
        quote:
          "Customer support escalates to a real clinician when I have a question. That alone is worth it.",
        attribution: "Priya S.",
        attributionDetail: "Recovery Kit",
        rating: 5,
      },
      {
        id: "s3",
        quote:
          "It feels like a real practice, not a supplement company. The packaging just happens to be beautiful too.",
        attribution: "Jordan T.",
        attributionDetail: "Sleep Stack",
        rating: 5,
      },
    ],
  },
  faqSection: {
    eyebrow: "Common questions",
    headline: "Everything new members ask in week one.",
    subhead:
      "Don't see your question? Coach support replies inside an hour during business hours.",
    items: [
      {
        id: "q1",
        question: "Is Prime Wellness a subscription or a one-time purchase?",
        answer:
          "Both. Subscription is the default because that's how programs deliver results, but every stack is also available as a one-time purchase. You can switch between the two from your dashboard at any time.",
      },
      {
        id: "q2",
        question: "Who formulates the stacks?",
        answer:
          "A clinical advisory team led by a board-certified physician and a registered dietitian. Every formula goes through a literature review, ingredient audit, and at least two rounds of dosage refinement before launch.",
      },
      {
        id: "q3",
        question: "Where are the products manufactured?",
        answer:
          "All Prime Wellness supplements are produced in NSF-certified, FDA-registered facilities in the United States. Each batch is third-party tested for purity and label accuracy.",
      },
      {
        id: "q4",
        question: "Can I pause or cancel my subscription?",
        answer:
          "Anytime, from your dashboard. Pause for up to three months, swap stacks, or cancel — no email or phone call required, no retention dark patterns.",
      },
      {
        id: "q5",
        question: "Do you ship outside the United States?",
        answer:
          "Currently we ship within the US, including Hawaii and Alaska. International shipping is on the roadmap and we expect to launch Canada in the next 90 days.",
      },
    ],
  },
  footerGroups: [
    {
      heading: "Programs",
      links: [
        { label: "Daily Greens", href: "/products/daily-greens" },
        { label: "Sleep Stack", href: "/products/sleep-stack" },
        { label: "Recovery Kit", href: "/products/recovery-kit" },
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
      slug: "hormone-baseline",
      name: "Hormone Baseline",
      eyebrow: "Provider-supervised",
      description:
        "At-home labs + telehealth provider review + monthly fulfillment of an individualized hormone protocol.",
      price: { subscription: { monthly: { amount: 24900, currency: "USD" } } },
      ctaHref: "/products/hormone-baseline",
    },
    {
      id: "peptide-stack",
      slug: "peptide-performance",
      name: "Peptide Performance",
      eyebrow: "Recovery + performance",
      description:
        "BPC-157, TB-500, and supporting peptides fulfilled by 503A compounding pharmacy partners.",
      price: { subscription: { monthly: { amount: 39900, currency: "USD" } } },
      ctaHref: "/products/peptide-performance",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
          alt: "Sterile vials on a clinical lab surface",
        },
        {
          url: "https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?auto=format&fit=crop&w=600&q=80",
          alt: "Medical chart with hand-drawn dosing",
        },
        {
          url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
          alt: "Provider in a telehealth visit",
        },
        {
          url: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&w=600&q=80",
          alt: "Athlete returning to training",
        },
      ],
      longDescription:
        "A provider-supervised peptide protocol for accelerated recovery, soft-tissue repair, and performance under high training load. Compounded at 503A pharmacy partners under prescription, shipped on cold-chain where required.",
      detailSections: [
        {
          id: "protocol",
          title: "The protocol",
          body: "After your labs and provider visit, a 12-week sequence begins with BPC-157 + TB-500 stacked for soft-tissue and tendon recovery, then transitions to a maintenance cadence based on outcomes. Provider adjusts dose every four weeks.",
        },
        {
          id: "supervision",
          title: "Who supervises this",
          body: "An independent licensed physician in your state holds the prescriptive relationship. ApexRX coordinates the visit, follow-ups, fulfillment logistics, and member experience. The provider — not ApexRX — owns clinical decisions.",
        },
        {
          id: "compliance",
          title: "Compliance & sourcing",
          body: "Compounded medications are produced at a 503A pharmacy partner licensed in your state. We disclose the pharmacy partner on your protocol page before fulfillment. Lot numbers and certificates of analysis are available in your member portal.",
        },
      ],
      ingredients: [
        {
          id: "bpc157",
          name: "BPC-157",
          dose: "250 mcg / day",
          role: "Body Protection Compound; supports gut, soft tissue, and tendon recovery.",
          source: "Compounded · 503A partner",
        },
        {
          id: "tb500",
          name: "TB-500 (Thymosin β-4 fragment)",
          dose: "2.5 mg / week",
          role: "Supports systemic recovery and tissue repair at injury sites.",
          source: "Compounded · 503A partner",
        },
        {
          id: "ipa",
          name: "Ipamorelin",
          dose: "200 mcg before bed",
          role: "Modulates endogenous GH pulses; supports recovery sleep architecture.",
          source: "Compounded · 503A partner",
        },
      ],
      averageRating: 4.9,
      reviewCount: 87,
      reviews: [
        {
          id: "r1",
          rating: 5,
          headline: "Recovery from chronic Achilles issue",
          quote:
            "I'd been dealing with a left Achilles inflammation for six months. Twelve weeks on this protocol and I'm back to lifting at 90%. The provider was responsive and adjusted me mid-protocol when it plateaued.",
          attribution: "Andrew L.",
          attributionDetail: "Member · Hormone Baseline + Peptide Performance",
          verified: true,
        },
        {
          id: "r2",
          rating: 5,
          quote:
            "What I expected from a $399/month protocol: bottles in the mail. What I got: a real clinical relationship and a dashboard that tracks my outcomes. Worth it.",
          attribution: "Member, 47",
          verified: true,
        },
      ],
      relatedSlugs: ["hormone-baseline", "longevity-panel"],
    },
    {
      id: "longevity",
      slug: "longevity-panel",
      name: "Longevity Panel",
      eyebrow: "Quarterly diagnostics",
      description:
        "Quarterly comprehensive labs (40+ biomarkers) and a 30-min provider readout.",
      price: { subscription: { monthly: { amount: 14900, currency: "USD" } } },
      ctaHref: "/products/longevity-panel",
    },
  ],
  programSection: {
    eyebrow: "Protocol design",
    headline: "Every protocol starts with data.",
    subhead:
      "Labs first. Provider review second. Adjust monthly based on what your numbers show.",
    steps: [
      {
        id: "1",
        label: "01",
        title: "Labs panel",
        body: "At-home phlebotomy or in-network draw, 40+ biomarkers depending on the protocol.",
      },
      {
        id: "2",
        label: "02",
        title: "Provider review",
        body: "A licensed physician reviews your panel, history, and goals in a 30-minute telehealth call.",
      },
      {
        id: "3",
        label: "03",
        title: "Compounded fulfillment",
        body: "503A pharmacy partner compounds your protocol and ships direct. Cold-chain when required.",
      },
      {
        id: "4",
        label: "04",
        title: "Outcomes monitoring",
        body: "Quarterly labs and an outcomes call. Adjust dose, swap molecules, or graduate off-protocol.",
      },
    ],
  },
  proofSection: {
    eyebrow: "Outcomes",
    headline: "Numbers that move because the protocols move.",
    featured: {
      id: "f1",
      quote:
        "ApexRX is the only program I've used that treats labs as the primary signal. My free testosterone, sleep efficiency, and HRV are all in the top quintile for my age now — three quarters in.",
      attribution: "Andrew L., 41",
      attributionDetail: "Hormone Baseline + Longevity Panel",
      rating: 5,
    },
    supporting: [
      {
        id: "s1",
        quote: "Their provider returned my message in under an hour. That's not normal in telehealth.",
        attribution: "Member, 37",
        attributionDetail: "Peptide Performance",
      },
      {
        id: "s2",
        quote:
          "Real labs, real provider, real adjustments. Not a wellness brand pretending to be a clinic.",
        attribution: "Member, 52",
        attributionDetail: "Hormone Baseline",
      },
      {
        id: "s3",
        quote:
          "Saw measurable changes inside two cycles. The dashboard is what I always wanted from a clinic.",
        attribution: "Member, 44",
        attributionDetail: "Longevity Panel",
      },
    ],
  },
  faqSection: {
    eyebrow: "Common questions",
    headline: "How the protocol works, end to end.",
    subhead:
      "Clinical questions route directly to your provider. Logistics questions to our member team.",
    items: [
      {
        id: "q1",
        question: "Who reviews my labs and prescribes the protocol?",
        answer:
          "An independent licensed physician in your state. ApexRX coordinates the visit and follow-ups; the provider holds the prescriptive relationship and authority.",
      },
      {
        id: "q2",
        question: "Where are the compounded medications produced?",
        answer:
          "503A compounding pharmacy partners licensed in your state. We disclose the partner pharmacy on your protocol page before fulfillment.",
      },
      {
        id: "q3",
        question: "Are peptides legal?",
        answer:
          "Several research-grade peptides are restricted to specific compounding categories or off-label clinical use. Your provider determines what is appropriate and lawful for your state and indication.",
      },
      {
        id: "q4",
        question: "What if I need to escalate something between visits?",
        answer:
          "Use the message thread in your member portal. Your provider responds inside two business hours on weekdays; urgent issues escalate to the clinical operations team immediately.",
      },
      {
        id: "q5",
        question: "Can I cancel mid-protocol?",
        answer:
          "Yes. Protocols are monthly. We do not enforce minimum terms; we do follow the provider's tapering guidance for any molecule that requires it.",
      },
    ],
  },
  footerGroups: [
    {
      heading: "Protocols",
      links: [
        { label: "Hormone Baseline", href: "/products/hormone-baseline" },
        { label: "Peptide Performance", href: "/products/peptide-performance" },
        { label: "Longevity Panel", href: "/products/longevity-panel" },
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
      slug: "pre-lift",
      name: "Pre-Lift",
      eyebrow: "Train",
      description: "Citrulline, beta-alanine, caffeine. Clean panel, transparent dosing.",
      price: {
        oneTime: { amount: 4900, currency: "USD" },
        subscription: { monthly: { amount: 3900, currency: "USD" } },
      },
      ctaHref: "/products/pre-lift",
    },
    {
      id: "whey",
      slug: "whey-foundation",
      name: "Whey Foundation",
      eyebrow: "Build",
      description: "Grass-fed isolate, 27g per scoop, no artificial sweeteners.",
      price: {
        oneTime: { amount: 7900, currency: "USD" },
        subscription: { monthly: { amount: 5900, currency: "USD" }, savingsPct: 25 },
      },
      ctaHref: "/products/whey-foundation",
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1200&q=80",
          alt: "Athlete mixing protein in the gym",
        },
        {
          url: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&w=600&q=80",
          alt: "Tub of whey foundation",
        },
        {
          url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
          alt: "Squat rack closeup",
        },
        {
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
          alt: "Crew workout in progress",
        },
      ],
      longDescription:
        "Honest whey isolate. 27g of protein per scoop, sourced from grass-fed dairy, sweetened with monk fruit, mixed clean every time. The panel is the panel — no proprietary blends, no underdosed actives, no flavoring chemicals you can't pronounce.",
      detailSections: [
        {
          id: "panel",
          title: "What's actually in it",
          body: "Whey protein isolate (grass-fed), natural cocoa or vanilla, monk fruit extract, sea salt, sunflower lecithin. That's it. The certificate of analysis is on the product page within five days of every batch release.",
        },
        {
          id: "how-we-use-it",
          title: "How the crew uses it",
          body: "Two scoops post-training, one scoop in the morning oatmeal, or one scoop blended with banana + almond butter as a between-meals lever. Mixes in water, not just milk. Subscribers get the optional monthly programming PDF.",
        },
        {
          id: "tested",
          title: "Third-party tested. Every batch.",
          body: "Every production lot is third-party tested for purity, label accuracy, and heavy metals. Results live on each product page. Underdosing or sneaking in cheap fillers is the fastest way to lose this customer; we don't do either.",
        },
      ],
      ingredients: [
        {
          id: "whey-isolate",
          name: "Whey Protein Isolate",
          source: "Grass-fed New Zealand sourced",
          dose: "27 g",
          role: "Complete protein, high BCAA fraction, low lactose.",
        },
        {
          id: "monk-fruit",
          name: "Monk Fruit Extract",
          dose: "60 mg",
          role: "Natural sweetener — no sucralose, no aspartame.",
        },
        {
          id: "lecithin",
          name: "Sunflower Lecithin",
          dose: "200 mg",
          role: "Improves mixability and texture without seed-oil solvents.",
        },
        {
          id: "salt",
          name: "Sea Salt",
          dose: "100 mg",
          role: "Balances flavor; matters more than people think.",
        },
      ],
      averageRating: 4.7,
      reviewCount: 412,
      reviews: [
        {
          id: "r1",
          rating: 5,
          headline: "Mixes clean, tastes like food",
          quote:
            "I've used twelve different whey brands. This one mixes in water with a spoon, no blender, no clumps. Tastes like an actual food product, not a candy bar.",
          attribution: "Marcus H.",
          attributionDetail: "Powerlifter · subscribed since 2023",
          verified: true,
        },
        {
          id: "r2",
          rating: 5,
          quote:
            "Third-party tested COA on every batch is what got me to switch. Iron Reserve was the first brand that just published it without me having to ask.",
          attribution: "Trey W.",
          attributionDetail: "Marathon",
          verified: true,
        },
        {
          id: "r3",
          rating: 4,
          quote:
            "Only complaint: the vanilla could be a touch sweeter. Otherwise this is just the cleanest whey I've found.",
          attribution: "Sienna M.",
          attributionDetail: "Crossfit",
          verified: true,
        },
      ],
      relatedSlugs: ["pre-lift", "post-recovery"],
    },
    {
      id: "recovery",
      slug: "post-recovery",
      name: "Post Recovery",
      eyebrow: "Repair",
      description: "Creatine + electrolytes + tart cherry. The bottle on every gym bag.",
      price: { subscription: { monthly: { amount: 4900, currency: "USD" } } },
      ctaHref: "/products/post-recovery",
    },
  ],
  programSection: {
    eyebrow: "The system",
    headline: "Simple stack. Honest dosing. No fluff.",
    subhead: "Designed by competing athletes who hated being lied to about what's in the tub.",
    steps: [
      {
        id: "1",
        label: "01",
        title: "Train",
        body: "Pre-Lift before sessions. Citrulline, beta-alanine, caffeine. No proprietary blends.",
      },
      {
        id: "2",
        label: "02",
        title: "Build",
        body: "Whey Foundation around training. Grass-fed isolate, 27g per scoop, three flavors.",
      },
      {
        id: "3",
        label: "03",
        title: "Repair",
        body: "Post Recovery after the last set. Creatine + electrolytes + tart cherry.",
      },
      {
        id: "4",
        label: "04",
        title: "Show up tomorrow",
        body: "Subscribe and never miss a block. Pause anytime — but the work doesn't pause itself.",
      },
    ],
  },
  proofSection: {
    eyebrow: "From the crew",
    headline: "Athletes who train like it matters.",
    featured: {
      id: "f1",
      quote:
        "I'd been mixing six different scoops every morning. Iron Reserve is just three tubs, honest panels, and prices that don't punish me for caring about what I put in.",
      attribution: "Marcus H.",
      attributionDetail: "Powerlifter · subscribed since 2023",
      rating: 5,
    },
    supporting: [
      {
        id: "s1",
        quote: "Tastes like an actual food product. Mixes clean. Does the job.",
        attribution: "Sienna M.",
        attributionDetail: "Crossfit",
        rating: 5,
      },
      {
        id: "s2",
        quote:
          "Third-party testing on every batch is non-negotiable for me. Iron Reserve was the first brand that just published it.",
        attribution: "Trey W.",
        attributionDetail: "Marathon",
        rating: 5,
      },
      {
        id: "s3",
        quote: "The crew programming alone is worth the subscription. The stack is just the cost of entry.",
        attribution: "Alex G.",
        attributionDetail: "Strength coach",
      },
    ],
  },
  faqSection: {
    eyebrow: "Common questions",
    headline: "Real answers, no marketing fluff.",
    subhead: "If it isn't here, the crew chat answers fast.",
    items: [
      {
        id: "q1",
        question: "What's actually in each tub?",
        answer:
          "Exactly what's on the label. No proprietary blends, no underdosed actives. Full panel is on every product page.",
      },
      {
        id: "q2",
        question: "Are these products third-party tested?",
        answer:
          "Every batch. We publish certificates of analysis on the product page within five days of release.",
      },
      {
        id: "q3",
        question: "How do subscriptions work?",
        answer:
          "Monthly by default, with the option to switch to a 60-day cadence. Pause, swap, cancel from the dashboard — no email gates.",
      },
      {
        id: "q4",
        question: "Is the whey flavored?",
        answer:
          "Three flavors: vanilla, chocolate, unflavored. Sweetened with monk fruit; no sucralose, no artificial colors.",
      },
      {
        id: "q5",
        question: "Where do you ship?",
        answer:
          "Across the United States. International is on the roadmap; we'll email subscribers when it's live.",
      },
    ],
  },
  footerGroups: [
    {
      heading: "Stack",
      links: [
        { label: "Pre-Lift", href: "/products/pre-lift" },
        { label: "Whey Foundation", href: "/products/whey-foundation" },
        { label: "Post Recovery", href: "/products/post-recovery" },
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

/**
 * Resolve a product by slug across all three demo brands. Helper for the
 * /products/[slug] route during Sprint 3 (before apps/storefront wires real
 * tenants). Returns the matching `Product` and its parent `DemoBrand`, or null.
 */
export function findProductBySlug(slug: string): {
  product: Product;
  brand: DemoBrand;
} | null {
  for (const brand of [primeWellness, apexRx, ironReserve]) {
    const product = brand.products.find((p) => p.slug === slug);
    if (product) return { product, brand };
  }
  return null;
}
