/**
 * Tailwind base config. The theme-aware preset lives in @gtmstack/ui/tailwind-preset.
 * Apps extend BOTH: this base for content scanning + plugins, and the ui preset for tokens.
 */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
