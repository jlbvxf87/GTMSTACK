/**
 * Theme token schema.
 *
 * One codebase, three theme configurations — the depth of this token system is what makes
 * operator stores feel like different companies built them rather than the same template
 * wearing different paint. (See docs/CLAUDE.md.)
 *
 * Colors are stored as space-separated RGB triplets (e.g. "248 245 240") so they can be
 * consumed by Tailwind's `<alpha-value>` modifier: `rgb(var(--color-brand) / <alpha-value>)`.
 */

export type ThemeName = "clinical" | "wellness" | "community";

export interface ColorTokens {
  /** Page background. */
  background: string;
  /** Default text on background. */
  foreground: string;
  /** Lower-contrast surface (cards, sidebars). */
  muted: string;
  /** Text on muted surfaces. */
  mutedForeground: string;
  /** Brand primary (CTAs, links, the dominant accent). */
  brand: string;
  /** Text on brand surfaces. */
  brandForeground: string;
  /** Secondary accent (tags, highlights, supporting marks). */
  accent: string;
  /** Text on accent surfaces. */
  accentForeground: string;
  /** Hairline borders, dividers. */
  border: string;
  /** Destructive / error. */
  destructive: string;
  /** Text on destructive. */
  destructiveForeground: string;
}

export interface TypographyTokens {
  /** Display family — headlines, hero, marketing. */
  displayFamily: string;
  /** Body family — paragraphs, UI. */
  bodyFamily: string;
  /** Mono family — code, numerics. */
  monoFamily: string;
  /** Fluid scale (CSS clamp values or static rems). */
  scale: {
    display: string;
    h1: string;
    h2: string;
    h3: string;
    body: string;
    small: string;
  };
  leading: {
    display: string;
    body: string;
  };
  tracking: {
    display: string;
    body: string;
  };
}

export interface SpacingTokens {
  /** Section vertical padding. */
  section: string;
  /** Stack gap between sibling blocks. */
  stack: string;
  /** Inline gap inside rows. */
  inline: string;
  /** Max content width. */
  containerMax: string;
}

export interface CardTokens {
  radius: string;
  borderWidth: string;
  shadow: string;
}

export interface ButtonTokens {
  radius: string;
  weight: number;
  paddingY: string;
  paddingX: string;
  /** Hover behavior philosophy — used by components to choose a hover effect. */
  hover: "lift" | "glow" | "underline" | "fill";
}

export interface ImageTokens {
  radius: string;
  /** CSS filter applied to brand imagery. */
  filter: string;
  /** Default aspect ratio for hero imagery. */
  aspectHero: string;
}

export interface MotionTokens {
  durationFast: string;
  duration: string;
  durationSlow: string;
  easing: string;
  /** Intensity philosophy — consumed by components to scale animation amplitude. */
  intensity: "minimal" | "gentle" | "visible";
}

export interface Theme {
  name: ThemeName;
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  card: CardTokens;
  button: ButtonTokens;
  image: ImageTokens;
  motion: MotionTokens;
}
