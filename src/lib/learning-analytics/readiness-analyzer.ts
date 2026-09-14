/**
 * FLUENTO LEARNING ANALYTICS - READINESS ANALYZER
 * 
 * Computes Real-World Readiness for professional, travel/social,
 * and spontaneous communicative contexts.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { ThreadSnapshot } from '@/src/lib/learning-threads';
import { ReadinessMetric } from './types';

export class ReadinessAnalyzer {
  public analyzeReadiness(
    twin: StudentDigitalTwinState,
    threads: ThreadSnapshot
  ): ReadinessMetric {
    const lang = twin.language;
    const goal = twin.goal;

    const professionalDomainActive = Boolean(goal.professionalDomain);

    // Sub-scores
    const professionalReadinessScore = Math.min(
      100,
      Math.round(lang.grammarMasteryScore * 0.4 + lang.listeningComprehensionScore * 0.3 + (professionalDomainActive ? 20 : 10))
    );

    const travelSocialReadinessScore = Math.min(
      100,
      Math.round(lang.fluencyScore * 0.5 + lang.pronunciationScore * 0.3 + twin.emotional.confidenceScores.speaking * 0.2)
    );

    const spontaneityScore = Math.min(
      100,
      Math.round(lang.fluencyScore * 0.6 + (100 - twin.emotional.baselineAnxietyLevel) * 0.4)
    );

    const overallReadinessScore = Math.round(
      professionalReadinessScore * 0.35 +
      travelSocialReadinessScore * 0.35 +
      spontaneityScore * 0.30
    );

    let readinessLevel: 'emerging' | 'functional' | 'proficient' | 'autonomous' = 'functional';
    if (overallReadinessScore >= 85) {
      readinessLevel = 'autonomous';
    } else if (overallReadinessScore >= 70) {
      readinessLevel = 'proficient';
    } else if (overallReadinessScore >= 50) {
      readinessLevel = 'functional';
    } else {
      readinessLevel = 'emerging';
    }

    return {
      overallReadinessScore,
      professionalReadinessScore,
      travelSocialReadinessScore,
      spontaneityScore,
      readinessLevel,
      evaluationNote: `Prontidão para o mundo real no nível ${readinessLevel} (${overallReadinessScore}/100).`
    };
  }
}

export const readinessAnalyzer = new ReadinessAnalyzer();
