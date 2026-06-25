/**
 * LanguageToggle.tsx — 4-language switcher in the header
 *
 * Renders compact language buttons (EN · ES · हिन्दी · ગુજ) in the header.
 * Uses short codes to save horizontal space while remaining recognisable.
 *
 * Hydration fix: returns null until mounted on client, since
 * localStorage is not available during server-side rendering.
 * suppressHydrationWarning prevents React mismatch warnings.
 *
 * Behaviour:
 * - Reads current language from localStorage (healwell.language)
 * - On tap: writes new language to localStorage and refreshes the page
 * - Colours adapt automatically to the active theme via getTheme()
 *
 * Used in: src/app/layout.tsx (top header, every page)
 */

"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getLanguage, setLanguage, type Language } from "@/lib/localStorage"
import { getTheme } from "@/lib/theme"

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN"      },
  { code: "es", label: "ES"      },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજ"    },
]

export default function LanguageToggle() {
  const router  = useRouter()
  const [mounted, setMounted]   = useState(false)
  const [current, setCurrent]   = useState<Language>("en")
  const [theme, setTheme]       = useState(getTheme())

  useEffect(() => {
    setCurrent(getLanguage())
    setTheme(getTheme())
    setMounted(true)
  }, [])

  // Render placeholder with same dimensions to avoid layout shift
  if (!mounted) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "0.5px", height: "20px", background: "rgba(74,159,212,0.3)" }} />
        <div style={{ display: "flex", gap: "3px" }}>
          {LANGUAGES.map(({ code }) => (
            <div
              key={code}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "5px",
                background: "rgba(74,159,212,0.08)",
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  function handleChange(lang: Language) {
    setLanguage(lang)
    setCurrent(lang)
    router.refresh()
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {/* Divider separating theme dots from language buttons */}
      <div style={{
        width:      "0.5px",
        height:     "20px",
        background: theme.accentLine,
        flexShrink: 0,
      }} />

      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
        {LANGUAGES.map(({ code, label }) => {
          const isActive = current === code
          return (
            <button
              key={code}
              onClick={() => handleChange(code)}
              aria-label={`Switch to ${code}`}
              aria-pressed={isActive}
              style={{
                background:   isActive ? theme.accent : theme.accentLight,
                border:       `0.5px solid ${isActive ? theme.accent : theme.accentLine}`,
                borderRadius: "5px",
                color:        isActive ? "white" : theme.textM,
                fontSize:     "10px",
                padding:      "4px 6px",
                cursor:       "pointer",
                fontWeight:   isActive ? 500 : 400,
                whiteSpace:   "nowrap",
                minHeight:    "44px",
                display:      "flex",
                alignItems:   "center",
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}