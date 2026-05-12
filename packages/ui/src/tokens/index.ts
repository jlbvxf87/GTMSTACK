import { clinical } from "./clinical";
import { community } from "./community";
import type { Theme, ThemeName } from "./types";
import { wellness } from "./wellness";

export type { Theme, ThemeName, ColorTokens, TypographyTokens, SpacingTokens, CardTokens, ButtonTokens, ImageTokens, MotionTokens } from "./types";
export { clinical, wellness, community };

export const themes: Record<ThemeName, Theme> = {
  clinical,
  wellness,
  community,
};

export function getTheme(name: ThemeName): Theme {
  return themes[name];
}
