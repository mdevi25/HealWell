/**
 * ThumbsFeedback.tsx
 *
 * One-tap 👍 / 👎 feedback control shown after the Coach movements
 * and after the Shift Story renders.
 *
 * Behaviour (per spec Section 11):
 * - Single tap records the rating — no follow-up questions, no popups
 * - On tap: shows a quiet "Thanks ✓" acknowledgement
 * - Sends an anonymous POST to /api/feedback (fire-and-forget)
 * - If the network call fails, it fails silently — the user never sees an error
 * - Data sent: feature, rating, language, deviceId, timestamp
 * - Data NOT sent: check-in contents, story text, any health data
 *
 * Props:
 * - feature: "coach" | "story" — identifies which feature is being rated
 *
 * Used in: /coach page, /story page
 */

"use client"

import { useState } from "react"
import { getLanguage } from "@/lib/localStorage"
import { getStrings } from "@/i18n/strings"
import { getDeviceId } from "@/lib/deviceId"

interface ThumbsFeedbackProps {
  feature: "coach" | "story"
}

export default function ThumbsFeedback({ feature }: ThumbsFeedbackProps) {
  const s = getStrings(getLanguage())
  const [rated, setRated] = useState<"up" | "down" | null>(null)

  async function handleRate(rating: "up" | "down") {
    setRated(rating)

    // Fire and forget — never block UI or show error to user (spec Section 11)
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          feature,
          rating,
          language: getLanguage(),
        }),
      })
    } catch {
      // Silently ignore — analytics are best-effort per spec
    }
  }

  if (rated) {
    return (
      <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center" }}>
        {s.coach.feedbackThanks}
      </p>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        margin: "16px 0",
      }}
    >
      <span style={{ fontSize: "13px", color: "#9ca3af" }}>
        {s.coach.feedbackPrompt}
      </span>
      <button
        onClick={() => handleRate("up")}
        style={{
          background: "none",
          border: "0.5px solid #e5e7eb",
          borderRadius: "8px",
          padding: "6px 14px",
          fontSize: "18px",
          cursor: "pointer",
          minHeight: "48px",
          minWidth: "48px",
        }}
        aria-label="Thumbs up"
      >
        👍
      </button>
      <button
        onClick={() => handleRate("down")}
        style={{
          background: "none",
          border: "0.5px solid #e5e7eb",
          borderRadius: "8px",
          padding: "6px 14px",
          fontSize: "18px",
          cursor: "pointer",
          minHeight: "48px",
          minWidth: "48px",
        }}
        aria-label="Thumbs down"
      >
        👎
      </button>
    </div>
  )
}
