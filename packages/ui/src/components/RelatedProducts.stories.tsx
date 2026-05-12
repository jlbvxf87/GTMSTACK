import type { Meta, StoryObj } from "@storybook/react";
import { RelatedProducts } from "./RelatedProducts";
import { ThemeProvider } from "../theme-provider";
import { demoBrands } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof RelatedProducts> = {
  title: "Sprint 3/RelatedProducts",
  component: RelatedProducts,
};
export default meta;

type Story = StoryObj<typeof RelatedProducts>;

function renderFor(theme: ThemeName) {
  // Render every product in the brand as "related" so we get a fully populated grid.
  const brand = demoBrands[theme];
  return (
    <ThemeProvider theme={theme}>
      <RelatedProducts
        eyebrow="Also in the program"
        headline="Members on this stack often add:"
        products={brand.products}
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
            <RelatedProducts
              eyebrow="Also in the program"
              headline="Members on this stack often add:"
              products={demoBrands[name].products}
            />
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
