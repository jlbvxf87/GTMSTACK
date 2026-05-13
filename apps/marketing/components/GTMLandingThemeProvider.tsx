import { ThemeProvider, wellness, type Theme } from "@gtmstack/ui";
import type { ReactNode } from "react";

/**
 * Pure B&W theme for the GTMStack marketing landing.
 *
 * Clones the wellness theme's typography / spacing / radii so layout doesn't
 * shift, but overrides every color to pure black, white, or neutral gray.
 * No cream backgrounds, no sage accents, no terracotta. Every downstream
 * @gtmstack/ui component (FAQAccordion, SiteFooter, TryBrandVoice) inherits
 * this and renders in B&W.
 */
const gtmstackBwTheme: Theme = {
  ...wellness,
  colors: {
    background: "255 255 255",
    foreground: "10 10 10",
    muted: "255 255 255",
    mutedForeground: "82 82 82",
    brand: "0 0 0",
    brandForeground: "255 255 255",
    accent: "0 0 0",
    accentForeground: "255 255 255",
    border: "0 0 0",
    destructive: "200 30 30",
    destructiveForeground: "255 255 255",
  },
};

export function GTMLandingThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={gtmstackBwTheme} as="div">
      {children}
    </ThemeProvider>
  );
}
