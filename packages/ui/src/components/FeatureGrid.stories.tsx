import type { Meta, StoryObj } from "@storybook/react";
import { FeatureGrid } from "./FeatureGrid";
import { ThemeProvider } from "../theme-provider";
import { demoBrands } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof FeatureGrid> = {
  title: "Sprint 2/FeatureGrid",
  component: FeatureGrid,
};
export default meta;

type Story = StoryObj<typeof FeatureGrid>;

export const Wellness: Story = {
  render: () => (
    <ThemeProvider theme="wellness">
      <FeatureGrid
        eyebrow={demoBrands.wellness.productSection.eyebrow}
        headline={demoBrands.wellness.productSection.headline}
        subhead={demoBrands.wellness.productSection.subhead}
        products={demoBrands.wellness.products}
      />
    </ThemeProvider>
  ),
};

export const Clinical: Story = {
  render: () => (
    <ThemeProvider theme="clinical">
      <FeatureGrid
        eyebrow={demoBrands.clinical.productSection.eyebrow}
        headline={demoBrands.clinical.productSection.headline}
        subhead={demoBrands.clinical.productSection.subhead}
        products={demoBrands.clinical.products}
      />
    </ThemeProvider>
  ),
};

export const Community: Story = {
  render: () => (
    <ThemeProvider theme="community">
      <FeatureGrid
        eyebrow={demoBrands.community.productSection.eyebrow}
        headline={demoBrands.community.productSection.headline}
        subhead={demoBrands.community.productSection.subhead}
        products={demoBrands.community.products}
      />
    </ThemeProvider>
  ),
};

export const ThreeUpSideBySide: Story = {
  name: "Three-up (clinical / wellness / community)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-screen flex-col">
      {(["clinical", "wellness", "community"] as ThemeName[]).map((name) => {
        const b = demoBrands[name];
        return (
          <ThemeProvider key={name} theme={name}>
            <div className="border-b border-border">
              <p className="px-6 pt-6 font-mono text-small uppercase tracking-[0.2em] text-muted-foreground">
                {name}
              </p>
              <FeatureGrid
                eyebrow={b.productSection.eyebrow}
                headline={b.productSection.headline}
                subhead={b.productSection.subhead}
                products={b.products}
              />
            </div>
          </ThemeProvider>
        );
      })}
    </div>
  ),
};
