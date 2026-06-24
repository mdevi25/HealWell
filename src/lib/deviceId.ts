const DEVICE_ID_KEY = "healwell.deviceId"

export function getDeviceId(): string {
  if (typeof window === "undefined") return ""

  const existing = localStorage.getItem(DEVICE_ID_KEY)
  if (existing) return existing

  // Generate a simple UUID v4
  const newId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    }
  )

  localStorage.setItem(DEVICE_ID_KEY, newId)
  return newId
}