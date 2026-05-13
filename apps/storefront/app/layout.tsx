import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Fraunces, Space_Grotesk, Anton, JetBrains_Mono } from "next/font/google";

import "./globals.css";

/**
 * Root layout for `apps/storefront`. Loads every theme family's display font
 * so any operator's storefront can render its brand voice in the right
 * typography. The actual `<ThemeProvider>` wrapper happens inside the home
 * page (where we've resolved which operator to render).
 *
 * Each font binds the theme's display CSS variable name; ThemeProvider's
 * `--font-display` token picks up whichever one matches the active theme.
 */
const wellnessDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600"],
});

const clinicalDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const communityDisplay = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
  weight: "400",
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
  title: "GTMStack Storefront",
  description:
    "Operator-branded wellness storefront powered by GTMStack.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={[
        body.variable,
        mono.variable,
        wellnessDisplay.variable,
        clinicalDisplay.variable,
        communityDisplay.variable,
      ].join(" ")}
    >
      <body>{children}</body>
    </html>
  );
}
