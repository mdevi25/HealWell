/**
 * layout.tsx — Root Layout
 *
 * Wraps every page in the app with:
 * - Top header: HealWell logo + LanguageToggle
 * - Page content (children)
 * - Footer with disclaimer
 * - BottomNav: 5-tab fixed navigation bar
 *
 * The admin route (/admin) shares this layout visually but the
 * BottomNav filters it out — admin is reached by URL only.
 *
 * Fonts: uses Next.js built-in font optimisation (Inter).
 * All user-facing strings come from i18n/strings.ts via components.
 */

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomNav from "@/components/BottomNav"
import LanguageToggle from "@/components/LanguageToggle"

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
    <html lang="en">
      <body
        className={inter.variable}
        style={{
          margin: 0,
          padding: 0,
          background: "#f9fafb",
          fontFamily: "var(--font-inter), sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* ── Outer centering wrapper ── */}
        <div
          style={{
            maxWidth: "430px",
            margin: "0 auto",
            minHeight: "100vh",
            background: "white",
            position: "relative",
          }}
        >
          {/* ── Top header ── */}
          <header
            style={{
              background: "#0D9488",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 40,
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "18px",
                fontWeight: 500,
                letterSpacing: "-0.3px",
              }}
            >
              HealWell
            </span>
            <LanguageToggle />
          </header>

          {/* ── Page content ── */}
          <main
            style={{
              padding: "20px 16px 0",
              minHeight: "calc(100vh - 140px)",
            }}
          >
            {children}
          </main>

          {/* ── Footer ── */}
          <footer
            style={{
              padding: "20px 16px",
              textAlign: "center",
              borderTop: "0.5px solid #e5e7eb",
              marginTop: "24px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: "#9ca3af",
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
