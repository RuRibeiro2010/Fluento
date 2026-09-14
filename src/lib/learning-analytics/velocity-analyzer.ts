/**
 * FLUENTO LEARNING ANALYTICS - VELOCITY ANALYZER
 * 
 * Measures CEFR progression speed, concept mastery rate per week,
 * and estimates weeks required to reach target CEFR level.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { ThreadSnapshot } from '@/src/lib/learning-threads';
import { VelocityMetric } from './types';
import { CEFRLevel } from '@/types/brain';

export class VelocityAnalyzer {
  private cefrNumericMap: Record<CEFRLevel, number> = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6
  };

  public analyzeVelocity(
    twin: StudentDigitalTwinState,
    threads: ThreadSnapshot
  ): VelocityMetric {
    const currentCefr = twin.language.currentCefr || 'A2';
    const targetCefr = twin.goal.targetCefrGoal || 'B2';

    const currentLevelNum = this.cefrNumericMap[currentCefr] || 2;
    const targetLevelNum = this.cefrNumericMap[targetCefr] || 4;
    const levelDistance = Math.max(0, targetLevelNum - currentLevelNum);

    // Mastery rate calculated from permanent successes and resolved difficulties
    const totalMastered = threads.successes.length + threads.difficulties.filter(d => d.isResolved).length;
    const sessionsCount = Math.max(1, twin.behaviour.completedSessionsCount || 1);

    // Assume 3 sessions per week on average
    const estimatedWeeksActive = Math.max(0.5, sessionsCount / 3);
    const masteryRatePerWeek = Math.round((totalMastered / estimatedWeeksActive) * 10) / 10;

    // Standard CEFR gap requires ~15 mastered concepts per CEFR level
    const remainingConceptsNeeded = levelDistance * 15;
    const estimatedWeeksToTargetCefr = masteryRatePerWeek > 0
      ? Math.ceil(remainingConceptsNeeded / masteryRatePerWeek)
      : levelDistance * 12;

    let velocityRating: 'accelerated' | 'steady' | 'sluggish' | 'stalled' = 'steady';
    if (masteryRatePerWeek >= 4.0) {
      velocityRating = 'accelerated';
    } else if (masteryRatePerWeek >= 2.0) {
      velocityRating = 'steady';
    } else if (masteryRatePerWeek >= 0.8) {
      velocityRating = 'sluggish';
    } else {
      velocityRating = 'stalled';
    }

    return {
      currentCefr,
      targetCefr,
      masteryRatePerWeek,
      estimatedWeeksToTargetCefr,
      velocityRating,
      evaluationNote: `Velocidade de aprendizagem ${velocityRating}: ~${masteryRatePerWeek} conceitos dominados/semana.`
    };
  }
}

export const velocityAnalyzer = new VelocityAnalyzer();
