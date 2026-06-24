/**
 * themeStorage.ts — Theme persistence helper
 *
 * Reads and writes the user's chosen theme to localStorage.
 * Key: healwell.theme → "blue" | "green" | "cream"
 *
 * This is separate from theme.ts (which defines the actual colour values)
 * so that the storage logic and the palette definitions stay independent.
 *
 * Used by:
 * - src/components/ThemeSwitcher.tsx (writes on tap)
 * - src/lib/theme.ts (reads to return active theme)
 * - src/app/layout.tsx (reads to apply theme on load)
 */

export type ThemeName = "blue" | "green" | "cream"

const THEME_KEY = "healwell.theme"
const DEFAULT_THEME: ThemeName = "blue"

export function getThemeName(): ThemeName {
  if (typeof window === "undefined") return DEFAULT_THEME
  return (localStorage.getItem(THEME_KEY) as ThemeName) || DEFAULT_THEME
}

export function setThemeName(name: ThemeName): void {
  localStorage.setItem(THEME_KEY, name)
}