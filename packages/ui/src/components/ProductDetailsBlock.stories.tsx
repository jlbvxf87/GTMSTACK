import type { Meta, StoryObj } from "@storybook/react";
import { ProductDetailsBlock } from "./ProductDetailsBlock";
import { ThemeProvider } from "../theme-provider";
import { findProductBySlug } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof ProductDetailsBlock> = {
  title: "Sprint 3/ProductDetailsBlock",
  component: ProductDetailsBlock,
};
export default meta;

type Story = StoryObj<typeof ProductDetailsBlock>;

const canonical: Record<ThemeName, string> = {
  wellness: "sleep-stack",
  clinical: "peptide-performance",
  community: "whey-foundation",
};

function renderFor(theme: ThemeName) {
  const product = findProductBySlug(canonical[theme])!.product;
  return (
    <ThemeProvider theme={theme}>
      <ProductDetailsBlock
        eyebrow="The details"
        headline={product.longDescription ? "What's actually inside it." : "Details"}
        sections={product.detailSections ?? []}
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
      {(["clinical", "wellness", "community"] as ThemeName[]).map((name) => (
        <ThemeProvider key={name} theme={name}>
          <div className="border-b border-border">
            <p className="px-6 pt-6 font-mono text-small uppercase tracking-[0.2em] text-muted-foreground">
              {name}
            </p>
            <ProductDetailsBlock
              eyebrow="The details"
              headline="What's actually inside it."
              sections={findProductBySlug(canonical[name])!.product.detailSections ?? []}
            />
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
