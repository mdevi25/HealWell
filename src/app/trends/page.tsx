/**
 * page.tsx — Trends Page (/trends)
 *
 * Shows a 3-day view of the worker's recovery trends.
 * Reads all check-ins from localStorage — no data leaves the device.
 *
 * Check-in count is based on unique calendar dates only.
 * A worker can update their check-in multiple times per day —
 * saveCheckin() overwrites same-date entries so count = unique dates.
 *
 * Layout:
 * - Summary cards: avg sleep + avg shift (side by side)
 * - Single centred subtext: "X check-ins so far" (below both cards)
 * - Recent check-ins list (sleep first, shift second)
 * - Sleep & Energy line chart
 * - Pro gate card
 *
 * All display strings from src/i18n/strings.ts
 * Theme colours from src/lib/theme.ts
 *
 * Data read:  healwell.checkins, healwell.language, healwell.theme, healwell.plan
 * Data written: none
 */

/**
 * page.tsx — Trends Page (/trends)
 * Fixed: replaced chart.js with inline SVG chart (no external dependency)
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getCheckins,
  getLanguage,
  getPlan,
  type CheckIn,
} from "@/lib/localStorage"
import { getStrings } from "@/i18n/strings"
import { getDeviceId } from "@/lib/deviceId"
import { getTheme } from "@/lib/theme"
import ProGate from "@/components/ProGate"

const ENERGY_EMOJI: Record<number, string> = {
  2: "😴", 4: "😔", 6: "😐", 8: "🙂", 10: "⚡",
}

const RISK_COLOR: Record<string, string> = {
  high:     "#ef4444",
  moderate: "#f59e0b",
  low:      "#10b981",
}

function formatDate(
  dateStr: string,
  s: ReturnType<typeof import("@/i18n/strings").getStrings>
): string {
  const today     = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
  const twoDays   = new Date(Date.now() - 172800000).toISOString().split("T")[0]

  if (dateStr === today)     return s.trends.today
  if (dateStr === yesterday) return s.trends.yesterday
  if (dateStr === twoDays)   return s.trends.twoDaysAgo

  const d = new Date(dateStr)
  return d.toLocaleDateString("en", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
  })
}

// ── Inline SVG chart — no chart.js dependency ─────────────────────────────────
function SimpleSVGChart({
  data,
  s,
}: {
  data: CheckIn[]
  s: ReturnType<typeof import("@/i18n/strings").getStrings>
}) {
  if (data.length === 0) return null

  const W      = 320
  const H      = 130
  const pad    = { top: 10, bottom: 24, left: 24, right: 10 }
  const chartW = W - pad.left - pad.right
  const chartH = H - pad.top - pad.bottom
  const maxVal = 12

  const xPos = (i: number) =>
    pad.left + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW)
  const yPos = (v: number) =>
    pad.top + chartH - (v / maxVal) * chartH

  const sleepPoints  = data.map((c, i) => `${xPos(i)},${yPos(c.sleepHours)}`).join(" ")
  const energyPoints = data.map((c, i) => `${xPos(i)},${yPos(c.energy)}`).join(" ")

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "130px" }} role="img" aria-label={s.trends.chartLabel}>
      {/* Grid lines */}
      {[0, 4, 8, 12].map((v) => (
        <line
          key={v}
          x1={pad.left} y1={yPos(v)}
          x2={W - pad.right} y2={yPos(v)}
          stroke="rgba(74,159,212,0.15)" strokeWidth="1"
        />
      ))}
      {/* Y axis labels */}
      {[0, 4, 8, 12].map((v) => (
        <text
          key={`label-${v}`}
          x={pad.left - 4} y={yPos(v) + 3}
          fontSize="8" fill="#5A9EC0" textAnchor="end"
        >
          {v}
        </text>
      ))}
      {/* Sleep line */}
      <polyline
        points={sleepPoints}
        fill="none" stroke="#4A9FD4" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round"
      />
      {/* Energy line */}
      <polyline
        points={energyPoints}
        fill="none" stroke="#10b981" strokeWidth="2"
        strokeDasharray="5,3"
        strokeLinejoin="round" strokeLinecap="round"
      />
      {/* Dots + x labels */}
      {data.map((c, i) => (
        <g key={c.date}>
          <circle cx={xPos(i)} cy={yPos(c.sleepHours)} r="4" fill="#4A9FD4" />
          <circle cx={xPos(i)} cy={yPos(c.energy)}     r="4" fill="#10b981" />
          <text
            x={xPos(i)} y={H - 4}
            textAnchor="middle" fontSize="8" fill="#5A9EC0"
          >
            {formatDate(c.date, s).slice(0, 3)}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function TrendsPage() {
  const router                          = useRouter()
  const [checkins, setCheckins]         = useState<CheckIn[]>([])
  const [mounted, setMounted]           = useState(false)

  useEffect(() => {
    setMounted(true)
    const all = getCheckins()
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
    setCheckins(all)

    try {
      fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          feature:  "trends",
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
  const plan  = getPlan()
  const isPro = plan === "pro"

  const card = {
    background:   theme.bgCard,
    borderRadius: "14px",
    padding:      "16px",
    marginBottom: "12px",
    boxShadow:    theme.cardShadow,
    border:       `0.5px solid ${theme.border}`,
  }

  // ── No check-ins ────────────────────────────────────────────────────────────
  if (checkins.length === 0) {
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
            {s.trends.title}
          </p>
          <p style={{
            fontSize:   "22px",
            fontWeight: 500,
            color:      theme.textH,
            margin:     0,
            lineHeight: 1.3,
          }}>
            {s.trends.tagline}
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
            {s.trends.noData}
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
            {s.trends.goCheckin}
          </button>
        </div>
      </div>
    )
  }

  // ── Data ─────────────────────────────────────────────────────────────────────
  const recent3     = checkins.slice(0, 3)
  const avgSleep    = recent3.reduce((acc, c) => acc + c.sleepHours, 0) / recent3.length
  const avgShift    = recent3.reduce((acc, c) => acc + c.hoursWorked, 0) / recent3.length
  const displayRows = isPro ? checkins.slice(0, 7) : checkins.slice(0, 3)
  const chartData   = (isPro ? checkins.slice(0, 7) : checkins.slice(0, 3)).reverse()

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
          {s.trends.title}
        </p>
        <p style={{
          fontSize:   "22px",
          fontWeight: 500,
          color:      theme.textH,
          margin:     0,
          lineHeight: 1.3,
        }}>
          {s.trends.tagline}
        </p>
      </div>

      {/* ── Summary cards ── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(2, minmax(0,1fr))",
        gap:                 "8px",
        marginBottom:        "4px",
      }}>
        <div style={{
          background:   theme.bgCard,
          borderRadius: "12px",
          padding:      "14px",
          border:       `0.5px solid ${theme.border}`,
          textAlign:    "center",
        }}>
          <p style={{
            fontSize:      "11px",
            color:         theme.textS,
            margin:        "0 0 4px",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight:    500,
          }}>
            {s.trends.avgSleep}
          </p>
          <p style={{
            fontSize:   "24px",
            fontWeight: 500,
            color:      theme.textH,
            margin:     0,
          }}>
            {avgSleep.toFixed(1)}h
          </p>
        </div>

        <div style={{
          background:   theme.bgCard,
          borderRadius: "12px",
          padding:      "14px",
          border:       `0.5px solid ${theme.border}`,
          textAlign:    "center",
        }}>
          <p style={{
            fontSize:      "11px",
            color:         theme.textS,
            margin:        "0 0 4px",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight:    500,
          }}>
            {s.trends.avgShift}
          </p>
          <p style={{
            fontSize:   "24px",
            fontWeight: 500,
            color:      theme.textH,
            margin:     0,
          }}>
            {avgShift.toFixed(1)}h
          </p>
        </div>
      </div>

      {/* ── Check-in count ── */}
      <p style={{
        fontSize:  "12px",
        color:     theme.textS,
        margin:    "6px 0 14px",
        textAlign: "center",
      }}>
        {s.trends.checkInCount(checkins.length)}
      </p>

      {/* ── Recent check-ins ── */}
      <div style={card}>
        <p style={{
          fontSize:      "11px",
          color:         theme.textS,
          margin:        "0 0 10px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight:    500,
        }}>
          {s.trends.recentCheckins}
        </p>

        {displayRows.map((checkin, idx) => {
          const color = RISK_COLOR[checkin.riskLevel]
          const emoji = ENERGY_EMOJI[checkin.energy] ?? "😐"
          const label = checkin.riskLevel === "high"
            ? s.trends.statusHigh
            : checkin.riskLevel === "moderate"
            ? s.trends.statusModerate
            : s.trends.statusLow

          return (
            <div
              key={checkin.date}
              style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "center",
                padding:        "8px 0",
                borderBottom:   idx < displayRows.length - 1
                  ? `0.5px solid ${theme.border}`
                  : "none",
                gap:            "8px",
                flexWrap:       "wrap",
              }}
            >
              <span style={{
                fontSize:   "12px",
                color:      theme.textS,
                flexShrink: 0,
                minWidth:   "80px",
              }}>
                {formatDate(checkin.date, s)}
              </span>

              <div style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "8px",
                justifyContent: "flex-end",
                flex:           1,
                flexWrap:       "wrap",
              }}>
                <span style={{
                  fontSize:   "12px",
                  color:      theme.textH,
                  fontWeight: 500,
                }}>
                  {emoji} {checkin.sleepHours}h sleep · {checkin.hoursWorked}h shift
                </span>

                <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <span style={{
                    width:        "8px",
                    height:       "8px",
                    borderRadius: "50%",
                    background:   color,
                    display:      "inline-block",
                    marginRight:  "5px",
                  }} />
                  <span style={{ fontSize: "11px", color, fontWeight: 500 }}>
                    {label}
                  </span>
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── SVG Chart ── */}
      <div style={card}>
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          marginBottom:   "10px",
        }}>
          <p style={{
            fontSize:      "11px",
            color:         theme.textS,
            margin:        0,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight:    500,
          }}>
            {s.trends.chartLabel}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#4A9FD4" }}>
              <span style={{ width: "16px", height: "2px", background: "#4A9FD4", display: "inline-block", borderRadius: "2px" }} />
              {s.trends.chartSleep}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#10b981" }}>
              <span style={{ width: "16px", height: "0", borderTop: "2px dashed #10b981", display: "inline-block" }} />
              {s.trends.chartEnergy}
            </span>
          </div>
        </div>

        <SimpleSVGChart data={chartData} s={s} />
      </div>

      {/* ── Pro gate ── */}
      {!isPro && (
        <div style={{
          background:   theme.bgCard,
          borderRadius: "14px",
          padding:      "16px",
          border:       `0.5px solid ${theme.accent}`,
          display:      "flex",
          alignItems:   "flex-start",
          gap:          "12px",
          marginBottom: "12px",
        }}>
          <div style={{
            width:          "36px",
            height:         "36px",
            borderRadius:   "50%",
            background:     theme.accentLight,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
            fontSize:       "18px",
          }}>
            ✨
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: theme.textH, margin: "0 0 4px" }}>
              {s.trends.proTeaser}
            </p>
            <p style={{ fontSize: "12px", color: theme.textS, margin: "0 0 10px", lineHeight: 1.5 }}>
              {s.trends.proGateBody}
            </p>
            <ProGate mode="inline" message={s.trends.unlockPro} />
          </div>
        </div>
      )}

    </div>
  )
}
