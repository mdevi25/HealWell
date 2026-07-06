/**
 * page.tsx — Admin Page (/admin)
 *
 * Password-protected dashboard showing anonymous usage stats.
 * No link in bottom nav — URL-only access (/admin).
 *
 * Data shown:
 * - Total events + active devices (7 days)
 * - Feature usage breakdown
 * - Feedback summary (thumbs up/down per feature)
 * - Language breakdown
 *
 * No individual user data is ever shown.
 * Password checked client-side against /api/admin/summary.
 *
 * Data read: /api/admin/summary (Neon Postgres aggregates)
 * Data written: none
 */

"use client"

import { useState } from "react"
import { getTheme } from "@/lib/theme"

// ── Types ─────────────────────────────────────────────────────────────────────
interface SummaryData {
  totalEvents:   number
  activeDevices: number
  featureBreakdown: { feature: string; count: number }[]
  feedbackSummary:  { feature: string; rating: string; count: number }[]
  languageBreakdown: { language: string; count: number }[]
}

// ── Feature labels ────────────────────────────────────────────────────────────
const FEATURE_LABEL: Record<string, string> = {
  home:    "🏠 Home",
  checkin: "📋 Check-In",
  coach:   "💪 Coach",
  story:   "✨ Story",
  trends:  "📈 Trends",
}

const LANG_LABEL: Record<string, string> = {
  en: "🇺🇸 English",
  es: "🇪🇸 Español",
  hi: "🇮🇳 हिन्दी",
  gu: "🇮🇳 ગુજराती",
}

