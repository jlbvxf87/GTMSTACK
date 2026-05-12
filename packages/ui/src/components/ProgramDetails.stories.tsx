import type { Meta, StoryObj } from "@storybook/react";
import { ProgramDetails } from "./ProgramDetails";
import { ThemeProvider } from "../theme-provider";
import { demoBrands } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof ProgramDetails> = {
  title: "Sprint 2/ProgramDetails",
  component: ProgramDetails,
};
export default meta;

type Story = StoryObj<typeof ProgramDetails>;

export const Wellness: Story = {
  render: () => (
    <ThemeProvider theme="wellness">
      <ProgramDetails {...demoBrands.wellness.programSection} />
    </ThemeProvider>
  ),
};

export const Clinical: Story = {
  render: () => (
    <ThemeProvider theme="clinical">
      <ProgramDetails {...demoBrands.clinical.programSection} />
    </ThemeProvider>
  ),
};

export const Community: Story = {
  render: () => (
    <ThemeProvider theme="community">
      <ProgramDetails {...demoBrands.community.programSection} />
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
              <ProgramDetails {...b.programSection} />
            </div>
          </ThemeProvider>
        );
      })}
    </div>
  ),
};
