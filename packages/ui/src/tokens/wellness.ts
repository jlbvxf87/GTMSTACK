import type { Theme } from "./types";

/**
 * Wellness — warm cream backgrounds, sage / terracotta / warm gold accents,
 * editorial serif typography, gentle motion.
 *
 * This is the Prime Wellness demo brand's theme (premium serif headlines, sage + cream + gold).
 */
export const wellness: Theme = {
  name: "wellness",

  colors: {
    background: "250 246 239",
    foreground: "44 42 38",
    muted: "240 233 222",
    mutedForeground: "108 100 88",
    brand: "94 122 90",
    brandForeground: "250 246 239",
    accent: "196 142 88",
    accentForeground: "44 42 38",
    border: "224 215 200",
    destructive: "176 60 50",
    destructiveForeground: "250 246 239",
  },

  typography: {
    displayFamily: "var(--font-display, 'Fraunces', 'Cormorant Garamond', Georgia, serif)",
    bodyFamily: "var(--font-body, 'Inter', system-ui, sans-serif)",
    monoFamily: "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)",
    scale: {
      display: "clamp(3.25rem, 7vw + 1rem, 6rem)",
      h1: "clamp(2.5rem, 4vw + 1rem, 4rem)",
      h2: "clamp(2rem, 2.5vw + 1rem, 2.75rem)",
      h3: "clamp(1.375rem, 1vw + 1rem, 1.75rem)",
      body: "1.0625rem",
      small: "0.9375rem",
    },
    leading: {
      display: "1.08",
      body: "1.65",
    },
    tracking: {
      display: "-0.02em",
      body: "0em",
    },
  },

  spacing: {
    section: "clamp(6rem, 10vw, 10rem)",
    stack: "1.5rem",
    inline: "1rem",
    containerMax: "1180px",
  },

  card: {
    radius: "1.25rem",
    borderWidth: "1px",
    shadow: "0 1px 2px rgb(44 42 38 / 0.04), 0 8px 24px -12px rgb(44 42 38 / 0.08)",
  },

  button: {
    radius: "999px",
    weight: 500,
    paddingY: "0.875rem",
    paddingX: "1.75rem",
    hover: "lift",
  },

  image: {
    radius: "1.25rem",
    filter: "saturate(0.95) contrast(1.02)",
    aspectHero: "4 / 5",
  },

  motion: {
    durationFast: "220ms",
    duration: "320ms",
    durationSlow: "480ms",
    easing: "cubic-bezier(0.32, 0.72, 0, 1)",
    intensity: "gentle",
  },
};
