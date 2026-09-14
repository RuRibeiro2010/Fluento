/**
 * Learning ROI Engine (Sprint A)
 * Evaluates pedagogical activities for "Learning Yield per Minute":
 * Ensures student time is never spent on low-value repetitive drills.
 * Compares candidates and selects highest yield option for student's exact state.
 */

import { LearningROIEvaluation } from './journey-orchestrator-types';

export class LearningRoiEngine {
  /**
   * Evaluates the Learning Return on Investment (ROI) for candidate activities.
   */
  public static evaluateActivityROI(
    activityTitle: string,
    estimatedMinutes: number,
    cognitiveLoad: 'low' | 'moderate' | 'high',
    targetSkill: string,
    studentFatigueScore: number // 0-10
  ): LearningROIEvaluation {
    // High-yield skills (active speaking/roleplay/spontaneous response) vs passive repetition
    const isHighYieldSkill =
      targetSkill.includes('speaking') ||
      targetSkill.includes('roleplay') ||
      targetSkill.includes('fluency') ||
      targetSkill.includes('transfer');

    let baseYield = isHighYieldSkill ? 88 : 65;

    // Adjust yield based on cognitive load vs fatigue
    if (studentFatigueScore >= 7 && cognitiveLoad === 'high') {
      // High load when exhausted leads to diminishing returns and frustration
      baseYield -= 35;
    } else if (studentFatigueScore <= 3 && cognitiveLoad === 'high') {
      // High load when fresh yields maximum retention
      baseYield += 10;
    }

    const learningYieldPerMinute = Math.min(100, Math.max(10, Math.round((baseYield / estimatedMinutes) * 12)));
    const expectedCompetencyGain = Math.min(100, Math.round(learningYieldPerMinute * 0.85));

    let recommendationDecision: LearningROIEvaluation['recommendationDecision'] = 'proceed';
    let alternativeComparison = `Atividade "${activityTitle}" apresenta elevado ROI de aprendizagem (${learningYieldPerMinute}/100) para o estado atual.`;

    if (learningYieldPerMinute < 45) {
      recommendationDecision = 'replace_with_higher_roi';
      alternativeComparison = `Substituída drill passivo por simulação prática com maior taxa de retenção por minuto.`;
    } else if (estimatedMinutes > 20 && studentFatigueScore >= 6) {
      recommendationDecision = 'optimize_duration';
      alternativeComparison = `Duração otimizada para 12 minutos para preservar estado de Flow e evitar fadiga.`;
    }

    return {
      activityTitle,
      learningYieldPerMinute,
      timeCostMinutes: estimatedMinutes,
      expectedCompetencyGain,
      alternativeComparison,
      recommendationDecision,
    };
  }
}
