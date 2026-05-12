import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@gtmstack/ui";

import "./globals.css";

/**
 * apps/operator runs on port 3001. This is `app.gtmstack.com` — the operator
 * dashboard. The operator is NOT branded; this app uses the wellness theme by
 * default so the chrome reads as GTMStack itself. Operator-owned storefronts
 * are served from apps/storefront with their own brand theme.
 */
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
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
  title: "GTMStack — Operator Dashboard",
  description:
    "Launch your branded wellness business in hours. Storefront, payments, AI, fulfillment, provider network, analytics — built in.",
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
