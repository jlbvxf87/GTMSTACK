import type { Meta, StoryObj } from "@storybook/react";
import { SiteHeader } from "./SiteHeader";
import { ThemeProvider } from "../theme-provider";
import { demoBrands } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof SiteHeader> = {
  title: "Sprint 2/SiteHeader",
  component: SiteHeader,
};
export default meta;

type Story = StoryObj<typeof SiteHeader>;

export const Wellness: Story = {
  render: () => (
    <ThemeProvider theme="wellness">
      <SiteHeader
        brandName={demoBrands.wellness.name}
        links={demoBrands.wellness.nav}
        cta={demoBrands.wellness.navCta}
      />
    </ThemeProvider>
  ),
};

export const Clinical: Story = {
  render: () => (
    <ThemeProvider theme="clinical">
      <SiteHeader
        brandName={demoBrands.clinical.name}
        links={demoBrands.clinical.nav}
        cta={demoBrands.clinical.navCta}
        announcement="Now reviewing Q4 hormone baselines — 2-day turnaround"
      />
    </ThemeProvider>
  ),
};

export const Community: Story = {
  render: () => (
    <ThemeProvider theme="community">
      <SiteHeader
        brandName={demoBrands.community.name}
        links={demoBrands.community.nav}
        cta={demoBrands.community.navCta}
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
              <p className="px-6 pt-4 font-mono text-small uppercase tracking-[0.2em] text-muted-foreground">
                {name}
              </p>
              <SiteHeader brandName={b.name} links={b.nav} cta={b.navCta} sticky={false} />
              <div className="h-12" />
            </div>
          </ThemeProvider>
        );
      })}
    </div>
  ),
};