export default function AdminPage() {
  const theme = getTheme()
  const [password, setPassword]   = useState("")
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState("")
  const [data, setData]           = useState<SummaryData | null>(null)

  // ── Shared styles ─────────────────────────────────────────────────────────
  const card = {
    background:   theme.bgCard,
    borderRadius: "14px",
    padding:      "16px",
    marginBottom: "12px",
    border:       `0.5px solid ${theme.border}`,
    boxShadow:    theme.cardShadow,
  }

  const label = {
    fontSize:      "11px",
    color:         theme.textS,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    fontWeight:    500,
    margin:        "0 0 10px",
  }

  // ── Fetch summary ─────────────────────────────────────────────────────────
  async function handleLogin() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/summary?password=${encodeURIComponent(password)}`)
      if (res.status === 401) {
        setError("Incorrect password.")
        setLoading(false)
        return
      }
      const json = await res.json()
      setData(json)
    } catch {
      setError("Could not connect. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── Feedback helpers ──────────────────────────────────────────────────────
  function getThumbsUp(feature: string): number {
    return data?.feedbackSummary.find(
      (f) => f.feature === feature && f.rating === "up"
    )?.count ?? 0
  }

  function getThumbsDown(feature: string): number {
    return data?.feedbackSummary.find(
      (f) => f.feature === feature && f.rating === "down"
    )?.count ?? 0
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div style={{
        minHeight:      "100vh",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        background:     theme.bgCard,
        padding:        "24px",
      }}>
        <div style={{
          background:   theme.bgCard,
          borderRadius: "16px",
          padding:      "32px 24px",
          border:       `0.5px solid ${theme.border}`,
          width:        "100%",
          maxWidth:     "360px",
        }}>
          <p style={{
            fontSize:   "22px",
            fontWeight: 500,
            color:      theme.textH,
            margin:     "0 0 6px",
          }}>
            HealWell Admin
          </p>
          <p style={{
            fontSize:   "13px",
            color:      theme.textS,
            margin:     "0 0 24px",
          }}>
            Anonymous usage stats only. No health data stored.
          </p>

          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width:        "100%",
              padding:      "12px 14px",
              borderRadius: "10px",
              border:       `0.5px solid ${theme.border}`,
              fontSize:     "15px",
              background:   theme.bgCard,
              color:        theme.textH,
              marginBottom: "12px",
              boxSizing:    "border-box",
              outline:      "none",
            }}
          />

          {error && (
            <p style={{
              fontSize:     "13px",
              color:        "#ef4444",
              margin:       "0 0 12px",
            }}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !password}
            style={{
              background:   theme.accent,
              color:        "white",
              border:       "none",
              borderRadius: "10px",
              padding:      "14px",
              fontSize:     "15px",
              fontWeight:   500,
              width:        "100%",
              cursor:       loading || !password ? "not-allowed" : "pointer",
              opacity:      loading || !password ? 0.6 : 1,
              minHeight:    "52px",
            }}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    )
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const features = [...new Set([
    ...data.featureBreakdown.map((f) => f.feature),
    ...data.feedbackSummary.map((f) => f.feature),
  ])]

  const totalFeedback = data.feedbackSummary.reduce((acc, f) => acc + f.count, 0)
  const totalUp       = data.feedbackSummary.filter((f) => f.rating === "up").reduce((acc, f) => acc + f.count, 0)
  const positiveRate  = totalFeedback > 0 ? Math.round((totalUp / totalFeedback) * 100) : 0

  return (
    <div style={{
      background: theme.bgCard,
      minHeight:  "100vh",
      padding:    "24px 16px",
      maxWidth:   "480px",
      margin:     "0 auto",
    }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{
          fontSize:   "11px",
          color:      theme.textS,
          margin:     "0 0 2px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 500,
        }}>
          HealWell
        </p>
        <p style={{
          fontSize:   "22px",
          fontWeight: 500,
          color:      theme.textH,
          margin:     0,
        }}>
          Admin Dashboard
        </p>
      </div>

      {/* ── Summary metric cards ── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(2, minmax(0,1fr))",
        gap:                 "8px",
        marginBottom:        "12px",
      }}>
        <div style={{
          background:   theme.bgCard,
          borderRadius: "12px",
          padding:      "14px",
          border:       `0.5px solid ${theme.border}`,
          textAlign:    "center",
        }}>
          <p style={{ fontSize: "11px", color: theme.textS, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>
            Total Events
          </p>
          <p style={{ fontSize: "28px", fontWeight: 500, color: theme.textH, margin: 0 }}>
            {data.totalEvents.toLocaleString()}
          </p>
        </div>

        <div style={{
          background:   theme.bgCard,
          borderRadius: "12px",
          padding:      "14px",
          border:       `0.5px solid ${theme.border}`,
          textAlign:    "center",
        }}>
          <p style={{ fontSize: "11px", color: theme.textS, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>
            Active (7 days)
          </p>
          <p style={{ fontSize: "28px", fontWeight: 500, color: theme.textH, margin: 0 }}>
            {data.activeDevices.toLocaleString()}
          </p>
        </div>

        <div style={{
          background:   theme.bgCard,
          borderRadius: "12px",
          padding:      "14px",
          border:       `0.5px solid ${theme.border}`,
          textAlign:    "center",
        }}>
          <p style={{ fontSize: "11px", color: theme.textS, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>
            Total Feedback
          </p>
          <p style={{ fontSize: "28px", fontWeight: 500, color: theme.textH, margin: 0 }}>
            {totalFeedback.toLocaleString()}
          </p>
        </div>

        <div style={{
          background:   theme.bgCard,
          borderRadius: "12px",
          padding:      "14px",
          border:       `0.5px solid ${theme.border}`,
          textAlign:    "center",
        }}>
          <p style={{ fontSize: "11px", color: theme.textS, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>
            Positive Rate
          </p>
          <p style={{ fontSize: "28px", fontWeight: 500, color: positiveRate >= 70 ? "#10b981" : positiveRate >= 40 ? "#f59e0b" : "#ef4444", margin: 0 }}>
            {positiveRate}%
          </p>
        </div>
      </div>

      {/* ── Feature usage ── */}
      <div style={card}>
        <p style={label}>Feature Usage</p>
        {data.featureBreakdown.length === 0 && (
          <p style={{ fontSize: "13px", color: theme.textS, margin: 0 }}>No events yet.</p>
        )}
        {data.featureBreakdown.map((f, idx) => {
          const max = data.featureBreakdown[0]?.count ?? 1
          const pct = Math.round((f.count / max) * 100)
          return (
            <div key={f.feature} style={{
              padding:      "8px 0",
              borderBottom: idx < data.featureBreakdown.length - 1
                ? `0.5px solid ${theme.border}`
                : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "13px", color: theme.textH, fontWeight: 500 }}>
                  {FEATURE_LABEL[f.feature] ?? f.feature}
                </span>
                <span style={{ fontSize: "13px", color: theme.textS }}>
                  {f.count.toLocaleString()}
                </span>
              </div>
              <div style={{
                height:       "4px",
                background:   theme.border,
                borderRadius: "4px",
                overflow:     "hidden",
              }}>
                <div style={{
                  height:     "100%",
                  width:      `${pct}%`,
                  background: theme.accent,
                  borderRadius: "4px",
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Feedback per feature ── */}
      <div style={card}>
        <p style={label}>Feedback by feature</p>
        {features.length === 0 && (
          <p style={{ fontSize: "13px", color: theme.textS, margin: 0 }}>No feedback yet.</p>
        )}
        {features.map((feature, idx) => {
          const up   = getThumbsUp(feature)
          const down = getThumbsDown(feature)
          const total = up + down
          const pct  = total > 0 ? Math.round((up / total) * 100) : 0
          return (
            <div key={feature} style={{
              display:      "flex",
              justifyContent: "space-between",
              alignItems:   "center",
              padding:      "8px 0",
              borderBottom: idx < features.length - 1
                ? `0.5px solid ${theme.border}`
                : "none",
            }}>
              <span style={{ fontSize: "13px", color: theme.textH, fontWeight: 500 }}>
                {FEATURE_LABEL[feature] ?? feature}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: theme.textS }}>
                  👍 {up} · 👎 {down}
                </span>
                {total > 0 && (
                  <span style={{
                    fontSize:     "12px",
                    fontWeight:   500,
                    color:        pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444",
                  }}>
                    {pct}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Language breakdown ── */}
      <div style={card}>
        <p style={label}>Language breakdown</p>
        {data.languageBreakdown.length === 0 && (
          <p style={{ fontSize: "13px", color: theme.textS, margin: 0 }}>No data yet.</p>
        )}
        {data.languageBreakdown.map((l, idx) => {
          const max = data.languageBreakdown[0]?.count ?? 1
          const pct = Math.round((l.count / max) * 100)
          return (
            <div key={l.language} style={{
              padding:      "8px 0",
              borderBottom: idx < data.languageBreakdown.length - 1
                ? `0.5px solid ${theme.border}`
                : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "13px", color: theme.textH, fontWeight: 500 }}>
                  {LANG_LABEL[l.language] ?? l.language}
                </span>
                <span style={{ fontSize: "13px", color: theme.textS }}>
                  {l.count.toLocaleString()}
                </span>
              </div>
              <div style={{
                height:       "4px",
                background:   theme.border,
                borderRadius: "4px",
                overflow:     "hidden",
              }}>
                <div style={{
                  height:       "100%",
                  width:        `${pct}%`,
                  background:   "#10b981",
                  borderRadius: "4px",
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Logout ── */}
      <button
        onClick={() => setData(null)}
        style={{
          background:   "transparent",
          color:        theme.textS,
          border:       `0.5px solid ${theme.border}`,
          borderRadius: "10px",
          padding:      "12px",
          fontSize:     "13px",
          width:        "100%",
          cursor:       "pointer",
          marginTop:    "8px",
        }}
      >
        Sign out
      </button>

    </div>
  )
}