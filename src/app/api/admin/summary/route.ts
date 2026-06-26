/**
 * route.ts — GET /api/admin/summary
 *
 * Returns aggregated anonymous usage stats for the admin dashboard.
 * Password protected via ADMIN_PASSWORD environment variable.
 *
 * Returns:
 * - totalEvents: total feature usage events
 * - activeDevices: unique devices in last 7 days
 * - featureBreakdown: events per feature
 * - feedbackSummary: thumbs up/down counts per feature
 * - languageBreakdown: events per language
 *
 * No individual user data is ever returned.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Password check
    const password = req.nextUrl.searchParams.get("password")
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Total events
    const [{ count: totalEvents }] = await sql`
      SELECT COUNT(*) as count FROM events
    `

    // Active unique devices last 7 days
    const [{ count: activeDevices }] = await sql`
      SELECT COUNT(DISTINCT device_id) as count
      FROM events
      WHERE created_at > NOW() - INTERVAL '7 days'
    `

    // Feature breakdown
    const featureBreakdown = await sql`
      SELECT feature, COUNT(*) as count
      FROM events
      GROUP BY feature
      ORDER BY count DESC
    `

    // Feedback summary
    const feedbackSummary = await sql`
      SELECT feature, rating, COUNT(*) as count
      FROM feedback
      GROUP BY feature, rating
      ORDER BY feature, rating
    `

    // Language breakdown
    const languageBreakdown = await sql`
      SELECT language, COUNT(*) as count
      FROM events
      GROUP BY language
      ORDER BY count DESC
    `

    return NextResponse.json({
      totalEvents:      Number(totalEvents),
      activeDevices:    Number(activeDevices),
      featureBreakdown: featureBreakdown.map((r) => ({
        feature: r.feature,
        count:   Number(r.count),
      })),
      feedbackSummary: feedbackSummary.map((r) => ({
        feature: r.feature,
        rating:  r.rating,
        count:   Number(r.count),
      })),
      languageBreakdown: languageBreakdown.map((r) => ({
        language: r.language,
        count:    Number(r.count),
      })),
    })
  } catch (err) {
    console.error("Admin summary error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}