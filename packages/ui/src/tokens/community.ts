import type { Theme } from "./types";

/**
 * Community — bold high-energy colors, condensed typography, denser layouts, more visible motion.
 * Operator type: gyms, fitness communities, audience-driven supplement brands.
 */
export const community: Theme = {
  name: "community",

  colors: {
    background: "255 252 245",
    foreground: "18 18 22",
    muted: "246 240 228",
    mutedForeground: "82 78 88",
    brand: "242 60 30",
    brandForeground: "255 252 245",
    accent: "26 26 30",
    accentForeground: "255 252 245",
    border: "232 224 208",
    destructive: "200 32 24",
    destructiveForeground: "255 252 245",
  },

  typography: {
    displayFamily: "var(--font-display, 'Anton', 'Bebas Neue', 'Impact', sans-serif)",
    bodyFamily: "var(--font-body, 'Inter', system-ui, sans-serif)",
    monoFamily: "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)",
    scale: {
      display: "clamp(3.5rem, 9vw + 1rem, 7rem)",
      h1: "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
      h2: "clamp(2rem, 3vw + 1rem, 3rem)",
      h3: "clamp(1.5rem, 1.5vw + 1rem, 2rem)",
      body: "1rem",
      small: "0.875rem",
    },
    leading: {
      display: "0.95",
      body: "1.5",
    },
    tracking: {
      display: "0.005em",
      body: "0em",
    },
  },

  spacing: {
    section: "clamp(4.5rem, 7vw, 7.5rem)",
    stack: "1rem",
    inline: "0.75rem",
    containerMax: "1320px",
  },

  card: {
    radius: "0.5rem",
    borderWidth: "2px",
    shadow: "6px 6px 0 0 rgb(18 18 22 / 1)",
  },

  button: {
    radius: "0.5rem",
    weight: 700,
    paddingY: "0.875rem",
    paddingX: "1.5rem",
    hover: "fill",
  },

  image: {
    radius: "0.5rem",
    filter: "saturate(1.1) contrast(1.08)",
    aspectHero: "3 / 2",
  },

  motion: {
    durationFast: "100ms",
    duration: "160ms",
    durationSlow: "240ms",
    easing: "cubic-bezier(0.5, 1.6, 0.4, 1)",
    intensity: "visible",
  },
};
