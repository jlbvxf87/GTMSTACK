import type { Meta, StoryObj } from "@storybook/react";
import { IntakeChoiceGroup } from "./IntakeChoiceGroup";
import { ThemeProvider } from "../theme-provider";
import type { ThemeName } from "../tokens";
import type { IntakeChoice } from "./types";

const meta: Meta<typeof IntakeChoiceGroup> = {
  title: "Sprint 4/IntakeChoiceGroup",
  component: IntakeChoiceGroup,
};
export default meta;

type Story = StoryObj<typeof IntakeChoiceGroup>;

const primary: IntakeChoice[] = [
  { value: "sleep", label: "Better sleep", description: "Wake actually rested" },
  { value: "energy", label: "Sustainable energy", description: "No 3 PM crashes" },
  { value: "recovery", label: "Faster recovery", description: "Train hard, recover harder" },
  { value: "longevity", label: "Long-term health", description: "Optimize the 30-year horizon" },
];

const focusAreas: IntakeChoice[] = [
  { value: "sleep", label: "Sleep quality" },
  { value: "energy", label: "Daily energy" },
  { value: "recovery", label: "Recovery after training" },
  { value: "stress", label: "Stress resilience" },
  { value: "focus", label: "Focus & cognition" },
  { value: "mood", label: "Mood stability" },
];

function renderFor(theme: ThemeName) {
  return (
    <ThemeProvider theme={theme}>
      <div className="bg-background p-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <IntakeChoiceGroup
            name="primaryGoal"
            legend="Pick one primary goal"
            options={primary}
            defaultValue="sleep"
            required
            columns={2}
          />
          <IntakeChoiceGroup
            name="goals"
            legend="Other focus areas (multi-select)"
            multiple
            options={focusAreas}
            defaultValue={["sleep", "recovery"]}
            columns={3}
            helperText="Picked alongside your primary goal."
          />
        </div>
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
          <div className="border-b border-border bg-background p-10">
            <p className="mb-6 font-mono text-small uppercase tracking-[0.2em] text-muted-foreground">
              {name}
            </p>
            <div className="mx-auto max-w-3xl">
              <IntakeChoiceGroup
                name="primaryGoal"
                legend="Pick one primary goal"
                options={primary}
                defaultValue="sleep"
                columns={2}
              />
            </div>
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
