import type { Meta, StoryObj } from "@storybook/react";
import { IntakeReviewSummary } from "./IntakeReviewSummary";
import { ThemeProvider } from "../theme-provider";
import type { ThemeName } from "../tokens";
import type { IntakeReviewSection } from "./types";

const meta: Meta<typeof IntakeReviewSummary> = {
  title: "Sprint 4/IntakeReviewSummary",
  component: IntakeReviewSummary,
};
export default meta;

type Story = StoryObj<typeof IntakeReviewSummary>;

const sections: IntakeReviewSection[] = [
  {
    stepKey: "goals",
    label: "Goals",
    editHref: "#",
    fields: [
      { label: "Primary goal", value: "Better sleep" },
      { label: "Focus areas", value: "Sleep quality, Recovery after training" },
    ],
  },
  {
    stepKey: "health",
    label: "Health snapshot",
    editHref: "#",
    fields: [
      { label: "Age range", value: "30–39" },
      { label: "Activity", value: "Active" },
      { label: "Sleep", value: "Some good nights, some rough" },
      { label: "Notes", value: "" },
    ],
  },
  {
    stepKey: "preferences",
    label: "Preferences",
    editHref: "#",
    fields: [
      { label: "Coaching", value: "Monthly check-ins" },
      { label: "Shipping", value: "Monthly" },
      { label: "Channel", value: "Email" },
    ],
  },
  {
    stepKey: "account",
    label: "Account",
    editHref: "#",
    fields: [
      { label: "Name", value: "Maya R." },
      { label: "Email", value: "maya@example.com" },
      { label: "Phone", value: "" },
    ],
  },
];

function renderFor(theme: ThemeName) {
  return (
    <ThemeProvider theme={theme}>
      <div className="bg-background p-10">
        <div className="mx-auto max-w-3xl">
          <IntakeReviewSummary sections={sections} />
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
              <IntakeReviewSummary sections={sections} />
            </div>
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
