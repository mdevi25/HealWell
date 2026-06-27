/**
 * page.tsx — Story Page (/story)
 * Fixed: isSuccessful() handles both boolean true and string "True" from n8n
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getTodayCheckin,
  getLanguage,
  getPlan,
  type CheckIn,
} from "@/lib/localStorage"
import { getStrings } from "@/i18n/strings"
import { getDeviceId } from "@/lib/deviceId"
import { getTheme } from "@/lib/theme"
import ThumbsFeedback from "@/components/ThumbsFeedback"
import ProGate from "@/components/ProGate"

interface StoryResponse {
  success:            boolean | string
  shiftStory:         string
  emotionalTheme:     string
  wellnessPattern:    string
  tinyRecoveryAction: string
  disclaimer:         string
}

const ENERGY_EMOJI: Record<number, string> = {
  2:  "😴",
  4:  "😔",
  6:  "😐",
  8:  "🙂",
  10: "⚡",
}

const ENERGY_LABEL: Record<number, string> = {
  2:  "Exhausted",
  4:  "Low",
  6:  "Okay",
  8:  "Good",
  10: "Energised",
}

const WORN_OUT_EMOJI: Record<number, string> = {
  10: "💀",
  8:  "😩",
  6:  "😓",
  4:  "🙂",
  2:  "😊",
}

const WORN_OUT_LABEL: Record<number, string> = {
  10: "Drained",
  8:  "Very worn",
  6:  "Quite a bit",
  4:  "A little",
  2:  "Fine",
}

const MOVEMENT_EMOJI: Record<string, string> = {
  feet:      "🦶",
  legs:      "🦵",
  back:      "🧍",
  shoulders: "🙆",
  wrists:    "🤲",
  breathing: "🫁",
}

const RECOVERY_STATUS = {
  high:     { color: "#ef4444", shadow: "rgba(239,68,68,0.12)",    label: "Your body deserves extra care tonight" },
  moderate: { color: "#f59e0b", shadow: "rgba(245,158,11,0.12)",   label: "A little rest will go a long way" },
  low:      { color: "#10b981", shadow: "rgba(16,185,129,0.12)",   label: "You're in good shape today" },
}

function getMovementNudge(movements: string[]): string {
  if (movements.length === 0) {
    return "Your Coach plan has gentle movements ready whenever you feel like it."
  }
  if (movements.length >= 4) {
    return "Your whole body worked hard today — even five minutes with your Coach movements will make tomorrow easier."
  }

  const labels: Record<string, string> = {
    feet:      "feet",
    legs:      "legs",
    back:      "back",
    shoulders: "shoulders",
    wrists:    "wrists",
    breathing: "breathing",
  }

  const named = movements
    .slice(0, 2)
    .map((m) => labels[m] ?? m)
    .join(" and ")

  const endings: Record<string, string> = {
    feet:      "the gentle movements waiting in your Coach plan will help them finally release.",
    legs:      "the leg movements in your Coach plan will help that pooled blood find its way home.",
    back:      "the gentle hip sway in your Coach plan will help your back unwind.",
    shoulders: "a few slow shoulder rolls before bed will help them let go of the day.",
    wrists:    "gentle wrist circles before sleep will help release that built-up tension.",
    breathing: "the breathing exercise in your Coach plan will help your nervous system settle.",
  }

  const firstMovement = movements[0]
  const ending = endings[firstMovement] ?? "the movements in your Coach plan will help them release."

  return `Your ${named} did the heavy work today — ${ending}`
}

// ── Handles boolean true OR string "True"/"true" returned by n8n ──────────────
function isSuccessful(value: boolean | string): boolean {
  return value === true || value === "True" || value === "true"
}

export default function StoryPage() {
  const router  = useRouter()
  const [checkin, setCheckin]     = useState<CheckIn | null>(null)
  const [mounted, setMounted]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [story, setStory]         = useState<StoryResponse | null>(null)
  const [error, setError]         = useState(false)

  useEffect(() => {
    setMounted(true)
    setCheckin(getTodayCheckin())

    try {
      fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          feature:  "story",
          language: getLanguage(),
        }),
      }).catch(() => {})
    } catch {
      // Silently ignore
    }
  }, [])

  if (!mounted) return null

  const s      = getStrings(getLanguage())
  const theme  = getTheme()
  const plan   = getPlan()
  const isPro  = plan === "pro"

  const card = {
    background:   theme.bgCard,
    borderRadius: "14px",
    padding:      "16px",
    marginBottom: "12px",
    boxShadow:    theme.cardShadow,
    border:       `0.5px solid ${theme.border}`,
  }

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
            {s.story.title}
          </p>
          <p style={{
            fontSize:   "22px",
            fontWeight: 500,
            color:      theme.textH,
            margin:     0,
            lineHeight: 1.3,
          }}>
            Let's reflect on your day.
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
            {s.story.noCheckin}
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
            {s.story.goCheckin}
          </button>
        </div>
      </div>
    )
  }

  const status = RECOVERY_STATUS[checkin.riskLevel]
  const movementNudge = getMovementNudge(checkin.movements)

  async function handleGenerate() {
    setLoading(true)
    setError(false)
    setStory(null)

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
      if (!webhookUrl) throw new Error("No webhook URL configured")

      const payload = {
        deviceId:       getDeviceId(),
        language:       getLanguage(),
        hoursWorked:    checkin!.hoursWorked,
        sleepHours:     checkin!.sleepHours,
        energy:         checkin!.energy,
        wornOut:        checkin!.wornOut,
        movements:      checkin!.movements,
        recoveryStatus: checkin!.riskLevel,
      }

      const res = await fetch(webhookUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Webhook failed")

        const raw = await res.json()
        const data: StoryResponse = Array.isArray(raw) ? raw[0] : raw

      // Handle both boolean true and string "True"/"true" from n8n
      if (!isSuccessful(data.success)) throw new Error("Story generation failed")

      setStory(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

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
          {s.story.title}
        </p>
        <p style={{
          fontSize:   "22px",
          fontWeight: 500,
          color:      theme.textH,
          margin:     0,
          lineHeight: 1.3,
        }}>
          Let's reflect on your day.
        </p>
      </div>

      <div style={card}>
        <p style={{
          fontSize:      "11px",
          color:         theme.textS,
          margin:        "0 0 10px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight:    500,
        }}>
          Your shift at a glance
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: theme.textS }}>Hours worked</span>
            <span style={{ fontSize: "13px", color: theme.textH, fontWeight: 500 }}>{checkin.hoursWorked}h</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: theme.textS }}>Sleep last night</span>
            <span style={{ fontSize: "13px", color: theme.textH, fontWeight: 500 }}>{checkin.sleepHours}h</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: theme.textS }}>Energy · Worn out</span>
            <span style={{ fontSize: "13px", color: theme.textH, fontWeight: 500 }}>
              {ENERGY_EMOJI[checkin.energy] ?? "😐"} {ENERGY_LABEL[checkin.energy] ?? checkin.energy}
              {" · "}
              {WORN_OUT_EMOJI[checkin.wornOut] ?? "😓"} {WORN_OUT_LABEL[checkin.wornOut] ?? checkin.wornOut}
            </span>
          </div>

          {checkin.movements.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: theme.textS }}>Body areas</span>
              <span style={{ fontSize: "13px", color: theme.textH, fontWeight: 500 }}>
                {checkin.movements
                  .slice(0, 3)
                  .map((m) => `${MOVEMENT_EMOJI[m] ?? ""} ${m}`)
                  .join(" · ")}
              </span>
            </div>
          )}

          <div style={{
            borderTop:      `0.5px solid ${theme.border}`,
            paddingTop:     "10px",
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
          }}>
            <span style={{ fontSize: "13px", color: theme.textS }}>How you're doing</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width:        "10px",
                height:       "10px",
                borderRadius: "50%",
                background:   status.color,
                boxShadow:    `0 0 0 3px ${status.shadow}`,
                flexShrink:   0,
              }} />
              <span style={{ fontSize: "13px", color: theme.textH, fontWeight: 500 }}>
                {status.label}
              </span>
            </div>
          </div>

        </div>
      </div>

      {!story && !loading && (
        <>
          <p style={{
            fontSize:   "13px",
            color:      theme.textS,
            margin:     "0 0 14px",
            textAlign:  "center",
            lineHeight: 1.6,
          }}>
            Your story is written from your check-in. No extra questions needed.
          </p>
          <button
            onClick={handleGenerate}
            style={{
              background:     theme.accent,
              color:          "white",
              border:         "none",
              borderRadius:   "12px",
              padding:        "16px 24px",
              fontSize:       "16px",
              fontWeight:     500,
              width:          "100%",
              cursor:         "pointer",
              minHeight:      "56px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "8px",
            }}
          >
            <span>✨</span>
            {s.story.generate}
          </button>
        </>
      )}

      {loading && (
        <div style={{
          background:     theme.accentLight,
          border:         `0.5px solid ${theme.accentLine}`,
          borderRadius:   "12px",
          padding:        "20px",
          textAlign:      "center",
          minHeight:      "56px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            "10px",
        }}>
          <span style={{ fontSize: "20px" }}>✨</span>
          <span style={{ fontSize: "15px", color: theme.accentDeep, fontWeight: 500 }}>
            {s.story.generating}
          </span>
        </div>
      )}

      {error && (
        <div style={{
          ...card,
          border: `0.5px solid ${theme.riskModerate}`,
        }}>
          <p style={{
            fontSize:   "14px",
            color:      theme.textB,
            margin:     "0 0 14px",
            lineHeight: 1.5,
          }}>
            {s.story.error}
          </p>
          <button
            onClick={handleGenerate}
            style={{
              background:   theme.accent,
              color:        "white",
              border:       "none",
              borderRadius: "10px",
              padding:      "12px 24px",
              fontSize:     "14px",
              fontWeight:   500,
              width:        "100%",
              cursor:       "pointer",
              minHeight:    "48px",
            }}
          >
            Try again
          </button>
        </div>
      )}

      {story && (
        <>
          {isPro && (
            <div style={{
              ...card,
              background: theme.accentLight,
              border:     `0.5px solid ${theme.accentLine}`,
            }}>
              <p style={{
                fontSize:   "13px",
                color:      theme.accentDeep,
                margin:     "0 0 4px",
                fontWeight: 500,
              }}>
                {story.emotionalTheme}
              </p>
              <p style={{
                fontSize:   "13px",
                color:      theme.textM,
                margin:     0,
                lineHeight: 1.5,
              }}>
                {story.wellnessPattern}
              </p>
            </div>
          )}

          <div style={card}>
            <p style={{
              fontSize:      "11px",
              color:         theme.textS,
              margin:        "0 0 10px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight:    500,
            }}>
              {s.story.title}
            </p>
            <p style={{
              fontSize:   "14px",
              color:      theme.textB,
              margin:     0,
              lineHeight: 1.8,
            }}>
              {story.shiftStory}
            </p>
          </div>

          <div style={{
            ...card,
            display:    "flex",
            alignItems: "flex-start",
            gap:        "12px",
          }}>
            <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "1px" }}>🌿</span>
            <div>
              <p style={{
                fontSize:      "11px",
                color:         theme.textS,
                margin:        "0 0 4px",
                fontWeight:    500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>
                A gentle nudge
              </p>
              <p style={{
                fontSize:   "13px",
                color:      theme.textB,
                margin:     0,
                lineHeight: 1.6,
              }}>
                {movementNudge}
              </p>
            </div>
          </div>

          <div style={{
            background:   theme.accentLight,
            borderRadius: "10px",
            padding:      "14px 16px",
            borderLeft:   `3px solid ${theme.accent}`,
            marginBottom: "12px",
          }}>
            <p style={{
              fontSize:      "11px",
              color:         theme.textS,
              margin:        "0 0 6px",
              fontWeight:    500,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}>
              {s.story.tinyAction}
            </p>
            <p style={{
              fontSize:   "13px",
              color:      theme.textB,
              margin:     0,
              lineHeight: 1.6,
            }}>
              {story.tinyRecoveryAction}
            </p>
          </div>

          <ThumbsFeedback feature="story" />

          {!isPro && (
            <ProGate mode="inline" />
          )}

          <p style={{
            fontSize:   "11px",
            color:      theme.textS,
            margin:     "8px 0 0",
            lineHeight: 1.5,
            textAlign:  "center",
          }}>
            {story.disclaimer}
          </p>
        </>
      )}

    </div>
  )
}
