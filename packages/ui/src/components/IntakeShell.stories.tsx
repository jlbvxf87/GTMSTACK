import type { Meta, StoryObj } from "@storybook/react";
import { IntakeShell } from "./IntakeShell";
import { ThemeProvider } from "../theme-provider";
import type { ThemeName } from "../tokens";
import type { IntakeStep } from "./types";

const meta: Meta<typeof IntakeShell> = {
  title: "Sprint 4/IntakeShell",
  component: IntakeShell,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof IntakeShell>;

const steps: IntakeStep[] = [
  { key: "goals", label: "Goals" },
  { key: "health", label: "Health" },
  { key: "preferences", label: "Preferences" },
  { key: "account", label: "Account" },
  { key: "review", label: "Review" },
];

const brandByTheme: Record<ThemeName, string> = {
  wellness: "Prime Wellness",
  clinical: "ApexRX",
  community: "Iron Reserve",
};

function renderFor(theme: ThemeName) {
  return (
    <ThemeProvider theme={theme}>
      <IntakeShell
        brandName={brandByTheme[theme]}
        steps={steps}
        currentStep="goals"
        eyebrow="Step 1 of 5"
        headline="What do you want from the program?"
        subhead="There's no wrong answer. We tune the stack and the cadence to whatever you pick."
      >
        <div className="rounded-card border-card border-border bg-muted p-8 text-center text-body text-muted-foreground">
          (Step content slot)
        </div>
      </IntakeShell>
    </ThemeProvider>
  );
}

export const Wellness: Story = { render: () => renderFor("wellness") };
export const Clinical: Story = { render: () => renderFor("clinical") };
export const Community: Story = { render: () => renderFor("community") };

export const ThreeUpSideBySide: Story = {
  name: "Three-up (clinical / wellness / community)",
  render: () => (
    <div className="flex min-h-screen flex-col">
      {(["clinical", "wellness", "community"] as ThemeName[]).map((name) => (
        <ThemeProvider key={name} theme={name}>
          <div className="border-b border-border">
            <p className="bg-muted px-6 py-2 font-mono text-small uppercase tracking-[0.2em] text-muted-foreground">
              {name}
            </p>
            <IntakeShell
              brandName={brandByTheme[name]}
              steps={steps}
              currentStep="goals"
              eyebrow="Step 1 of 5"
              headline="What do you want from the program?"
              subhead="There's no wrong answer."
            >
              <div className="rounded-card border-card border-border bg-muted p-8 text-center text-body text-muted-foreground">
                (Step content slot)
              </div>
            </IntakeShell>
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
