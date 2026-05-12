import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProductDetailsBlock,
  ProductHero,
  ProductIngredients,
  ProductReviews,
  RelatedProducts,
  SiteFooter,
  SiteHeader,
  findProductBySlug,
} from "@gtmstack/ui";

type Params = { slug: string };

/**
 * Product detail page. Temporary home in apps/marketing for Sprint 3 — this
 * page is conceptually part of the operator storefront. Once apps/storefront
 * scaffolds (Sprint 6+), the route moves there unchanged because it consumes
 * components from @gtmstack/ui and data from a resolver function (today the
 * demo-brand fixture; tomorrow the database).
 *
 * Slug resolution is via @gtmstack/ui's findProductBySlug fixture helper for
 * now; the same call signature swaps to a real DB query later without changing
 * this page's shape.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const match = findProductBySlug(slug);
  if (!match) return { title: "Product not found · GTMStack" };
  const { product, brand } = match;
  return {
    title: `${product.name} · ${brand.name}`,
    description: product.description ?? product.longDescription ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const match = findProductBySlug(slug);
  if (!match) notFound();

  const { product, brand } = match;

  const related = (product.relatedSlugs ?? [])
    .map((s) => brand.products.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const trustLines = trustLinesByTheme[brand.themeName];

  return (
    <>
      <SiteHeader brandName={brand.name} links={brand.nav} cta={brand.navCta} />

      <main>
        <ProductHero product={product} trustLines={trustLines} />

        {product.longDescription || product.detailSections?.length ? (
          <ProductDetailsBlock
            eyebrow="The details"
            headline={detailsHeadlineByTheme[brand.themeName]}
            sections={product.detailSections ?? []}
          />
        ) : null}

        {product.ingredients?.length ? (
          <ProductIngredients
            eyebrow="What's in it"
            headline={ingredientsHeadlineByTheme[brand.themeName]}
            ingredients={product.ingredients}
            footnote={ingredientsFootnoteByTheme[brand.themeName]}
          />
        ) : null}

        {product.reviews?.length ? (
          <ProductReviews
            eyebrow="Reviews"
            headline="From the people on the program."
            reviews={product.reviews}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
          />
        ) : null}

        {related.length ? (
          <RelatedProducts
            eyebrow="Also in the program"
            headline="Members on this stack often add:"
            products={related}
          />
        ) : null}
      </main>

      <SiteFooter
        brandName={brand.name}
        tagline={brand.tagline}
        linkGroups={brand.footerGroups}
        legalLinks={brand.footerLegal}
        disclaimer={brand.footerDisclaimer}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Per-theme copy that lives at the page level — not part of the Product data
// model because operators don't tune these strings, they're page chrome.
// ---------------------------------------------------------------------------

const trustLinesByTheme: Record<"wellness" | "clinical" | "community", string[]> = {
  wellness: [
    "Free shipping over $50",
    "Pause or cancel anytime",
    "Clinician-formulated",
    "Third-party tested",
  ],
  clinical: [
    "Provider-supervised",
    "Compounded by licensed 503A partner",
    "Cold-chain shipping where required",
    "Monthly outcomes review",
  ],
  community: [
    "Third-party tested every batch",
    "Honest dosing — no proprietary blends",
    "Free shipping over $50",
    "Cancel anytime",
  ],
};

const detailsHeadlineByTheme = {
  wellness: "What's actually inside it.",
  clinical: "How the protocol is built.",
  community: "What's in the tub, and why.",
} as const;

const ingredientsHeadlineByTheme = {
  wellness: "Every ingredient. Every dose. Every reason it's in there.",
  clinical: "The compounded protocol, in full.",
  community: "What's in the tub — the whole panel, no fluff.",
} as const;

const ingredientsFootnoteByTheme = {
  wellness:
    "Manufactured in NSF-certified, FDA-registered facilities. Third-party tested batch by batch. Certificate of Analysis available in your member portal.",
  clinical:
    "Compounded at a licensed 503A pharmacy partner under prescription. Lot numbers and Certificates of Analysis available in your member portal before shipping.",
  community:
    "Third-party tested every batch. Certificate of Analysis posted to this product page within five days of release.",
} as const;
