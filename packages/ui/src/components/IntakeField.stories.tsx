import type { Meta, StoryObj } from "@storybook/react";
import { IntakeField } from "./IntakeField";
import { ThemeProvider } from "../theme-provider";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof IntakeField> = {
  title: "Sprint 4/IntakeField",
  component: IntakeField,
};
export default meta;

type Story = StoryObj<typeof IntakeField>;

function renderFor(theme: ThemeName) {
  return (
    <ThemeProvider theme={theme}>
      <div className="bg-background p-10">
        <div className="mx-auto flex max-w-xl flex-col gap-8">
          <IntakeField
            name="firstName"
            label="First name"
            required
            placeholder="e.g. Maya"
            defaultValue="Maya"
          />
          <IntakeField
            name="email"
            label="Email"
            type="email"
            required
            helperText="We send your confirmation here."
          />
          <IntakeField
            name="email2"
            label="Email (with error)"
            type="email"
            error="Enter a valid email"
            defaultValue="not-an-email"
          />
          <IntakeField
            name="notes"
            label="Notes"
            multiline
            rows={4}
            helperText="Optional context for the coach."
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
            <div className="mx-auto flex max-w-xl flex-col gap-6">
              <IntakeField name="firstName" label="First name" required defaultValue="Maya" />
              <IntakeField
                name="email"
                label="Email"
                type="email"
                required
                helperText="We send confirmation here."
              />
              <IntakeField name="notes" label="Notes" multiline rows={3} />
            </div>
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
