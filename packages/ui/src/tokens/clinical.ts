import type { Theme } from "./types";

/**
 * Clinical Performance — dark backgrounds, electric accents, sharp typography, minimal motion.
 * Operator type: med spas, hormone clinics, performance-driven providers.
 */
export const clinical: Theme = {
  name: "clinical",

  colors: {
    background: "10 12 16",
    foreground: "237 240 246",
    muted: "20 24 32",
    mutedForeground: "160 168 184",
    brand: "0 224 255",
    brandForeground: "8 10 14",
    accent: "120 255 198",
    accentForeground: "8 10 14",
    border: "32 38 50",
    destructive: "255 96 96",
    destructiveForeground: "8 10 14",
  },

  typography: {
    displayFamily: "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
    bodyFamily: "var(--font-body, 'Inter', system-ui, sans-serif)",
    monoFamily: "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)",
    scale: {
      display: "clamp(3rem, 6vw + 1rem, 5.5rem)",
      h1: "clamp(2.25rem, 3vw + 1rem, 3.5rem)",
      h2: "clamp(1.75rem, 2vw + 1rem, 2.5rem)",
      h3: "clamp(1.25rem, 1vw + 1rem, 1.625rem)",
      body: "1rem",
      small: "0.875rem",
    },
    leading: {
      display: "1.02",
      body: "1.55",
    },
    tracking: {
      display: "-0.04em",
      body: "0em",
    },
  },

  spacing: {
    section: "clamp(5rem, 8vw, 8rem)",
    stack: "1.25rem",
    inline: "0.75rem",
    containerMax: "1240px",
  },

  card: {
    radius: "0.25rem",
    borderWidth: "1px",
    shadow: "0 1px 0 0 rgb(0 224 255 / 0.06), 0 0 0 1px rgb(255 255 255 / 0.04)",
  },

  button: {
    radius: "0.25rem",
    weight: 600,
    paddingY: "0.75rem",
    paddingX: "1.25rem",
    hover: "glow",
  },

  image: {
    radius: "0.25rem",
    filter: "saturate(1.05) contrast(1.05)",
    aspectHero: "16 / 10",
  },

  motion: {
    durationFast: "120ms",
    duration: "180ms",
    durationSlow: "260ms",
    easing: "cubic-bezier(0.2, 0.7, 0.1, 1)",
    intensity: "minimal",
  },
};
