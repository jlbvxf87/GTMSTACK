/**
 * Local component types — placeholder until `@gtmstack/shared` schemas ship.
 *
 * Anything used by more than one component in this folder goes here. Anything
 * that crosses package boundaries (server actions, DB types) belongs in
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

/** A single image in a product gallery. */
export type ProductGalleryImage = {
  url: string;
  alt?: string;
};

/** One ingredient row inside `<ProductIngredients>`. */
export type Ingredient = {
  id: string;
  /** Customer-visible ingredient name. */
  name: string;
  /** Per-serving dose (e.g. "500 mg", "1 dropper"). */
  dose: string;
  /** Why it's in the formula. Short clause. */
  role?: string;
  /** Source / standardization note (e.g. "KSM-66"). */
  source?: string;
};

/** A long-form content section under the buy box. */
export type ProductDetailSection = {
  id: string;
  /** Section heading (e.g. "How it works"). */
  title: string;
  /** Section body — paragraph-length copy. */
  body: string;
};

/** A single customer review. */
export type ProductReview = {
  id: string;
  /** 1–5 stars. */
  rating: number;
  /** Optional review headline (one line). */
  headline?: string;
  /** Review body. */
  quote: string;
  attribution: string;
  /** Role / location / verified-purchase context line. */
  attributionDetail?: string;
  /** Verified-purchase badge. */
  verified?: boolean;
  /** ISO-8601 date string for sort order; not displayed by default. */
  postedAt?: string;
};

export type Product = {
  id: string;
  /** URL slug — drives /products/[slug] routing. Required. */
  slug: string;
  name: string;
  /** Short positioning line above the name. */
  eyebrow?: string;
  /** Single-sentence description for card surface. */
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  price: Price;
  /** Optional explicit CTA label per product (overrides default "Add to program"). */
  ctaLabel?: string;
  ctaHref: string;

  // Product-page-specific (Sprint 3, all optional). When a product page renders
  // for a Product that lacks these, the page simply omits the empty sections.
  gallery?: ProductGalleryImage[];
  longDescription?: string;
  detailSections?: ProductDetailSection[];
  ingredients?: Ingredient[];
  reviews?: ProductReview[];
  /** If omitted, ProductReviews computes it from `reviews`. */
  averageRating?: number;
  /** If omitted, ProductReviews computes it from `reviews`. */
  reviewCount?: number;
  /** Slugs of related products. Render-time resolution. */
  relatedSlugs?: string[];
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
