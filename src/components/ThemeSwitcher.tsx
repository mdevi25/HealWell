/**
 * ThemeSwitcher.tsx — Theme selection dots in the header
 *
 * Renders 3 small coloured dots (blue · green · cream) in the top header.
 * Sits alongside the LanguageToggle — both vertically centred.
 *
 * Design:
 * - 14px dots with 44px invisible tap targets for accessibility
 * - Active dot has an outline ring in the theme's deep accent colour
 * - Inactive dots have a subtle grey ring
 *
 * Behaviour:
 * - Reads current theme from localStorage (healwell.theme) on mount
 * - On tap: writes new theme to localStorage, reloads page to
 *   re-apply all inline theme styles across every component
 *
 * Themes: blue (default) | green | cream
 * Colours: src/lib/theme.ts
 * Storage: src/lib/themeStorage.ts
 *
 * Used in: src/app/layout.tsx (top header, every page)
 */

"use client"

import { useState, useEffect } from "react"
import { themes } from "@/lib/theme"
import { getThemeName, setThemeName, type ThemeName } from "@/lib/themeStorage"

const THEME_LIST: ThemeName[] = ["blue", "green", "cream"]

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState<ThemeName>("blue")

  useEffect(() => {
    setCurrent(getThemeName())
  }, [])

  function handleSwitch(name: ThemeName) {
    setThemeName(name)
    setCurrent(name)
    window.location.reload()
  }

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "2px" }}
      aria-label="Choose colour theme"
    >
      {THEME_LIST.map((name) => {
        const isActive = current === name
        return (
          <button
            key={name}
            onClick={() => handleSwitch(name)}
            aria-label={`Switch to ${name} theme`}
            aria-pressed={isActive}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: themes[name].dotColor,
                display: "block",
                outline: isActive
                  ? `2.5px solid ${themes[name].accentDeep}`
                  : "2px solid rgba(0,0,0,0.08)",
                outlineOffset: "2px",
              }}
            />
          </button>
        )
      })}
    </div>
  )
}