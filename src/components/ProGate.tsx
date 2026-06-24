/**
 * ProGate.tsx
 *
 * Soft upgrade prompt shown when a feature is behind the Pro tier.
 * This is a UI placeholder — no payment processing yet (Phase 2: Lemon Squeezy).
 *
 * Design intent (per spec Section 8):
 * - A gentle invitation, never a hard wall
 * - The core daily habit (Check-In, short Story) is always free
 * - Free story is always shown FIRST — Pro invite appears below as a bonus
 *
 * Two display modes:
 * - "inline" → used on Story page — a single quiet line at the bottom
 *              never interrupts the story content
 * - "card"   → used on Coach + Trends — small visible card below free content
 *              signals there is more available, but doesn't block
 *
 * Clicking either opens a "Coming Soon" modal (Option A).
 * Phase 2 will replace the modal with Lemon Squeezy payment flow.
 *
 * Props:
 * - mode: "inline" | "card" (default: "card")
 * - message (optional): override the default Pro message text
 *
 * Used in: /coach, /story, /trends pages
 */

"use client"

import { useState } from "react"
import { getLanguage } from "@/lib/localStorage"
import { getStrings } from "@/i18n/strings"

interface ProGateProps {
  mode?: "inline" | "card"
  message?: string
}

export default function ProGate({ mode = "card", message }: ProGateProps) {
  const s = getStrings(getLanguage())
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {/* ── Inline mode — Story page ── */}
      {mode === "inline" && (
        <div
          style={{
            borderTop: "0.5px solid #e5e7eb",
            padding: "12px 0 4px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
            ✨{" "}
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "none",
                border: "none",
                color: "#0D9488",
                fontSize: "13px",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              {message ?? "Unlock emotional themes & wellness patterns"}
            </button>{" "}
            with Pro
          </p>
        </div>
      )}

      {/* ── Card mode — Coach + Trends pages ── */}
      {mode === "card" && (
        <div
          style={{
            border: "0.5px solid #0D9488",
            borderRadius: "10px",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f0fdfa",
            margin: "16px 0",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#0f766e",
                margin: "0 0 2px",
              }}
            >
              {message ?? s.pro.message}
            </p>
            <p style={{ fontSize: "12px", color: "#0f766e", margin: 0 }}>
              {s.pro.price}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#0D9488",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "13px",
              cursor: "pointer",
              minHeight: "48px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {s.pro.cta}
          </button>
        </div>
      )}

      {/* ── Coming Soon modal — shared by both modes ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "32px 24px",
              maxWidth: "340px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#f0fdfa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: "28px",
              }}
            >
              ✨
            </div>

            {/* Heading */}
            <p
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "#0f766e",
                margin: "0 0 10px",
              }}
            >
              HealWell Pro — Coming Soon
            </p>

            {/* Body */}
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                lineHeight: 1.6,
                margin: "0 0 8px",
              }}
            >
              We're putting the finishing touches on Pro.
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                lineHeight: 1.6,
                margin: "0 0 20px",
              }}
            >
              For just{" "}
              <span style={{ color: "#0D9488", fontWeight: 500 }}>
                $3.99/month
              </span>{" "}
              you'll unlock all 6 recovery movements, your full shift story with
              emotional themes, and a complete 7-day wellness pattern view.
            </p>

            {/* Early supporter pill */}
            <div
              style={{
                background: "#f0fdfa",
                borderRadius: "8px",
                padding: "10px 16px",
                marginBottom: "20px",
                fontSize: "13px",
                color: "#0f766e",
              }}
            >
              🎉 Early supporters will get their first month free.
            </div>

            {/* Confirm button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: "#0D9488",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 32px",
                fontSize: "15px",
                cursor: "pointer",
                minHeight: "48px",
                width: "100%",
              }}
            >
              Got it — I'll wait!
            </button>

            {/* Dismiss link */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: "none",
                border: "none",
                color: "#9ca3af",
                fontSize: "13px",
                cursor: "pointer",
                marginTop: "12px",
                textDecoration: "underline",
                display: "block",
                width: "100%",
              }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  )
}
