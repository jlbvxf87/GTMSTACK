const uiPreset = require("@gtmstack/ui/tailwind-preset");
const base = require("@gtmstack/config/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...base,
  presets: [uiPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
