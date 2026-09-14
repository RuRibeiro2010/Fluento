/**
 * FLUENTO LEARNING ANALYTICS - INDEPENDENCE ANALYZER
 * 
 * Measures student communication independence based on student talk time ratio,
 * turn cadence, and help-seeking tendencies (unscaffolded interaction).
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { IndependenceMetric } from './types';

export class IndependenceAnalyzer {
  public analyzeIndependence(twin: StudentDigitalTwinState): IndependenceMetric {
    const behaviour = twin.behaviour;

    // avgTalkTimeRatio is e.g. 0.65 (65% student talk time)
    const talkRatio = behaviour.avgTalkTimeRatio || 0.50;
    const cadenceSeconds = behaviour.turnCadenceSeconds || 4.0;
    const helpTendency = behaviour.helpSeekingTendency || 'balanced';

    // Calculate unassisted turn ratio score (0 - 100)
    const talkRatioScore = Math.min(100, Math.round(talkRatio * 100));

    let helpDeduction = 0;
    let scaffoldDependencyLevel: 'none' | 'minimal' | 'moderate' | 'heavy' = 'moderate';

    if (helpTendency === 'independent') {
      helpDeduction = 0;
      scaffoldDependencyLevel = talkRatioScore > 75 ? 'none' : 'minimal';
    } else if (helpTendency === 'balanced') {
      helpDeduction = 10;
      scaffoldDependencyLevel = 'moderate';
    } else {
      helpDeduction = 25;
      scaffoldDependencyLevel = 'heavy';
    }

    // Cadence factor: fast cadence (< 3s) indicates fluent spontaneity
    let cadenceBonus = 0;
    if (cadenceSeconds <= 3.0) cadenceBonus = 10;
    else if (cadenceSeconds > 6.0) cadenceBonus = -10;

    const finalIndependenceScore = Math.min(
      100,
      Math.max(0, Math.round(talkRatioScore - helpDeduction + cadenceBonus))
    );

    return {
      score: finalIndependenceScore,
      unassistedTurnRatio: Math.min(1.0, Math.max(0.0, talkRatio)),
      scaffoldDependencyLevel,
      avgResponseDelaySeconds: cadenceSeconds,
      evaluationNote: `Independência comunicativa de ${finalIndependenceScore}/100 com dependência de suporte ${scaffoldDependencyLevel}.`
    };
  }
}

export const independenceAnalyzer = new IndependenceAnalyzer();
