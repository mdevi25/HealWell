/**
 * LanguageToggle.tsx
 *
 * Renders the 4-language switcher (EN / ES / HI / GU) shown in the top
 * header on every page. Each label is written in its own script so users
 * can identify their language without needing to read another language first.
 *
 * Behaviour:
 * - Reads the current language from localStorage (healwell.language)
 * - On tap, writes the new language to localStorage and refreshes the page
 * - The active language is visually highlighted
 *
 * Used in: src/app/layout.tsx (top header, every page)
 */

"use client"

import { useRouter } from "next/navigation"
import { getLanguage, setLanguage, type Language } from "@/lib/localStorage"
import { getStrings } from "@/i18n/strings"

const LANGUAGES: Language[] = ["en", "es", "hi", "gu"]

export default function LanguageToggle() {
  const router = useRouter()
  const current = getLanguage()
  const s = getStrings(current)

  function handleChange(lang: Language) {
    setLanguage(lang)
    router.refresh()
  }

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => handleChange(lang)}
          style={{
            background:
              current === lang
                ? "rgba(255,255,255,0.25)"
                : "rgba(255,255,255,0.08)",
            border: "none",
            borderRadius: "6px",
            color: current === lang ? "white" : "rgba(255,255,255,0.65)",
            fontSize: "11px",
            padding: "5px 7px",
            cursor: "pointer",
            fontWeight: current === lang ? 500 : 400,
            whiteSpace: "nowrap",
          }}
          aria-label={`Switch to ${lang}`}
        >
          {s.languages[lang]}
        </button>
      ))}
    </div>
  )
}
