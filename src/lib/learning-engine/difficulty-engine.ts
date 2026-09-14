/**
 * FLUENTO LEARNING ENGINE - DIFFICULTY ENGINE
 * 
 * Adjusts lesson and conversation difficulty dynamically based on the student's
 * CEFR level, performance, cognitive load, fatigue, and confidence.
 * Implements Krashen's i+1 Input Hypothesis and Sweller's Cognitive Load Theory.
 */

import { StudentLearningState, DifficultyParameters, FlowMetrics } from './types';
import { CEFRLevel } from '@/types/brain';

export class DifficultyEngine {
  /**
   * Calculates granular difficulty parameters for the current session.
   */
  public calculateDifficulty(
    studentState: StudentLearningState,
    flowMetrics?: FlowMetrics
  ): DifficultyParameters {
    const { currentCefr, energyLevel, fatigueScore, speakingAnxietyLevel, confidenceScores } = studentState;

    let difficultyDelta: 'increase' | 'maintain' | 'lower' = 'maintain';

    // Lower difficulty if fatigued, highly anxious, or overwhelmed
    if (fatigueScore >= 70 || energyLevel <= 3 || speakingAnxietyLevel >= 70 || flowMetrics?.overwhelmRisk) {
      difficultyDelta = 'lower';
    } 
    // Increase difficulty if high confidence, high energy, and balanced/bored
    else if (
      confidenceScores.overall >= 75 &&
      energyLevel >= 7 &&
      fatigueScore <= 30 &&
      (flowMetrics?.boredomRisk || confidenceScores.speaking >= 80)
    ) {
      difficultyDelta = 'increase';
    }

    // Baseline values according to CEFR
    const cefrBaseline = this.getCefrBaseline(currentCefr);

    // Apply delta modifications
    let lexicalDensity = cefrBaseline.lexicalDensity;
    let sentenceComplexity = cefrBaseline.sentenceComplexity;
    let speechRateMultiplier = cefrBaseline.speechRateMultiplier;
    let scaffoldingPromptRatio = cefrBaseline.scaffoldingPromptRatio;

    if (difficultyDelta === 'lower') {
      lexicalDensity = Math.max(20, lexicalDensity - 15);
      sentenceComplexity = Math.max(20, sentenceComplexity - 20);
      speechRateMultiplier = Math.max(0.75, speechRateMultiplier - 0.15);
      scaffoldingPromptRatio = Math.min(90, scaffoldingPromptRatio + 25);
    } else if (difficultyDelta === 'increase') {
      lexicalDensity = Math.min(95, lexicalDensity + 10);
      sentenceComplexity = Math.min(95, sentenceComplexity + 10);
      speechRateMultiplier = Math.min(1.20, speechRateMultiplier + 0.10);
      scaffoldingPromptRatio = Math.max(10, scaffoldingPromptRatio - 15);
    }

    return {
      currentCefr,
      difficultyDelta,
      lexicalDensity,
      sentenceComplexity,
      speechRateMultiplier,
      scaffoldingPromptRatio,
      allowNativeHints: currentCefr === 'A1' || speakingAnxietyLevel >= 60
    };
  }

  /**
   * Internal baseline helper for CEFR levels.
   */
  private getCefrBaseline(level: CEFRLevel) {
    switch (level) {
      case 'A1':
        return { lexicalDensity: 35, sentenceComplexity: 30, speechRateMultiplier: 0.80, scaffoldingPromptRatio: 70 };
      case 'A2':
        return { lexicalDensity: 50, sentenceComplexity: 45, speechRateMultiplier: 0.88, scaffoldingPromptRatio: 50 };
      case 'B1':
        return { lexicalDensity: 65, sentenceComplexity: 60, speechRateMultiplier: 0.95, scaffoldingPromptRatio: 35 };
      case 'B2':
        return { lexicalDensity: 78, sentenceComplexity: 75, speechRateMultiplier: 1.00, scaffoldingPromptRatio: 20 };
      case 'C1':
        return { lexicalDensity: 88, sentenceComplexity: 85, speechRateMultiplier: 1.05, scaffoldingPromptRatio: 10 };
      case 'C2':
      default:
        return { lexicalDensity: 95, sentenceComplexity: 95, speechRateMultiplier: 1.10, scaffoldingPromptRatio: 5 };
    }
  }
}

export const difficultyEngine = new DifficultyEngine();
