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

"use client"

import { useEffect, useRef, useState } from "react"
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

// ── Energy emoji map ──────────────────────────────────────────────────────────
const ENERGY_EMOJI: Record<number, string> = {
  2: "😴", 4: "😔", 6: "😐", 8: "🙂", 10: "⚡",
}

// ── Risk level colour map ─────────────────────────────────────────────────────
const RISK_COLOR: Record<string, string> = {
  high:     "#ef4444",
  moderate: "#f59e0b",
  low:      "#10b981",
}

// ── Date formatter — reads from i18n strings ──────────────────────────────────
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

export default function TrendsPage() {
  const router        = useRouter()
  const chartRef      = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<unknown>(null)
  const [checkins, setCheckins] = useState<CheckIn[]>([])
  const [mounted, setMounted]   = useState(false)

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

  // ── Build chart ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted || !chartRef.current || checkins.length === 0) return

    const s    = getStrings(getLanguage())
    const plan = getPlan()
    const days = plan === "pro" ? 7 : 3
    const data = checkins.slice(0, days).reverse()

    const loadChart = async () => {
      const { Chart, registerables } = await import("chart.js")
      Chart.register(...registerables)

      if (chartInstance.current) {
        (chartInstance.current as { destroy: () => void }).destroy()
      }

      chartInstance.current = new Chart(chartRef.current!, {
        type: "line",
        data: {
          labels:   data.map((c) => formatDate(c.date, s)),
          datasets: [
            {
              label:               s.trends.chartSleep,
              data:                data.map((c) => c.sleepHours),
              borderColor:         "#4A9FD4",
              backgroundColor:     "rgba(74,159,212,0.08)",
              borderWidth:         2,
              pointBackgroundColor:"#4A9FD4",
              pointRadius:         5,
              tension:             0.3,
              fill:                true,
            },
            {
              label:               s.trends.chartEnergy,
              data:                data.map((c) => c.energy),
              borderColor:         "#10b981",
              backgroundColor:     "transparent",
              borderWidth:         2,
              borderDash:          [5, 3],
              pointBackgroundColor:"#10b981",
              pointRadius:         5,
              tension:             0.3,
              fill:                false,
            },
          ],
        },
        options: {
          responsive:          true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              display: true,
              ticks:   { color: "#5A9EC0", font: { size: 10 }, maxRotation: 0 },
              grid:    { display: false },
            },
            y: {
              display: true,
              min:     0,
              max:     12,
              ticks:   { stepSize: 4, color: "#5A9EC0", font: { size: 10 } },
              grid:    { color: "rgba(74,159,212,0.1)" },
            },
          },
        },
      })
    }

    loadChart()

    return () => {
      if (chartInstance.current) {
        (chartInstance.current as { destroy: () => void }).destroy()
      }
    }
  }, [mounted, checkins])

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

  // ── No check-ins ──────────────────────────────────────────────────────────
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

  // ── Data ──────────────────────────────────────────────────────────────────
  const recent3     = checkins.slice(0, 3)
  const avgSleep    = recent3.reduce((acc, c) => acc + c.sleepHours, 0) / recent3.length
  const avgShift    = recent3.reduce((acc, c) => acc + c.hoursWorked, 0) / recent3.length
  const displayRows = isPro ? checkins.slice(0, 7) : checkins.slice(0, 3)

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

      {/* ── Summary cards — no subtext inside each card ── */}
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

      {/* ── Single centred subtext below both cards ── */}
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
                fontSize:  "12px",
                color:     theme.textS,
                flexShrink: 0,
                minWidth:  "80px",
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
                  fontSize:  "12px",
                  color:     theme.textH,
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

      {/* ── Sleep & Energy line chart ── */}
      <div style={card}>
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          marginBottom:   "12px",
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

        <div style={{ position: "relative", width: "100%", height: "140px" }}>
          <canvas
            ref={chartRef}
            role="img"
            aria-label={s.trends.chartLabel}
          >
            {s.trends.chartLabel}
          </canvas>
        </div>
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