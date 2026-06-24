/**
 * BottomNav.tsx
 * Fixed 5-tab bottom navigation bar.
 * Palette: Noor blue theme.
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { getLanguage } from "@/lib/localStorage"
import { getStrings } from "@/i18n/strings"
import { theme } from "@/lib/theme"

const TABS = [
  { key: "home",    href: "/",        icon: "ti-home" },
  { key: "checkin", href: "/checkin", icon: "ti-clipboard-check" },
  { key: "coach",   href: "/coach",   icon: "ti-heart-rate-monitor" },
  { key: "story",   href: "/story",   icon: "ti-book" },
  { key: "trends",  href: "/trends",  icon: "ti-chart-line" },
] as const

export default function BottomNav() {
  const pathname = usePathname()
  const s = getStrings(getLanguage())

  const labels: Record<string, string> = {
    home:    s.nav.home,
    checkin: s.nav.checkin,
    coach:   s.nav.coach,
    story:   s.nav.story,
    trends:  s.nav.trends,
  }

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
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "430px",
          background: theme.bgCard,
          borderTop: `0.5px solid ${theme.border}`,
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 0 18px",
          zIndex: 50,
        }}
      >
        {TABS.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.key}
              href={tab.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                textDecoration: "none",
                minWidth: "48px",
                minHeight: "48px",
                justifyContent: "center",
              }}
            >
              <i
                className={`ti ${tab.icon}`}
                style={{
                  fontSize: "22px",
                  color: active ? theme.accent : theme.textS,
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontSize: "10px",
                  color: active ? theme.accent : theme.textS,
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