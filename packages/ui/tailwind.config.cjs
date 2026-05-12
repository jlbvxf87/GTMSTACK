const preset = require("./tailwind-preset.cjs");

/**
 * Local Tailwind config for `packages/ui` — used by Storybook (and any other
 * direct consumer of this package's build). Apps have their own tailwind.config
 * that extends the same preset; this file exists so Storybook compiles utilities
 * for the components in src/.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./.storybook/**/*.{ts,tsx}",
  ],
};
