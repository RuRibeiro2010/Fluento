import { ContextualEncouragement } from '@/types/experience';
import { StudentModel } from '@/types/brain';

/**
 * Encouragement Service
 * Generates adult, professional, and evidence-based positive feedback.
 * Strictly avoids generic superficial praise ("Good job!", "Yay!").
 */
export class EncouragementService {
  /**
   * Generates evidence-based feedback highlighting specific linguistic evolution.
   */
  public generateEncouragement(
    studentModel: StudentModel,
    observedImprovementArea: string,
    confidenceDelta: number
  ): ContextualEncouragement {
    const lang = studentModel.targetLanguage?.toUpperCase() || 'SPANISH';

    if (confidenceDelta > 5) {
      return {
        message: `Notice how smoothly you navigated ${observedImprovementArea} in ${lang} without pausing to translate in your head. That reveals genuine neurological instinct building.`,
        tone: 'analytical_praise',
        focusArea: observedImprovementArea,
        confidenceDelta,
      };
    }

    if (confidenceDelta < 0) {
      return {
        message: `Complex grammar structures in ${lang} naturally require multiple exposure cycles before reaching active fluency. Your effort on ${observedImprovementArea} today was solid foundation work.`,
        tone: 'reassuring_coach',
        focusArea: observedImprovementArea,
        confidenceDelta,
      };
    }

    return {
      message: `Your consistency in practicing ${observedImprovementArea} in ${lang} is solidifying your core vocabulary retention. Keep this steady momentum.`,
      tone: 'professional_warm',
      focusArea: observedImprovementArea,
      confidenceDelta: 2,
    };
  }
}

export const defaultEncouragementService = new EncouragementService();
