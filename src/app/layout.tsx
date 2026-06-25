/**
 * layout.tsx — Root Layout
 *
 * Wraps every page with header, footer and BottomNav.
 * Uses suppressHydrationWarning on body to prevent hydration
 * mismatch errors caused by localStorage reads (theme, language)
 * which only run on the client, not the server.
 *
 * Header colours are hardcoded to blue theme defaults here —
 * ThemeSwitcher and LanguageToggle handle their own client-side
 * theme reads after mount.
 *
 * Fonts: Inter via Next.js font optimisation.
 * Colours: src/lib/theme.ts (3 themes: blue, green, cream)
 * Strings: src/i18n/strings.ts via components
 */

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomNav from "@/components/BottomNav"
import LanguageToggle from "@/components/LanguageToggle"
import ThemeSwitcher from "@/components/ThemeSwitcher"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "HealWell",
  description:
    "Recovery and wellness app for people who stand all day at work.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.variable}
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "var(--font-inter), sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          id="app-root"
          style={{
            maxWidth: "430px",
            margin: "0 auto",
            minHeight: "100vh",
            background: "#FFFFFF",
            position: "relative",
          }}
        >
          {/* ── Top header ── */}
          <header
            style={{
              padding: "0 14px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 40,
              background: "#D6ECFA",
              borderBottom: "0.5px solid rgba(74, 159, 212, 0.22)",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                fontSize: "17px",
                fontWeight: 500,
                letterSpacing: "-0.3px",
                color: "#0D2E42",
                flexShrink: 0,
              }}
            >
              HealWell
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0px",
                flexShrink: 0,
              }}
            >
              <ThemeSwitcher />
              <LanguageToggle />
            </div>
          </header>

          {/* ── Page content ── */}
          <main
            style={{
              padding: "20px 16px 0",
              minHeight: "calc(100vh - 140px)",
              background: "#EDF6FF",
            }}
          >
            {children}
          </main>

          {/* ── Footer ── */}
          <footer
            style={{
              padding: "20px 16px",
              textAlign: "center",
              borderTop: "0.5px solid #D6ECFA",
              marginTop: "24px",
              background: "#FFFFFF",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: "#5A9EC0",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              © 2026 HealWell. All rights reserved.
              <br />
              General wellness support only, not medical advice.
            </p>
          </footer>

          {/* ── Bottom navigation ── */}
          <BottomNav />
        </div>
      </body>
    </html>
  )
}