/**
 * route.ts — POST /api/event
 *
 * Logs anonymous feature usage to Neon Postgres.
 * Called fire-and-forget from every page on mount.
 *
 * Data stored: deviceId, feature, language, timestamp
 * Data NOT stored: any health data, check-in contents, story text
 *
 * Always returns 200 — failures are silent so the UI never breaks.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { deviceId, feature, language } = await req.json()

    if (!deviceId || !feature) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      INSERT INTO events (device_id, feature, language)
      VALUES (${deviceId}, ${feature}, ${language ?? "en"})
    `

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Silent failure — never break the UI
    console.error("Event logging error:", err)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}