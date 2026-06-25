/**
 * page.tsx — Check-In Page (/checkin)
 *
 * Core data-capture form filled in after every shift.
 * Computes recovery score and risk level client-side,
 * then saves to localStorage under healwell.checkins.
 *
 * Inputs (per spec Section 3.2):
 * - hoursWorked  → slider (4–16h)
 * - sleepHours   → slider (2–12h)
 * - energy       → 5-emoji single-select (worst → best: 2/4/6/8/10)
 * - wornOut      → 5-emoji single-select (worst → best: 10/8/6/4/2)
 * - movements    → emoji chip multi-select (bottom-to-top body order)
 *
 * Emoji scales (consistent direction — worst left, best right):
 * - Energy:   😴 Exhausted → 😔 Low → 😐 Okay → 🙂 Good → ⚡ Energised
 * - Worn out: 💀 Drained → 😩 Very worn → 😓 Quite a bit → 🙂 A little → 😊 Fine
 *
 * Body areas (bottom-to-top order, multi-select):
 * 🦶 Feet · 🦵 Legs · 🧍 Back · 🙆 Shoulders · 🤲 Wrists · 🫁 Breathing
 *
 * All emoji labels and UI strings come from src/i18n/strings.ts
 * Emojis themselves are universal — same across all languages
 *
 * Recovery score formula (spec Section 3.3):
 * - Weights in RECOVERY_WEIGHTS config in src/lib/recovery.ts
 * - Score clamped 0–100
 * - Risk: low ≥70, moderate 40–69, high <40
 *
 * Data rule (spec Section 3.2):
 * - One check-in per calendar date — overwrites, never duplicates
 * - Check-in contents NEVER leave the device
 *
 * Theme colours from src/lib/theme.ts
 *
 * Also fires anonymous usage event (fire-and-forget).
 * No health data sent — only feature name, language, deviceId.
 *
 * Data read:  healwell.checkins (pre-fills if editing today's entry)
 * Data written: healwell.checkins
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getTodayCheckin,
  saveCheckin,
  getLanguage,
  type CheckIn,
} from "@/lib/localStorage"
import { calculateRecovery } from "@/lib/recovery"
import { getStrings } from "@/i18n/strings"
import { getDeviceId } from "@/lib/deviceId"
import { getTheme } from "@/lib/theme"

// ── Body area options (bottom-to-top order) ───────────────────────────────────
const MOVEMENT_OPTIONS = [
  { key: "feet",      emoji: "🦶", labelKey: "feet"      },
  { key: "legs",      emoji: "🦵", labelKey: "legs"      },
  { key: "back",      emoji: "🧍", labelKey: "back"      },
  { key: "shoulders", emoji: "🙆", labelKey: "shoulders" },
  { key: "wrists",    emoji: "🤲", labelKey: "wrists"    },
  { key: "breathing", emoji: "🫁", labelKey: "breathing" },
] as const

type MovementKey = (typeof MOVEMENT_OPTIONS)[number]["key"]

export default function CheckInPage() {
  const router = useRouter()
  const [mounted, setMounted]     = useState(false)
  const [saved, setSaved]         = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  // Form state — energy and wornOut start null (no default selection)
  const [hoursWorked, setHoursWorked] = useState(8)
  const [sleepHours, setSleepHours]   = useState(7)
  const [energy, setEnergy]           = useState<number | null>(null)
  const [wornOut, setWornOut]         = useState<number | null>(null)
  const [movements, setMovements]     = useState<MovementKey[]>([])

  useEffect(() => {
    setMounted(true)

    // Pre-fill if editing today's existing check-in
    const existing = getTodayCheckin()
    if (existing) {
      setHoursWorked(existing.hoursWorked)
      setSleepHours(existing.sleepHours)
      setEnergy(existing.energy)
      setWornOut(existing.wornOut)
      setMovements(existing.movements as MovementKey[])
    }

    // Fire-and-forget usage event (spec Section 13.3)
    try {
      fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          feature: "checkin",
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

  // ── Emoji options built from i18n strings ───────────────────────────────────
  const ENERGY_OPTIONS = [
    { emoji: "😴", label: s.energyLabels.exhausted, value: 2  },
    { emoji: "😔", label: s.energyLabels.low,       value: 4  },
    { emoji: "😐", label: s.energyLabels.okay,      value: 6  },
    { emoji: "🙂", label: s.energyLabels.good,      value: 8  },
    { emoji: "⚡", label: s.energyLabels.energised, value: 10 },
  ]

  const WORN_OUT_OPTIONS = [
    { emoji: "💀", label: s.wornOutLabels.drained,  value: 10 },
    { emoji: "😩", label: s.wornOutLabels.veryWorn, value: 8  },
    { emoji: "😓", label: s.wornOutLabels.quiteBit, value: 6  },
    { emoji: "🙂", label: s.wornOutLabels.aLittle,  value: 4  },
    { emoji: "😊", label: s.wornOutLabels.fine,     value: 2  },
  ]

  function toggleMovement(key: MovementKey) {
    setMovements((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    )
  }

  function handleSave() {
    if (energy === null || wornOut === null) {
      setShowValidation(true)
      return
    }

    const { score, riskLevel } = calculateRecovery(
      wornOut,
      hoursWorked,
      sleepHours,
      energy
    )

    const checkin: CheckIn = {
      date:          new Date().toISOString().split("T")[0],
      hoursWorked,
      sleepHours,
      energy,
      wornOut,
      movements,
      recoveryScore: score,
      riskLevel,
    }

    saveCheckin(checkin)
    setSaved(true)
    setTimeout(() => router.push("/coach"), 1200)
  }

  // ── Shared card style ───────────────────────────────────────────────────────
  const card = {
    background:   theme.bgCard,
    borderRadius: "14px",
    padding:      "20px",
    marginBottom: "14px",
    boxShadow:    theme.cardShadow,
    border:       `0.5px solid ${theme.border}`,
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
          {s.checkin.title}
        </p>
        <p style={{
          fontSize:   "22px",
          fontWeight: 500,
          color:      theme.textH,
          margin:     0,
          lineHeight: 1.3,
        }}>
          {s.checkin.shiftQuestion}
        </p>
      </div>

      {/* ── Hours worked ── */}
      <div style={card}>
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "baseline",
          marginBottom:   "14px",
        }}>
          <p style={{
            fontSize:    "14px",
            color:       theme.textH,
            margin:      0,
            fontWeight:  500,
            lineHeight:  1.4,
            flex:        1,
            paddingRight:"12px",
          }}>
            {s.checkin.hoursWorked}
          </p>
          <span style={{
            fontSize:   "22px",
            fontWeight: 500,
            color:      theme.accent,
            flexShrink: 0,
          }}>
            {hoursWorked}h
          </span>
        </div>
        <input
          type="range"
          min={4}
          max={16}
          step={0.5}
          value={hoursWorked}
          onChange={(e) => setHoursWorked(Number(e.target.value))}
          style={{ width: "100%", accentColor: theme.accent }}
          aria-label={s.checkin.hoursWorked}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "11px", color: theme.textS }}>{s.checkin.hoursMin}</span>
          <span style={{ fontSize: "11px", color: theme.textS }}>{s.checkin.hoursMax}</span>
        </div>
      </div>

      {/* ── Sleep hours ── */}
      <div style={card}>
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "baseline",
          marginBottom:   "14px",
        }}>
          <p style={{
            fontSize:    "14px",
            color:       theme.textH,
            margin:      0,
            fontWeight:  500,
            lineHeight:  1.4,
            flex:        1,
            paddingRight:"12px",
          }}>
            {s.checkin.sleepHours}
          </p>
          <span style={{
            fontSize:   "22px",
            fontWeight: 500,
            color:      theme.accent,
            flexShrink: 0,
          }}>
            {sleepHours}h
          </span>
        </div>
        <input
          type="range"
          min={2}
          max={12}
          step={0.5}
          value={sleepHours}
          onChange={(e) => setSleepHours(Number(e.target.value))}
          style={{ width: "100%", accentColor: theme.accent }}
          aria-label={s.checkin.sleepHours}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "11px", color: theme.textS }}>{s.checkin.sleepMin}</span>
          <span style={{ fontSize: "11px", color: theme.textS }}>{s.checkin.sleepMax}</span>
        </div>
      </div>

      {/* ── Energy — emoji single select ── */}
      <div style={{
        ...card,
        border: `0.5px solid ${
          showValidation && energy === null
            ? theme.riskHigh
            : theme.border
        }`,
      }}>
        <p style={{
          fontSize:   "14px",
          color:      theme.textH,
          margin:     "0 0 4px",
          fontWeight: 500,
        }}>
          {s.checkin.energy}
        </p>
        <p style={{
          fontSize: "12px",
          color:    theme.textS,
          margin:   "0 0 16px",
        }}>
          {s.checkin.tapFeeling}
        </p>
        <div style={{ display: "flex", gap: "6px" }}>
          {ENERGY_OPTIONS.map((opt) => {
            const isSelected = energy === opt.value
            return (
              <div
                key={opt.value}
                style={{
                  flex:           1,
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  gap:            "6px",
                }}
              >
                <button
                  onClick={() => {
                    setEnergy(opt.value)
                    setShowValidation(false)
                  }}
                  aria-pressed={isSelected}
                  aria-label={opt.label}
                  style={{
                    width:           "100%",
                    borderRadius:    "10px",
                    background:      isSelected ? theme.accent : theme.accentLight,
                    border:          `0.5px solid ${isSelected ? theme.accent : theme.accentLine}`,
                    fontSize:        "24px",
                    cursor:          "pointer",
                    minHeight:       "52px",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    outline:         isSelected ? `2.5px solid ${theme.accentDeep}` : "none",
                    outlineOffset:   "2px",
                  }}
                >
                  {opt.emoji}
                </button>
                <span style={{
                  fontSize:   "10px",
                  color:      isSelected ? theme.accent : theme.textS,
                  fontWeight: isSelected ? 500 : 400,
                  textAlign:  "center",
                  lineHeight: 1.2,
                }}>
                  {opt.label}
                </span>
              </div>
            )
          })}
        </div>
        {showValidation && energy === null && (
          <p style={{
            fontSize:  "12px",
            color:     theme.riskHigh,
            margin:    "12px 0 0",
            textAlign: "center",
          }}>
            {s.checkin.validationEnergy}
          </p>
        )}
      </div>

      {/* ── Worn out — emoji single select ── */}
      <div style={{
        ...card,
        border: `0.5px solid ${
          showValidation && wornOut === null
            ? theme.riskHigh
            : theme.border
        }`,
      }}>
        <p style={{
          fontSize:   "14px",
          color:      theme.textH,
          margin:     "0 0 4px",
          fontWeight: 500,
        }}>
          {s.checkin.wornOut}
        </p>
        <p style={{
          fontSize: "12px",
          color:    theme.textS,
          margin:   "0 0 16px",
        }}>
          {s.checkin.tapFeeling}
        </p>
        <div style={{ display: "flex", gap: "6px" }}>
          {WORN_OUT_OPTIONS.map((opt) => {
            const isSelected = wornOut === opt.value
            return (
              <div
                key={opt.value}
                style={{
                  flex:          1,
                  display:       "flex",
                  flexDirection: "column",
                  alignItems:    "center",
                  gap:           "6px",
                }}
              >
                <button
                  onClick={() => {
                    setWornOut(opt.value)
                    setShowValidation(false)
                  }}
                  aria-pressed={isSelected}
                  aria-label={opt.label}
                  style={{
                    width:          "100%",
                    borderRadius:   "10px",
                    background:     isSelected ? theme.accent : theme.accentLight,
                    border:         `0.5px solid ${isSelected ? theme.accent : theme.accentLine}`,
                    fontSize:       "24px",
                    cursor:         "pointer",
                    minHeight:      "52px",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    outline:        isSelected ? `2.5px solid ${theme.accentDeep}` : "none",
                    outlineOffset:  "2px",
                  }}
                >
                  {opt.emoji}
                </button>
                <span style={{
                  fontSize:   "10px",
                  color:      isSelected ? theme.accent : theme.textS,
                  fontWeight: isSelected ? 500 : 400,
                  textAlign:  "center",
                  lineHeight: 1.2,
                }}>
                  {opt.label}
                </span>
              </div>
            )
          })}
        </div>
        {showValidation && wornOut === null && (
          <p style={{
            fontSize:  "12px",
            color:     theme.riskHigh,
            margin:    "12px 0 0",
            textAlign: "center",
          }}>
            {s.checkin.validationWornOut}
          </p>
        )}
      </div>

      {/* ── Body areas — emoji multi-select ── */}
      <div style={card}>
        <p style={{
          fontSize:      "12px",
          color:         theme.textS,
          margin:        "0 0 4px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight:    500,
        }}>
          {s.checkin.movements}
        </p>
        <p style={{
          fontSize: "13px",
          color:    theme.textB,
          margin:   "0 0 14px",
        }}>
          {s.checkin.movementsSubtext}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {MOVEMENT_OPTIONS.map(({ key, emoji, labelKey }) => {
            const isSelected = movements.includes(key)
            return (
              <button
                key={key}
                onClick={() => toggleMovement(key)}
                aria-pressed={isSelected}
                style={{
                  background:   isSelected ? theme.accent : theme.accentLight,
                  border:       `0.5px solid ${isSelected ? theme.accent : theme.accentLine}`,
                  borderRadius: "20px",
                  padding:      "8px 16px",
                  fontSize:     "14px",
                  color:        isSelected ? "white" : theme.textM,
                  cursor:       "pointer",
                  fontWeight:   isSelected ? 500 : 400,
                  minHeight:    "44px",
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "6px",
                }}
              >
                <span>{emoji}</span>
                {s.movements[labelKey]}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <p style={{
        fontSize:  "11px",
        color:     theme.textS,
        margin:    "0 0 20px",
        lineHeight: 1.5,
        textAlign: "center",
      }}>
        {s.checkin.disclaimer}
      </p>

      {/* ── Save button / confirmation ── */}
      {!saved ? (
        <button
          onClick={handleSave}
          style={{
            background:   theme.accent,
            color:        "white",
            border:       "none",
            borderRadius: "12px",
            padding:      "16px 24px",
            fontSize:     "16px",
            fontWeight:   500,
            width:        "100%",
            cursor:       "pointer",
            minHeight:    "56px",
          }}
        >
          {s.checkin.submit}
        </button>
      ) : (
        <div style={{
          background:     theme.accentLight,
          border:         `0.5px solid ${theme.accentLine}`,
          borderRadius:   "12px",
          padding:        "16px 24px",
          textAlign:      "center",
          minHeight:      "56px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            "8px",
        }}>
          <span style={{ fontSize: "20px" }}>✅</span>
          <span style={{
            fontSize:   "16px",
            fontWeight: 500,
            color:      theme.accentDeep,
          }}>
            {s.checkin.saved}
          </span>
        </div>
      )}
    </div>
  )
}