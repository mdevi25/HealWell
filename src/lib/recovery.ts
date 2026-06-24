// Recovery score weights — tunable in one place per spec Section 3.3
export const RECOVERY_WEIGHTS = {
    wornOutMultiplier: 5,
    hoursOverEightMultiplier: 2,
    sleepDeficitMultiplier: 4,
    energyDeficitMultiplier: 1.5,
  } as const
  
  export type RiskLevel = "low" | "moderate" | "high"
  
  export interface RecoveryResult {
    score: number
    riskLevel: RiskLevel
  }
  
  export function calculateRecovery(
    wornOut: number,
    hoursWorked: number,
    sleepHours: number,
    energy: number
  ): RecoveryResult {
    const raw =
      100 -
      wornOut * RECOVERY_WEIGHTS.wornOutMultiplier -
      Math.max(0, hoursWorked - 8) * RECOVERY_WEIGHTS.hoursOverEightMultiplier -
      Math.max(0, 7 - sleepHours) * RECOVERY_WEIGHTS.sleepDeficitMultiplier -
      (10 - energy) * RECOVERY_WEIGHTS.energyDeficitMultiplier
  
    const score = Math.min(100, Math.max(0, raw))
  
    const riskLevel: RiskLevel =
      score >= 70 ? "low" : score >= 40 ? "moderate" : "high"
  
    return { score: Math.round(score), riskLevel }
  }