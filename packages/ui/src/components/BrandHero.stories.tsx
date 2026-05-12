import type { Meta, StoryObj } from "@storybook/react";
import { BrandHero, type BrandHeroProps } from "./BrandHero";
import { ThemeProvider } from "../theme-provider";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof BrandHero> = {
  title: "Sprint 1/BrandHero",
  component: BrandHero,
};
export default meta;

type Story = StoryObj<typeof BrandHero>;

const primeWellnessProps: BrandHeroProps = {
  brand: { name: "Prime Wellness" },
  eyebrow: "Recovery · Energy · Daily Performance",
  headline: "Recovery, energy, and daily performance — in one program.",
  subhead:
    "A clinician-designed wellness stack delivered monthly. Subscribe once, track results, adjust with your coach.",
  primaryCta: { label: "Start Your Program", href: "#" },
  secondaryCta: { label: "How it works", href: "#how" },
};

const wireBrandPerTheme: Record<ThemeName, BrandHeroProps> = {
  clinical: {
    ...primeWellnessProps,
    brand: { name: "ApexRX" },
    eyebrow: "Performance · Hormone · Longevity",
    headline: "Clinical-grade performance protocols.",
    subhead: "Provider-supervised hormone, recovery, and longevity programs — delivered to your door.",
    primaryCta: { label: "Get Started", href: "#" },
    secondaryCta: { label: "View Protocols", href: "#" },
  },
  wellness: primeWellnessProps,
  community: {
    ...primeWellnessProps,
    brand: { name: "Iron Reserve" },
    eyebrow: "Built · Tested · Earned",
    headline: "Fuel the work. Earn the result.",
    subhead: "Daily supplements made for athletes who train like it matters.",
    primaryCta: { label: "Shop The Stack", href: "#" },
    secondaryCta: { label: "Join The Crew", href: "#" },
  },
};

/** Single-theme render — Wellness (Prime Wellness demo brand). */
export const Wellness: Story = {
  render: () => (
    <ThemeProvider theme="wellness">
      <BrandHero {...wireBrandPerTheme.wellness} />
    </ThemeProvider>
  ),
};

export const Clinical: Story = {
  render: () => (
    <ThemeProvider theme="clinical">
      <BrandHero {...wireBrandPerTheme.clinical} />
    </ThemeProvider>
  ),
};

export const Community: Story = {
  render: () => (
    <ThemeProvider theme="community">
      <BrandHero {...wireBrandPerTheme.community} />
    </ThemeProvider>
  ),
};

/**
 * Sprint 1 acceptance criterion #7 — all three theme variants of `<BrandHero>` side-by-side.
 * The stacked layout makes the differentiation across radius, type scale, spacing, motion
 * philosophy, and color obvious at a glance.
 */
export const ThreeUpSideBySide: Story = {
  name: "Three-up (clinical / wellness / community)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-screen flex-col">
      {(["clinical", "wellness", "community"] as ThemeName[]).map((name) => (
        <ThemeProvider key={name} theme={name}>
          <div className="border-b border-border">
            <p className="px-6 pt-6 font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
              {name}
            </p>
            <BrandHero {...wireBrandPerTheme[name]} />
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
