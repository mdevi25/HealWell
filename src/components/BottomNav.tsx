/**
 * BottomNav.tsx — Fixed 5-tab bottom navigation bar
 *
 * Shown on all user-facing pages.
 * Tabs: Home · Check-In · Coach · Story · Trends
 *
 * Hydration fix: returns a static placeholder until mounted on client,
 * since localStorage (language, theme) is not available during SSR.
 * This prevents React hydration mismatch errors.
 *
 * Behaviour:
 * - Active tab highlighted in theme accent colour
 * - Tab labels pulled from i18n strings (update with language)
 * - Spacer div prevents page content hiding behind fixed nav
 * - Admin route (/admin) not included — URL-only access
 *
 * Icons: Tabler Icons webfont (loaded via CDN link)
 * Used in: src/app/layout.tsx (every page)
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { getLanguage } from "@/lib/localStorage"
import { getStrings } from "@/i18n/strings"
import { getTheme } from "@/lib/theme"

const TABS = [
  { key: "home",    href: "/",        icon: "ti-home"              },
  { key: "checkin", href: "/checkin", icon: "ti-clipboard-check"   },
  { key: "coach",   href: "/coach",   icon: "ti-heart-rate-monitor"},
  { key: "story",   href: "/story",   icon: "ti-book"              },
  { key: "trends",  href: "/trends",  icon: "ti-chart-line"        },
] as const

export default function BottomNav() {
  const pathname          = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const theme   = mounted ? getTheme()              : null
  const s       = mounted ? getStrings(getLanguage()) : null

  const labels: Record<string, string> = mounted && s ? {
    home:    s.nav.home,
    checkin: s.nav.checkin,
    coach:   s.nav.coach,
    story:   s.nav.story,
    trends:  s.nav.trends,
  } : {
    home: "", checkin: "", coach: "", story: "", trends: "",
  }

  const accentColor = theme?.accent ?? "#4A9FD4"
  const subtleColor = theme?.textS  ?? "#5A9EC0"
  const bgColor     = theme?.bgCard ?? "#FFFFFF"
  const borderColor = theme?.border ?? "#D6ECFA"

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <nav
        style={{
          position:       "fixed",
          bottom:         0,
          left:           "50%",
          transform:      "translateX(-50%)",
          width:          "100%",
          maxWidth:       "430px",
          background:     bgColor,
          borderTop:      `0.5px solid ${borderColor}`,
          display:        "flex",
          justifyContent: "space-around",
          padding:        "10px 0 18px",
          zIndex:         50,
        }}
      >
        {TABS.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.key}
              href={tab.href}
              style={{
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                gap:            "3px",
                textDecoration: "none",
                minWidth:       "48px",
                minHeight:      "48px",
                justifyContent: "center",
              }}
            >
              <i
                className={`ti ${tab.icon}`}
                style={{
                  fontSize: "22px",
                  color:    active ? accentColor : subtleColor,
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontSize:   "10px",
                  color:      active ? accentColor : subtleColor,
                  fontWeight: active ? 500 : 400,
                }}
              >
                {labels[tab.key]}
              </span>
            </Link>
          )
        })}
      </nav>
      <div style={{ height: "80px" }} />
    </>
  )
}