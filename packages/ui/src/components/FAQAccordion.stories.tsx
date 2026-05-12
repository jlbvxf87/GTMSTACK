import type { Meta, StoryObj } from "@storybook/react";
import { FAQAccordion } from "./FAQAccordion";
import { ThemeProvider } from "../theme-provider";
import { demoBrands } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof FAQAccordion> = {
  title: "Sprint 2/FAQAccordion",
  component: FAQAccordion,
};
export default meta;

type Story = StoryObj<typeof FAQAccordion>;

export const Wellness: Story = {
  render: () => (
    <ThemeProvider theme="wellness">
      <FAQAccordion {...demoBrands.wellness.faqSection} />
    </ThemeProvider>
  ),
};

export const Clinical: Story = {
  render: () => (
    <ThemeProvider theme="clinical">
      <FAQAccordion {...demoBrands.clinical.faqSection} />
    </ThemeProvider>
  ),
};

export const Community: Story = {
  render: () => (
    <ThemeProvider theme="community">
      <FAQAccordion {...demoBrands.community.faqSection} />
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
              <FAQAccordion {...b.faqSection} emitJsonLd={false} />
            </div>
          </ThemeProvider>
        );
      })}
    </div>
  ),
};
