import type { Meta, StoryObj } from "@storybook/react";
import { ProductIngredients } from "./ProductIngredients";
import { ThemeProvider } from "../theme-provider";
import { findProductBySlug } from "./__fixtures__/demo-brands";
import type { ThemeName } from "../tokens";

const meta: Meta<typeof ProductIngredients> = {
  title: "Sprint 3/ProductIngredients",
  component: ProductIngredients,
};
export default meta;

type Story = StoryObj<typeof ProductIngredients>;

const canonical: Record<ThemeName, string> = {
  wellness: "sleep-stack",
  clinical: "peptide-performance",
  community: "whey-foundation",
};

const headlinePerTheme: Record<ThemeName, string> = {
  wellness: "Every ingredient. Every dose. Every reason it's in there.",
  clinical: "The compounded protocol, in full.",
  community: "What's in the tub — the whole panel, no fluff.",
};

const footnotePerTheme: Record<ThemeName, string> = {
  wellness:
    "Manufactured in NSF-certified, FDA-registered facilities. Third-party tested batch by batch. Certificate of Analysis available in your member portal.",
  clinical:
    "Compounded at a licensed 503A pharmacy partner under prescription. Lot numbers and Certificates of Analysis available in your member portal before shipping.",
  community:
    "Third-party tested every batch. Certificate of Analysis posted to this product page within five days of release.",
};

function renderFor(theme: ThemeName) {
  const product = findProductBySlug(canonical[theme])!.product;
  return (
    <ThemeProvider theme={theme}>
      <ProductIngredients
        eyebrow="What's in it"
        headline={headlinePerTheme[theme]}
        ingredients={product.ingredients ?? []}
        footnote={footnotePerTheme[theme]}
      />
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
          <div className="border-b border-border">
            <p className="px-6 pt-6 font-mono text-small uppercase tracking-[0.2em] text-muted-foreground">
              {name}
            </p>
            <ProductIngredients
              eyebrow="What's in it"
              headline={headlinePerTheme[name]}
              ingredients={findProductBySlug(canonical[name])!.product.ingredients ?? []}
              footnote={footnotePerTheme[name]}
            />
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
