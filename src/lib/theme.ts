/**
 * theme.ts — HealWell colour palettes
 *
 * Defines 3 calm themes a worker can choose from:
 * - blue   → Noor blue (default) — cool, calm, focused
 * - green  → Sage green — grounded, restful, nature
 * - cream  → Warm cream — soft, gentle, easy on tired eyes
 *
 * All hex values live here only — never hardcode colours in components.
 * Components import { getTheme } and use theme.accent, theme.textH etc.
 *
 * Theme selection is persisted via src/lib/themeStorage.ts
 * (healwell.theme in localStorage).
 *
 * Risk level colours are shared across all themes — they carry
 * semantic meaning (low/moderate/high) that must stay consistent.
 */

import { getThemeName, type ThemeName } from "@/lib/themeStorage"

// ── Shared risk colours (same across all themes) ─────────────────────────────
const risk = {
  riskLow: "#10b981",
  riskLowBg: "#ecfdf5",
  riskModerate: "#f59e0b",
  riskModerateBg: "#fffbeb",
  riskHigh: "#ef4444",
  riskHighBg: "#fef2f2",
}

// ── Blue theme (default) — sourced from Noor blue palette ────────────────────
const themeBlue = {
  name: "blue" as ThemeName,
  bg: "#EDF6FF",
  bgBand: "#D6ECFA",
  bgCard: "#FFFFFF",
  accent: "#4A9FD4",
  accentDeep: "#2B7BAD",
  textH: "#0D2E42",
  textB: "#1A5272",
  textM: "#2B7BAD",
  textS: "#5A9EC0",
  border: "#D6ECFA",
  accentLight: "rgba(74, 159, 212, 0.12)",
  accentLine: "rgba(74, 159, 212, 0.22)",
  cardShadow: "0 2px 16px rgba(74, 159, 212, 0.12)",
  dotColor: "#4A9FD4",
  ...risk,
}

// ── Green theme — sage, grounded, restful ────────────────────────────────────
const themeGreen = {
  name: "green" as ThemeName,
  bg: "#EDF7F2",
  bgBand: "#C8EAD8",
  bgCard: "#FFFFFF",
  accent: "#4A9E7A",
  accentDeep: "#2B7A4A",
  textH: "#0D2E1A",
  textB: "#1A5230",
  textM: "#2B7A4A",
  textS: "#5A9E7A",
  border: "#C8EAD8",
  accentLight: "rgba(74, 158, 122, 0.12)",
  accentLine: "rgba(74, 158, 122, 0.22)",
  cardShadow: "0 2px 16px rgba(74, 158, 122, 0.12)",
  dotColor: "#4A9E7A",
  ...risk,
}

// ── Cream theme — warm, gentle, easy on tired eyes ───────────────────────────
const themeCream = {
  name: "cream" as ThemeName,
  bg: "#FDFAF4",
  bgBand: "#EDE4CC",
  bgCard: "#FFFFFF",
  accent: "#C8A97A",
  accentDeep: "#7A5820",
  textH: "#3D2E0D",
  textB: "#5C4420",
  textM: "#7A5820",
  textS: "#A07840",
  border: "#EDE4CC",
  accentLight: "rgba(200, 169, 122, 0.12)",
  accentLine: "rgba(200, 169, 122, 0.22)",
  cardShadow: "0 2px 16px rgba(200, 169, 122, 0.15)",
  dotColor: "#C8A97A",
  ...risk,
}

// ── Theme map ────────────────────────────────────────────────────────────────
export const themes = {
  blue: themeBlue,
  green: themeGreen,
  cream: themeCream,
} as const

export type Theme = typeof themeBlue

// ── Active theme helper ───────────────────────────────────────────────────────
// Returns the full theme object for the currently selected theme.
// Falls back to blue if nothing is stored.
export function getTheme(): Theme {
  const name = getThemeName()
  return themes[name] ?? themeBlue
}

// Default export for convenience — use getTheme() in client components
// so the theme updates reactively when the user switches.
export const theme = themeBlue