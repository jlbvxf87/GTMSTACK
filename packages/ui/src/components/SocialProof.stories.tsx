import type { Meta, StoryObj } from "@storybook/react";
import { SocialProof } from "./SocialProof";
import { ThemeProvider } from "../theme-provider";
import { demoBrands } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof SocialProof> = {
  title: "Sprint 2/SocialProof",
  component: SocialProof,
};
export default meta;

type Story = StoryObj<typeof SocialProof>;

export const Wellness: Story = {
  render: () => (
    <ThemeProvider theme="wellness">
      <SocialProof {...demoBrands.wellness.proofSection} />
    </ThemeProvider>
  ),
};

export const Clinical: Story = {
  render: () => (
    <ThemeProvider theme="clinical">
      <SocialProof {...demoBrands.clinical.proofSection} />
    </ThemeProvider>
  ),
};

export const Community: Story = {
  render: () => (
    <ThemeProvider theme="community">
      <SocialProof {...demoBrands.community.proofSection} />
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
              <SocialProof {...b.proofSection} />
            </div>
          </ThemeProvider>
        );
      })}
    </div>
  ),
};
