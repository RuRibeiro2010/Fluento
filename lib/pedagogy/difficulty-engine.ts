import { StudentModel, WeaknessAnalysis } from '@/types/brain';

export interface DifficultyParameters {
  action: 'increase' | 'maintain' | 'lower';
  scaffoldingLevel: 'high' | 'medium' | 'minimal' | 'none';
  speechRateMultiplier: number; // 0.75 - 1.15
  sentenceComplexity: 'simple_direct' | 'compound' | 'complex_subordinate' | 'advanced_idiomatic';
  maxExercisesPerBlock: number;
  positiveReinforcementRequired: boolean;
  rationale: string;
}

/**
 * Difficulty Engine
 * Calculates dynamic pedagogical difficulty adjustments (+/- scaffolding, speech rate, sentence complexity)
 * based on student accuracy, recent struggles, confidence, and silence duration.
 */
export class DifficultyEngine {
  /**
   * Calculates dynamic difficulty parameters
   */
  public calculateDifficulty(
    studentModel: StudentModel,
    weakness: WeaknessAnalysis
  ): DifficultyParameters {
    const accuracy = Math.round(
      (studentModel.grammarMasteryPercent +
        studentModel.vocabularyMasteryPercent +
        studentModel.listeningMasteryPercent +
        studentModel.speakingMasteryPercent +
        studentModel.readingMasteryPercent +
        studentModel.writingMasteryPercent) /
        6
    );
    const confidence = studentModel.confidenceScore || 70;
    const weaknessDensity = weakness.overallWeaknessScore || 30;

    if (accuracy < 65 || confidence < 55 || weaknessDensity > 60) {
      return {
        action: 'lower',
        scaffoldingLevel: 'high',
        speechRateMultiplier: 0.8,
        sentenceComplexity: 'simple_direct',
        maxExercisesPerBlock: 2,
        positiveReinforcementRequired: true,
        rationale: `Lowering difficulty: Accuracy (${accuracy}%) or Confidence (${confidence}%) requires higher scaffolding and slower speech rate.`,
      };
    }

    if (accuracy > 88 && confidence > 82 && weaknessDensity < 25) {
      return {
        action: 'increase',
        scaffoldingLevel: 'minimal',
        speechRateMultiplier: 1.05,
        sentenceComplexity: 'complex_subordinate',
        maxExercisesPerBlock: 4,
        positiveReinforcementRequired: false,
        rationale: `Increasing difficulty: Strong accuracy (${accuracy}%) and confidence (${confidence}%) justify faster pace and higher syntax density.`,
      };
    }

    return {
      action: 'maintain',
      scaffoldingLevel: 'medium',
      speechRateMultiplier: 0.95,
      sentenceComplexity: 'compound',
      maxExercisesPerBlock: 3,
      positiveReinforcementRequired: false,
      rationale: `Maintaining standard difficulty balanced for current level ${studentModel.currentCefr}.`,
    };
  }
}

export const defaultDifficultyEngine = new DifficultyEngine();
