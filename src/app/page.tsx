/**
 * page.tsx — Home Page (/)
 *
 * The first screen a worker sees when opening HealWell after a shift.
 * Reads today's check-in from localStorage and renders one of two states:
 *
 * State 1 — No check-in yet today:
 *   Greeting + tagline + info card + "Start Check-In" CTA button
 *
 * State 2 — Check-in already done today:
 *   Greeting + recovery score card (colour-coded by risk level)
 *   + "See Recovery Plan" CTA + "Update check-in" secondary action
 *
 * Design follows the Noor reference:
 * - White cards on themed background
 * - Soft card shadow for elevation
 * - Small uppercase section labels
 * - Generous whitespace
 * - Accessible colour contrast on all risk levels
 *
 * Also fires an anonymous usage event (fire-and-forget).
 * No health data sent — only feature name, language, deviceId.
 *
 * Data read:  healwell.checkins, healwell.language, healwell.theme
 * Data written: none
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getTodayCheckin,
  getLanguage,
  type CheckIn,
} from "@/lib/localStorage"
import { getStrings } from "@/i18n/strings"
import { getDeviceId } from "@/lib/deviceId"
import { getTheme } from "@/lib/theme"

export default function HomePage() {
  const router = useRouter()
  const [checkin, setCheckin] = useState<CheckIn | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCheckin(getTodayCheckin())

    // Fire-and-forget usage event — never blocks UI (spec Section 13.3)
    try {
      fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          feature: "home",
          language: getLanguage(),
        }),
      }).catch(() => {})
    } catch {
      // Silently ignore
    }
  }, [])

  // Avoid hydration mismatch — localStorage is client-only
  if (!mounted) return null

  const s = getStrings(getLanguage())
  const theme = getTheme()

  // Risk level colour mapping
  const riskColour: Record<string, string> = {
    low: theme.riskLow,
    moderate: theme.riskModerate,
    high: theme.riskHigh,
  }
  const riskBg: Record<string, string> = {
    low: theme.riskLowBg,
    moderate: theme.riskModerateBg,
    high: theme.riskHighBg,
  }

  return (
    <div style={{ paddingBottom: "16px" }}>

      {/* ── Greeting ── */}
      <div style={{ marginBottom: "20px" }}>
        <p
          style={{
            fontSize: "12px",
            color: theme.textS,
            margin: "0 0 4px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          {s.home.greeting}
        </p>
        <p
          style={{
            fontSize: "22px",
            fontWeight: 500,
            color: theme.textH,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {s.home.tagline}
        </p>
      </div>

      {/* ── State 1: No check-in yet ── */}
      {!checkin && (
        <div>
          {/* Info card */}
          <div
            style={{
              background: theme.bgCard,
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "16px",
              boxShadow: theme.cardShadow,
              border: `0.5px solid ${theme.border}`,
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: theme.textS,
                margin: "0 0 8px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 500,
              }}
            >
              Today's Check-In
            </p>
            <p
              style={{
                fontSize: "16px",
                color: theme.textH,
                margin: "0 0 8px",
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {s.home.noCheckin}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: theme.textB,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              A quick check-in takes about 60 seconds and unlocks
              your personalised recovery plan.
            </p>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => router.push("/checkin")}
            style={{
              background: theme.accent,
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: 500,
              width: "100%",
              cursor: "pointer",
              minHeight: "56px",
              letterSpacing: "-0.1px",
            }}
          >
            {s.home.startCheckin}
          </button>
        </div>
      )}

      {/* ── State 2: Check-in done today ── */}
      {checkin && (
        <div>

          {/* Recovery score card */}
          <div
            style={{
              background: theme.bgCard,
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "14px",
              boxShadow: theme.cardShadow,
              border: `0.5px solid ${theme.border}`,
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: theme.textS,
                margin: "0 0 16px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 500,
              }}
            >
              {s.home.score}
            </p>

            {/* Score display */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              {/* Big number */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: riskBg[checkin.riskLevel],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  border: `2px solid ${riskColour[checkin.riskLevel]}33`,
                }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: 500,
                    color: riskColour[checkin.riskLevel],
                    lineHeight: 1,
                  }}
                >
                  {checkin.recoveryScore}
                </span>
              </div>

              {/* Risk label + summary */}
              <div>
                <span
                  style={{
                    display: "inline-block",
                    background: riskColour[checkin.riskLevel] + "18",
                    color: riskColour[checkin.riskLevel],
                    borderRadius: "20px",
                    padding: "4px 14px",
                    fontSize: "13px",
                    fontWeight: 500,
                    marginBottom: "6px",
                  }}
                >
                  {s.home.risk[checkin.riskLevel]} risk
                </span>
                <p
                  style={{
                    fontSize: "13px",
                    color: theme.textB,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Based on {checkin.hoursWorked}h worked,{" "}
                  {checkin.sleepHours}h sleep, energy {checkin.energy}/10
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <p
              style={{
                fontSize: "11px",
                color: theme.textS,
                margin: 0,
                lineHeight: 1.5,
                borderTop: `0.5px solid ${theme.border}`,
                paddingTop: "12px",
              }}
            >
              {s.checkin.disclaimer}
            </p>
          </div>

          {/* Check-in done badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
              padding: "12px 16px",
              background: theme.bgCard,
              borderRadius: "12px",
              border: `0.5px solid ${theme.border}`,
              boxShadow: theme.cardShadow,
            }}
          >
            <span style={{ fontSize: "20px" }}>✅</span>
            <p
              style={{
                fontSize: "14px",
                color: theme.textB,
                margin: 0,
                fontWeight: 500,
              }}
            >
              {s.home.checkinDone}
            </p>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => router.push("/coach")}
            style={{
              background: theme.accent,
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: 500,
              width: "100%",
              cursor: "pointer",
              minHeight: "56px",
              marginBottom: "10px",
              letterSpacing: "-0.1px",
            }}
          >
            {s.home.viewCoach}
          </button>

          {/* Secondary — update check-in */}
          <button
            onClick={() => router.push("/checkin")}
            style={{
              background: "none",
              border: `0.5px solid ${theme.border}`,
              borderRadius: "12px",
              padding: "14px 24px",
              fontSize: "14px",
              color: theme.textM,
              width: "100%",
              cursor: "pointer",
              minHeight: "48px",
            }}
          >
            Update today's check-in
          </button>
        </div>
      )}
    </div>
  )
}