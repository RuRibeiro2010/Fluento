/**
 * Teaching Evolution Module (Fluento Intelligence 1.0 - Phase 16)
 * Measures pedagogical strategy efficacy and adjusts strategy weights
 * in a gradual, non-disruptive, and reversible manner.
 */

export interface StrategyEfficacyRecord {
  strategyName: string;
  totalSessionsApplied: number;
  averageAccuracyGain: number;
  averageRetentionRate: number;
  userSatisfactionScore: number; // 1.0 to 5.0
  efficacyWeight: number; // 0.5 to 1.5
}

export function evaluateStrategyEfficacy(
  records: StrategyEfficacyRecord[]
): StrategyEfficacyRecord[] {
  return records.map((record) => {
    // Calculate new efficacy multiplier based on retention and accuracy gain
    const score = record.averageRetentionRate * 0.6 + record.averageAccuracyGain * 0.4;
    let newWeight = record.efficacyWeight;

    if (score > 80 && record.totalSessionsApplied >= 5) {
      newWeight = Math.min(1.5, record.efficacyWeight + 0.05);
    } else if (score < 60 && record.totalSessionsApplied >= 5) {
      newWeight = Math.max(0.5, record.efficacyWeight - 0.05);
    }

    return {
      ...record,
      efficacyWeight: Number(newWeight.toFixed(2)),
    };
  });
}
