import { ProductCard } from "./ProductCard";
import type { Product } from "./types";

export type RelatedProductsProps = {
  eyebrow?: string;
  headline: string;
  products: Product[];
};

/**
 * RelatedProducts — cross-sell strip below the product page. Server component.
 *
 * Visually a tighter, less-emphasized version of `FeatureGrid`. Reuses `ProductCard`
 * so cross-sell stays consistent with the catalog grid. Operators / route handlers
 * resolve `product.relatedSlugs` to `Product[]` before passing to this component.
 */
export function RelatedProducts({ eyebrow, headline, products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="w-full bg-muted text-foreground">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <header className="mb-12">
          {eyebrow ? (
            <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-h1 text-foreground">{headline}</h2>
        </header>

        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id} className="contents">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
