import type { CSSProperties, ReactNode, ElementType } from "react";
import type { Theme, ThemeName } from "./tokens";
import { getTheme } from "./tokens";

type Props = {
  /** Either a theme name (`"wellness"`) or a fully-resolved `Theme` object. */
  theme: Theme | ThemeName;
  children: ReactNode;
  /** Render as. Defaults to `<div>`. Use `"body"` only for the app root in apps/storefront. */
  as?: ElementType;
  className?: string;
};

/**
 * ThemeProvider — server component. Emits the active theme as CSS variables on a
 * wrapper element. All token consumption (Tailwind classes, raw `var(--...)` refs)
 * resolves against this scope.
 *
 * No client JS, no React context. Themes change at the wrapper level — server-rendered.
 */
export function ThemeProvider({ theme, children, as: Tag = "div", className }: Props) {
  const t = typeof theme === "string" ? getTheme(theme) : theme;
  return (
    <Tag
      data-theme={t.name}
      data-motion-intensity={t.motion.intensity}
      data-button-hover={t.button.hover}
      className={className}
      style={themeToCssVars(t)}
    >
      {children}
    </Tag>
  );
}

function themeToCssVars(t: Theme): CSSProperties {
  const vars: Record<string, string | number> = {
    // colors — space-separated RGB triplets for Tailwind `<alpha-value>` support.
    "--color-background": t.colors.background,
    "--color-foreground": t.colors.foreground,
    "--color-muted": t.colors.muted,
    "--color-muted-foreground": t.colors.mutedForeground,
    "--color-brand": t.colors.brand,
    "--color-brand-foreground": t.colors.brandForeground,
    "--color-accent": t.colors.accent,
    "--color-accent-foreground": t.colors.accentForeground,
    "--color-border": t.colors.border,
    "--color-destructive": t.colors.destructive,
    "--color-destructive-foreground": t.colors.destructiveForeground,

    // typography
    "--font-display": t.typography.displayFamily,
    "--font-body": t.typography.bodyFamily,
    "--font-mono": t.typography.monoFamily,
    "--text-display": t.typography.scale.display,
    "--text-h1": t.typography.scale.h1,
    "--text-h2": t.typography.scale.h2,
    "--text-h3": t.typography.scale.h3,
    "--text-body": t.typography.scale.body,
    "--text-small": t.typography.scale.small,
    "--leading-display": t.typography.leading.display,
    "--leading-body": t.typography.leading.body,
    "--tracking-display": t.typography.tracking.display,
    "--tracking-body": t.typography.tracking.body,

    // spacing
    "--space-section": t.spacing.section,
    "--space-stack": t.spacing.stack,
    "--space-inline": t.spacing.inline,
    "--container-max": t.spacing.containerMax,

    // card
    "--radius-card": t.card.radius,
    "--border-card": t.card.borderWidth,
    "--shadow-card": t.card.shadow,

    // button
    "--radius-button": t.button.radius,
    "--weight-button": t.button.weight,
    "--py-button": t.button.paddingY,
    "--px-button": t.button.paddingX,

    // image
    "--radius-image": t.image.radius,
    "--filter-image": t.image.filter,
    "--aspect-hero": t.image.aspectHero,

    // motion
    "--duration-fast": t.motion.durationFast,
    "--duration": t.motion.duration,
    "--duration-slow": t.motion.durationSlow,
    "--easing": t.motion.easing,

    // surface defaults applied at the provider level so unstyled regions still read correctly.
    backgroundColor: `rgb(${t.colors.background})`,
    color: `rgb(${t.colors.foreground})`,
    fontFamily: t.typography.bodyFamily,
  };
  return vars as CSSProperties;
}
