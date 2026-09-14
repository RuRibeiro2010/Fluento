/**
 * FLUENTO LEARNING ENGINE - FLOW ENGINE
 * 
 * Flow State and Cognitive Load monitor based on Csikszentmihalyi's Flow Theory
 * and Sweller's Cognitive Load Theory.
 * Ensures optimal balance between challenge and skill to keep the student engaged.
 */

import { StudentLearningState, FlowMetrics } from './types';

export class FlowEngine {
  /**
   * Evaluates the current Flow state and Cognitive Load metrics for a student.
   */
  public evaluateFlowState(
    studentState: StudentLearningState,
    recentAccuracyPercent: number = 75,
    recentHesitationCount: number = 2
  ): FlowMetrics {
    const { energyLevel, fatigueScore, speakingAnxietyLevel, confidenceScores } = studentState;

    // Estimate cognitive load (Sweller)
    // Higher fatigue, hesitation, anxiety increase cognitive load
    const intrinsicLoad = (100 - confidenceScores.overall) * 0.4;
    const germaneLoad = energyLevel * 5;
    const extraneousLoad = (speakingAnxietyLevel * 0.3) + (fatigueScore * 0.3) + (recentHesitationCount * 5);
    
    const cognitiveLoadScore = Math.min(100, Math.round(intrinsicLoad + germaneLoad + extraneousLoad));

    // Challenge / Skill balance calculation
    // Ideal balance happens when Challenge = Skill + 10% (Zone of Proximal Development)
    const perceivedSkill = (confidenceScores.speaking + confidenceScores.vocabulary + confidenceScores.grammar) / 3;
    const perceivedChallenge = 100 - (recentAccuracyPercent * 0.8) + (extraneousLoad * 0.3);

    const challengeSkillRatio = perceivedSkill > 0 ? perceivedChallenge / perceivedSkill : 1.0;

    const boredomRisk = challengeSkillRatio < 0.65 && perceivedSkill > 50;
    const overwhelmRisk = challengeSkillRatio > 1.45 || cognitiveLoadScore > 85 || speakingAnxietyLevel > 75;

    // Calculate Flow State Index (0 - 100)
    let flowStateIndex = 100 - Math.abs(1.0 - challengeSkillRatio) * 50 - (fatigueScore * 0.2);
    flowStateIndex = Math.min(100, Math.max(0, Math.round(flowStateIndex)));

    // Recommendation
    let recommendedAdjustment: 'increase_challenge' | 'maintain' | 'lower_challenge' | 'take_break' = 'maintain';
    if (fatigueScore >= 80 || cognitiveLoadScore >= 90) {
      recommendedAdjustment = 'take_break';
    } else if (overwhelmRisk) {
      recommendedAdjustment = 'lower_challenge';
    } else if (boredomRisk) {
      recommendedAdjustment = 'increase_challenge';
    }

    return {
      cognitiveLoadScore,
      challengeSkillBalance: Math.round(Math.min(100, 100 - Math.abs(1.0 - challengeSkillRatio) * 40)),
      flowStateIndex,
      boredomRisk,
      overwhelmRisk,
      recommendedAdjustment
    };
  }
}

export const flowEngine = new FlowEngine();
