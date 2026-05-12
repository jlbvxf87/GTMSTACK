import type { Meta, StoryObj } from "@storybook/react";
import { ProductReviews } from "./ProductReviews";
import { ThemeProvider } from "../theme-provider";
import { findProductBySlug } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof ProductReviews> = {
  title: "Sprint 3/ProductReviews",
  component: ProductReviews,
};
export default meta;

type Story = StoryObj<typeof ProductReviews>;

const canonical: Record<ThemeName, string> = {
  wellness: "sleep-stack",
  clinical: "peptide-performance",
  community: "whey-foundation",
};

function renderFor(theme: ThemeName) {
  const product = findProductBySlug(canonical[theme])!.product;
  return (
    <ThemeProvider theme={theme}>
      <ProductReviews
        eyebrow="Reviews"
        headline="From the people on the program."
        reviews={product.reviews ?? []}
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
      />
    </ThemeProvider>
  );
}

export const Wellness: Story = { render: () => renderFor("wellness") };
export const Clinical: Story = { render: () => renderFor("clinical") };
export const Community: Story = { render: () => renderFor("community") };

export const ThreeUpSideBySide: Story = {
  name: "Three-up (clinical / wellness / community)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-screen flex-col">
      {(["clinical", "wellness", "community"] as ThemeName[]).map((name) => {
        const product = findProductBySlug(canonical[name])!.product;
        return (
          <ThemeProvider key={name} theme={name}>
            <div className="border-b border-border">
              <p className="px-6 pt-6 font-mono text-small uppercase tracking-[0.2em] text-muted-foreground">
                {name}
              </p>
              <ProductReviews
                eyebrow="Reviews"
                headline="From the people on the program."
                reviews={product.reviews ?? []}
                averageRating={product.averageRating}
                reviewCount={product.reviewCount}
              />
            </div>
          </ThemeProvider>
        );
      })}
    </div>
  ),
};
