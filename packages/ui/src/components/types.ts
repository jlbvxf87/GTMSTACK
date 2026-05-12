/**
 * Local component types — placeholder until `@gtmstack/shared` schemas ship.
 *
 * Anything used by more than one component in this folder goes here. Anything
 * that crosses package boundaries (e.g. server actions, DB types) belongs in
 * `@gtmstack/shared` and is imported back into here when ready.
 */

export type Money = {
  /** Amount in the smallest currency unit (cents for USD). */
  amount: number;
  /** ISO 4217 currency code. */
  currency: "USD";
};

export type Price = {
  oneTime?: Money;
  subscription?: {
    monthly: Money;
    /** Optional savings percentage vs one-time. */
    savingsPct?: number;
  };
};

export type Product = {
  id: string;
  /** Customer-visible name. */
  name: string;
  /** Short positioning line above the name (e.g. "Daily routine"). */
  eyebrow?: string;
  /** Single-sentence description for card surface. */
  description?: string;
  /** Hero image URL (operator-uploaded; storage layer decides resolution). */
  imageUrl?: string;
  imageAlt?: string;
  price: Price;
  /** Optional explicit CTA label per product (overrides default "Add to program"). */
  ctaLabel?: string;
  ctaHref: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  heading: string;
  links: NavLink[];
};

export type Testimonial = {
  id: string;
  quote: string;
  attribution: string;
  /** Optional role / location for attribution line two. */
  attributionDetail?: string;
  /** 1-5 star rating; omit to suppress. */
  rating?: number;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type ProgramStep = {
  id: string;
  /** Visible step number / label ("01", "02" or "Step 1"). */
  label: string;
  title: string;
  body: string;
};
