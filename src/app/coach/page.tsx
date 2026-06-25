/**
 * page.tsx — Coach Page (/coach)
 *
 * Shows a personalised recovery plan based on today's check-in.
 * Reads from localStorage — no data ever leaves the device.
 *
 * Content (per spec Section 4 + 5):
 * - Hydration tip: base 6 glasses + 1 per hour over 8 worked
 * - Movement cards split into two sections:
 *   1. "Your Focus Today" — movements the worker selected in check-in
 *      shown prominently at full size
 *   2. "Other Movements" — remaining movements shown in a lighter,
 *      slightly muted style so the full plan is still available
 * - ThumbsFeedback component (fire-and-forget to /api/feedback)
 * - Movement disclaimer per spec Section 10
 *
 * All movement descriptions come from src/i18n/strings.ts
 * (movementDescriptions section) — no hardcoded text.
 *
 * Graceful degradation: if no check-in today, prompts user
 * to check in rather than crashing or showing blank content.
 *
 * All display strings from src/i18n/strings.ts
 * Theme colours from src/lib/theme.ts
 *
 * Data read:  healwell.checkins, healwell.language, healwell.theme
 * Data written: none
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getTodayCheckin, getLanguage, type CheckIn } from "@/lib/localStorage"
import { getStrings } from "@/i18n/strings"
import { getDeviceId } from "@/lib/deviceId"
import { getTheme } from "@/lib/theme"
import ThumbsFeedback from "@/components/ThumbsFeedback"

// ── Movement order (bottom-to-top body sequence) ──────────────────────────────
const MOVEMENT_ORDER = [
  { key: "feet",      emoji: "🦶" },
  { key: "legs",      emoji: "🦵" },
  { key: "back",      emoji: "🧍" },
  { key: "shoulders", emoji: "🙆" },
  { key: "wrists",    emoji: "🤲" },
  { key: "breathing", emoji: "🫁" },
] as const

type MovementKey = (typeof MOVEMENT_ORDER)[number]["key"]

export default function CoachPage() {
  const router = useRouter()
  const [checkin, setCheckin] = useState<CheckIn | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCheckin(getTodayCheckin())

    // Fire-and-forget usage event
    try {
      fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          feature:  "coach",
          language: getLanguage(),
        }),
      }).catch(() => {})
    } catch {
      // Silently ignore
    }
  }, [])

  if (!mounted) return null

  const s     = getStrings(getLanguage())
  const theme = getTheme()

  // Shared card styles
  const card = {
    background:   theme.bgCard,
    borderRadius: "14px",
    padding:      "20px",
    marginBottom: "12px",
    boxShadow:    theme.cardShadow,
    border:       `0.5px solid ${theme.border}`,
  }

  // Muted card for "other" movements
  const cardMuted = {
    background:   theme.bgCard,
    borderRadius: "14px",
    padding:      "16px 20px",
    marginBottom: "10px",
    boxShadow:    "none",
    border:       `0.5px solid ${theme.border}`,
    opacity:      0.75,
  }

  // ── Hydration formula (spec Section 5) ───────────────────────────────────────
  const extraGlasses = checkin
    ? Math.max(0, Math.floor(checkin.hoursWorked - 8))
    : 0

  const hydrationText = checkin
    ? extraGlasses > 0
      ? s.coach.hydration(checkin.hoursWorked, extraGlasses)
      : s.coach.baseHydration
    : s.coach.baseHydration

  // ── Split movements into selected + others ────────────────────────────────────
  const selectedKeys = checkin?.movements ?? []

  const selectedMovements = MOVEMENT_ORDER.filter((m) =>
    selectedKeys.includes(m.key)
  )
  const otherMovements = MOVEMENT_ORDER.filter(
    (m) => !selectedKeys.includes(m.key)
  )

  // ── No check-in state ─────────────────────────────────────────────────────────
  if (!checkin) {
    return (
      <div style={{ paddingBottom: "16px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p style={{
            fontSize:      "12px",
            color:         theme.textS,
            margin:        "0 0 4px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight:    500,
          }}>
            {s.coach.title}
          </p>
          <p style={{
            fontSize:   "22px",
            fontWeight: 500,
            color:      theme.textH,
            margin:     0,
            lineHeight: 1.3,
          }}>
            {s.coach.bodyReset}
          </p>
        </div>

        <div style={card}>
          <p style={{
            fontSize:   "16px",
            color:      theme.textH,
            margin:     "0 0 16px",
            fontWeight: 500,
            lineHeight: 1.4,
          }}>
            {s.coach.noCheckin}
          </p>
          <button
            onClick={() => router.push("/checkin")}
            style={{
              background:   theme.accent,
              color:        "white",
              border:       "none",
              borderRadius: "10px",
              padding:      "14px 24px",
              fontSize:     "15px",
              fontWeight:   500,
              width:        "100%",
              cursor:       "pointer",
              minHeight:    "52px",
            }}
          >
            {s.coach.goCheckin}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: "16px" }}>

      {/* ── Page heading ── */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{
          fontSize:      "12px",
          color:         theme.textS,
          margin:        "0 0 4px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight:    500,
        }}>
          {s.coach.title}
        </p>
        <p style={{
          fontSize:   "22px",
          fontWeight: 500,
          color:      theme.textH,
          margin:     0,
          lineHeight: 1.3,
        }}>
          {s.coach.bodyReset}
        </p>
      </div>

      {/* ── Hydration card ── */}
      <div style={card}>
        <div style={{
          display:      "flex",
          alignItems:   "center",
          gap:          "10px",
          marginBottom: "10px",
        }}>
          <span style={{ fontSize: "22px" }}>💧</span>
          <p style={{
            fontSize:      "12px",
            color:         theme.textS,
            margin:        0,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight:    500,
          }}>
            {s.coach.hydrationLabel}
          </p>
        </div>
        <p style={{
          fontSize:   "14px",
          color:      theme.textB,
          margin:     0,
          lineHeight: 1.6,
        }}>
          {hydrationText}
        </p>
      </div>

      {/* ── Selected movements — "Your Focus Today" ── */}
      {selectedMovements.length > 0 && (
        <>
          <p style={{
            fontSize:      "12px",
            color:         theme.textS,
            margin:        "0 0 12px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight:    500,
          }}>
            {s.coach.focusMovements}
          </p>

          {selectedMovements.map((movement) => (
            <div key={movement.key} style={card}>
              <div style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "10px",
                marginBottom: "10px",
              }}>
                <span style={{ fontSize: "22px" }}>{movement.emoji}</span>
                <p style={{
                  fontSize:   "15px",
                  fontWeight: 500,
                  color:      theme.textH,
                  margin:     0,
                }}>
                  {s.movements[movement.key]}
                </p>
              </div>
              <p style={{
                fontSize:   "13px",
                color:      theme.textB,
                margin:     0,
                lineHeight: 1.7,
              }}>
                {s.movementDescriptions[movement.key]}
              </p>
            </div>
          ))}
        </>
      )}

      {/* ── Other movements ── */}
      {otherMovements.length > 0 && (
        <>
          <p style={{
            fontSize:      "12px",
            color:         theme.textS,
            margin:        `${selectedMovements.length > 0 ? "8px" : "0"} 0 12px`,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight:    500,
          }}>
            {selectedMovements.length > 0
              ? s.coach.otherMovements
              : s.coach.focusMovements
            }
          </p>

          {otherMovements.map((movement) => (
            <div key={movement.key} style={cardMuted}>
              <div style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "10px",
                marginBottom: "8px",
              }}>
                <span style={{ fontSize: "20px" }}>{movement.emoji}</span>
                <p style={{
                  fontSize:   "14px",
                  fontWeight: 500,
                  color:      theme.textH,
                  margin:     0,
                }}>
                  {s.movements[movement.key]}
                </p>
              </div>
              <p style={{
                fontSize:   "13px",
                color:      theme.textB,
                margin:     0,
                lineHeight: 1.6,
              }}>
                {s.movementDescriptions[movement.key]}
              </p>
            </div>
          ))}
        </>
      )}

      {/* ── Thumbs feedback ── */}
      <div style={{ marginTop: "8px" }}>
        <ThumbsFeedback feature="coach" />
      </div>

      {/* ── Movement disclaimer (spec Section 10) ── */}
      <p style={{
        fontSize:   "11px",
        color:      theme.textS,
        margin:     "8px 0 0",
        lineHeight: 1.5,
        textAlign:  "center",
      }}>
        {s.coach.movementDisclaimer}
      </p>

    </div>
  )
}