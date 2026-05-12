/**
 * @gtmstack/ui Tailwind preset.
 *
 * Maps theme CSS variables (set by <ThemeProvider>) to Tailwind theme keys.
 * Apps consume via:
 *
 *   const preset = require('@gtmstack/ui/tailwind-preset');
 *   module.exports = { presets: [preset], content: [...] };
 *
 * Color tokens use Tailwind's `<alpha-value>` placeholder so utility classes like
 * `bg-brand/80` work. CSS vars store space-separated RGB triplets ("94 122 90").
 */
const c = (varName) => `rgb(var(${varName}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: c("--color-background"),
        foreground: c("--color-foreground"),
        muted: {
          DEFAULT: c("--color-muted"),
          foreground: c("--color-muted-foreground"),
        },
        brand: {
          DEFAULT: c("--color-brand"),
          foreground: c("--color-brand-foreground"),
        },
        accent: {
          DEFAULT: c("--color-accent"),
          foreground: c("--color-accent-foreground"),
        },
        border: c("--color-border"),
        destructive: {
          DEFAULT: c("--color-destructive"),
          foreground: c("--color-destructive-foreground"),
        },
      },

      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },

      fontSize: {
        display: ["var(--text-display)", { lineHeight: "var(--leading-display)", letterSpacing: "var(--tracking-display)" }],
        h1: ["var(--text-h1)", { lineHeight: "var(--leading-display)", letterSpacing: "var(--tracking-display)" }],
        h2: ["var(--text-h2)", { lineHeight: "var(--leading-display)", letterSpacing: "var(--tracking-display)" }],
        h3: ["var(--text-h3)", { lineHeight: "var(--leading-display)", letterSpacing: "var(--tracking-display)" }],
        body: ["var(--text-body)", { lineHeight: "var(--leading-body)", letterSpacing: "var(--tracking-body)" }],
        small: ["var(--text-small)", { lineHeight: "var(--leading-body)" }],
      },

      spacing: {
        section: "var(--space-section)",
        stack: "var(--space-stack)",
        inline: "var(--space-inline)",
      },

      maxWidth: {
        container: "var(--container-max)",
      },

      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)",
        image: "var(--radius-image)",
      },

      borderWidth: {
        card: "var(--border-card)",
      },

      boxShadow: {
        card: "var(--shadow-card)",
      },

      transitionDuration: {
        fast: "var(--duration-fast)",
        DEFAULT: "var(--duration)",
        slow: "var(--duration-slow)",
      },

      transitionTimingFunction: {
        themed: "var(--easing)",
      },

      aspectRatio: {
        hero: "var(--aspect-hero)",
      },
    },
  },
  plugins: [],
};
