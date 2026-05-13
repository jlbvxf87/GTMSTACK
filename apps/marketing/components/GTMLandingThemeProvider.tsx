import { ThemeProvider, wellness, type Theme } from "@gtmstack/ui";
import type { ReactNode } from "react";

/**
 * Wraps the GTMStack landing in a theme where `brand` and `accent` are both
 * black. Every downstream @gtmstack/ui component (FAQAccordion, SiteFooter,
 * TryBrandVoice's active-preset chip, the "Verified purchase" / "Popular"
 * pills) renders in pure B&W instead of inheriting wellness's sage/gold.
 *
 * The wellness theme is otherwise preserved (typography, spacing, radii)
 * so layouts don't shift.
 */
const gtmstackBwTheme: Theme = {
  ...wellness,
  colors: {
    ...wellness.colors,
    brand: "0 0 0",
    brandForeground: "255 255 255",
    accent: "0 0 0",
    accentForeground: "255 255 255",
  },
};

export function GTMLandingThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={gtmstackBwTheme} as="div">
      {children}
    </ThemeProvider>
  );
}
