import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@gtmstack/ui";

import "./globals.css";

/**
 * Typography pairing for the Wellness theme (Sprint 1 acceptance criterion #4).
 * - Display: Fraunces — premium serif.
 * - Body: Inter — neutral, readable.
 * - Mono: JetBrains Mono — eyebrows, micro-labels.
 *
 * Each font exposes a CSS variable name that matches what `wellness.ts` references via
 * `var(--font-display, ...)`. The ThemeProvider's token defaults fall back to a system stack
 * when the variable isn't bound, so this layout binding is what actually swaps in Fraunces.
 */
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "GTMStack — Launch a wellness business in hours",
  description:
    "Branded storefront, payments, subscriptions, AI customer operations, compliant fulfillment, provider network, analytics. Operators bring audience. GTMStack runs everything else.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <ThemeProvider theme="wellness" as="div">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
