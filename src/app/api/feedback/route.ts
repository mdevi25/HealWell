/**
 * route.ts — POST /api/feedback
 *
 * Logs anonymous thumbs up/down feedback to Neon Postgres.
 * Called fire-and-forget from ThumbsFeedback component.
 *
 * Data stored: deviceId, feature, rating, language, timestamp
 * Data NOT stored: any health data, story content
 *
 * NODE_TLS_REJECT_UNAUTHORIZED=0 bypasses SSL verification
 * required for corporate networks with SSL inspection.
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { deviceId, feature, rating, language } = await req.json()

    if (!deviceId || !feature || !rating) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    if (!["up", "down"].includes(rating)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      INSERT INTO feedback (device_id, feature, rating, language)
      VALUES (${deviceId}, ${feature}, ${rating}, ${language ?? "en"})
    `

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Feedback logging error:", err)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}