import type { Meta, StoryObj } from "@storybook/react";
import { IntakeStepper } from "./IntakeStepper";
import { ThemeProvider } from "../theme-provider";
import type { ThemeName } from "../tokens";
import type { IntakeStep } from "./types";

const meta: Meta<typeof IntakeStepper> = {
  title: "Sprint 4/IntakeStepper",
  component: IntakeStepper,
};
export default meta;

type Story = StoryObj<typeof IntakeStepper>;

const steps: IntakeStep[] = [
  { key: "goals", label: "Goals" },
  { key: "health", label: "Health" },
  { key: "preferences", label: "Preferences" },
  { key: "account", label: "Account" },
  { key: "review", label: "Review" },
];

function renderFor(theme: ThemeName) {
  return (
    <ThemeProvider theme={theme}>
      <div className="bg-muted p-10">
        <IntakeStepper steps={steps} currentStep="preferences" completedSteps={["goals", "health"]} />
      </div>
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
          <div className="border-b border-border bg-muted p-10">
            <p className="mb-6 font-mono text-small uppercase tracking-[0.2em] text-muted-foreground">
              {name}
            </p>
            <IntakeStepper steps={steps} currentStep="preferences" completedSteps={["goals", "health"]} />
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
