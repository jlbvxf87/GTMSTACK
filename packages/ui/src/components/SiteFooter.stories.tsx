import type { Meta, StoryObj } from "@storybook/react";
import { SiteFooter } from "./SiteFooter";
import { ThemeProvider } from "../theme-provider";
import { demoBrands } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof SiteFooter> = {
  title: "Sprint 2/SiteFooter",
  component: SiteFooter,
};
export default meta;

type Story = StoryObj<typeof SiteFooter>;

export const Wellness: Story = {
  render: () => (
    <ThemeProvider theme="wellness">
      <SiteFooter
        brandName={demoBrands.wellness.name}
        tagline={demoBrands.wellness.tagline}
        linkGroups={demoBrands.wellness.footerGroups}
        legalLinks={demoBrands.wellness.footerLegal}
        disclaimer={demoBrands.wellness.footerDisclaimer}
      />
    </ThemeProvider>
  ),
};

export const Clinical: Story = {
  render: () => (
    <ThemeProvider theme="clinical">
      <SiteFooter
        brandName={demoBrands.clinical.name}
        tagline={demoBrands.clinical.tagline}
        linkGroups={demoBrands.clinical.footerGroups}
        legalLinks={demoBrands.clinical.footerLegal}
        disclaimer={demoBrands.clinical.footerDisclaimer}
      />
    </ThemeProvider>
  ),
};

export const Community: Story = {
  render: () => (
    <ThemeProvider theme="community">
      <SiteFooter
        brandName={demoBrands.community.name}
        tagline={demoBrands.community.tagline}
        linkGroups={demoBrands.community.footerGroups}
        legalLinks={demoBrands.community.footerLegal}
        disclaimer={demoBrands.community.footerDisclaimer}
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
              <SiteFooter
                brandName={b.name}
                tagline={b.tagline}
                linkGroups={b.footerGroups}
                legalLinks={b.footerLegal}
                disclaimer={b.footerDisclaimer}
              />
            </div>
          </ThemeProvider>
        );
      })}
    </div>
  ),
};
