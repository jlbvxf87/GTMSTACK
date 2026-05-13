import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@gtmstack/ui";

import "./globals.css";

/**
 * apps/provider runs on port 3003. This is `providers.gtmstack.com` — the
 * physician review portal. The chrome is GTMStack-branded (clinical theme)
 * because providers are network partners, not operator employees, and the
 * portal is the same across every operator they review for.
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
  title: "GTMStack — Provider Portal",
  description:
    "Review intakes, approve treatment plans, message patients. The clinical review surface for GTMStack network physicians.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider theme="clinical">{children}</ThemeProvider>
      </body>
    </html>
  );
}
