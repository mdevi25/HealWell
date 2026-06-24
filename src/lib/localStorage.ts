// Exact localStorage key names per spec Section 3.1 — do not rename
export const KEYS = {
    profile: "healwell.profile",
    checkins: "healwell.checkins",
    deviceId: "healwell.deviceId",
    language: "healwell.language",
  } as const
  
  export type Language = "en" | "es" | "hi" | "gu"
  export type Plan = "free" | "pro"
  
  export interface Profile {
    standsLongHours: boolean
    industry: string
    language: Language
    createdAt: string
  }
  
  // Exact check-in shape per spec Section 3.2
  export interface CheckIn {
    date: string           // ISO date string e.g. "2026-06-23"
    hoursWorked: number
    sleepHours: number
    energy: number         // 1–10
    wornOut: number        // 1–10
    movements: string[]    // movement keys
    recoveryScore: number
    riskLevel: "low" | "moderate" | "high"
  }
  
  // ── Language ──────────────────────────────────────────────
  export function getLanguage(): Language {
    if (typeof window === "undefined") return "en"
    return (localStorage.getItem(KEYS.language) as Language) || "en"
  }
  
  export function setLanguage(lang: Language): void {
    localStorage.setItem(KEYS.language, lang)
  }
  
  // ── Profile ───────────────────────────────────────────────
  export function getProfile(): Profile | null {
    if (typeof window === "undefined") return null
    const raw = localStorage.getItem(KEYS.profile)
    return raw ? (JSON.parse(raw) as Profile) : null
  }
  
  export function setProfile(profile: Profile): void {
    localStorage.setItem(KEYS.profile, JSON.stringify(profile))
  }
  
  // ── Check-ins ─────────────────────────────────────────────
  export function getCheckins(): CheckIn[] {
    if (typeof window === "undefined") return []
    const raw = localStorage.getItem(KEYS.checkins)
    return raw ? (JSON.parse(raw) as CheckIn[]) : []
  }
  
  export function getTodayCheckin(): CheckIn | null {
    const today = new Date().toISOString().split("T")[0]
    return getCheckins().find((c) => c.date === today) || null
  }
  
  // One check-in per date — overwrites if exists, never duplicates
  export function saveCheckin(checkin: CheckIn): void {
    const all = getCheckins()
    const idx = all.findIndex((c) => c.date === checkin.date)
    if (idx >= 0) {
      all[idx] = checkin
    } else {
      all.push(checkin)
    }
    localStorage.setItem(KEYS.checkins, JSON.stringify(all))
  }
  
  // ── Plan (freemium — UI only) ─────────────────────────────
  export function getPlan(): Plan {
    if (typeof window === "undefined") return "free"
    return (localStorage.getItem("healwell.plan") as Plan) || "free"
  }