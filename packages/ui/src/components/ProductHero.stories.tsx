import type { Meta, StoryObj } from "@storybook/react";
import { ProductHero } from "./ProductHero";
import { ThemeProvider } from "../theme-provider";
import { demoBrands, findProductBySlug } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof ProductHero> = {
  title: "Sprint 3/ProductHero",
  component: ProductHero,
};
export default meta;

type Story = StoryObj<typeof ProductHero>;

const canonical: Record<ThemeName, string> = {
  wellness: "sleep-stack",
  clinical: "peptide-performance",
  community: "whey-foundation",
};

const trustLinesByTheme: Record<ThemeName, string[]> = {
  wellness: [
    "Free shipping over $50",
    "Pause or cancel anytime",
    "Clinician-formulated",
    "Third-party tested",
  ],
  clinical: [
    "Provider-supervised",
    "Compounded by licensed 503A partner",
    "Cold-chain shipping where required",
    "Monthly outcomes review",
  ],
  community: [
    "Third-party tested every batch",
    "27g protein per scoop",
    "Free shipping over $50",
    "Cancel anytime",
  ],
};

export const Wellness: Story = {
  render: () => {
    const match = findProductBySlug(canonical.wellness)!;
    return (
      <ThemeProvider theme="wellness">
        <ProductHero product={match.product} trustLines={trustLinesByTheme.wellness} />
      </ThemeProvider>
    );
  },
};

export const Clinical: Story = {
  render: () => {
    const match = findProductBySlug(canonical.clinical)!;
    return (
      <ThemeProvider theme="clinical">
        <ProductHero product={match.product} trustLines={trustLinesByTheme.clinical} />
      </ThemeProvider>
    );
  },
};

export const Community: Story = {
  render: () => {
    const match = findProductBySlug(canonical.community)!;
    return (
      <ThemeProvider theme="community">
        <ProductHero product={match.product} trustLines={trustLinesByTheme.community} />
      </ThemeProvider>
    );
  },
};

export const ThreeUpSideBySide: Story = {
  name: "Three-up (clinical / wellness / community)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-screen flex-col">
      {(["clinical", "wellness", "community"] as ThemeName[]).map((name) => {
        const match = findProductBySlug(canonical[name])!;
        return (
          <ThemeProvider key={name} theme={name}>
            <div className="border-b border-border">
              <p className="px-6 pt-6 font-mono text-small uppercase tracking-[0.2em] text-muted-foreground">
                {name} · {match.brand.name}
              </p>
              <ProductHero product={match.product} trustLines={trustLinesByTheme[name]} />
            </div>
          </ThemeProvider>
        );
      })}
    </div>
  ),
};
