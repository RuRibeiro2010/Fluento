import { StudentModel } from '@/types/brain';

export type ExplanationStyle =
  | 'simple'
  | 'technical'
  | 'daily_life'
  | 'native_comparison'
  | 'guided_exercise';

export interface ExplanationPayload {
  concept: string;
  targetLanguage: string;
  nativeLanguage: string;
  stylePreference?: ExplanationStyle;
  studentModel?: StudentModel;
}

export interface ExplanationResult {
  concept: string;
  selectedStyle: ExplanationStyle;
  explanationText: string;
  guidedExercisePrompt?: string;
}

/**
 * Explanation Engine
 * Explains concepts using multiple approaches (simple, technical, daily life, native comparison, guided exercise).
 * Automatically selects the optimal approach based on student profile.
 */
export class ExplanationEngine {
  /**
   * Selects best explanation style based on student profile
   */
  public selectBestStyle(studentModel?: StudentModel): ExplanationStyle {
    if (!studentModel) return 'daily_life';

    if (studentModel.learningStyle === 'visual' || studentModel.learningStyle === 'kinesthetic') {
      return 'guided_exercise';
    }

    if (studentModel.currentCefr === 'A1' || studentModel.confidenceScore < 60) {
      return 'simple';
    }

    if (studentModel.currentCefr === 'C1' || studentModel.currentCefr === 'C2') {
      return 'technical';
    }

    return 'daily_life';
  }

  /**
   * Generates a multi-style explanation tailored to the student.
   */
  public generateExplanation(payload: ExplanationPayload): ExplanationResult {
    const { concept, targetLanguage, nativeLanguage, stylePreference, studentModel } = payload;

    const selectedStyle = stylePreference || this.selectBestStyle(studentModel);

    let explanationText = '';
    let guidedExercisePrompt: string | undefined = undefined;

    switch (selectedStyle) {
      case 'simple':
        explanationText = `Keep it super simple: "${concept}" means doing an action right now. No complicated grammar rules needed!`;
        break;

      case 'technical':
        explanationText = `Linguistic Breakdown: "${concept}" functions as a continuous aspect auxiliary verb combined with the present participle (-ando / -iendo in Spanish, -ing in English).`;
        break;

      case 'native_comparison':
        explanationText = `Native Language Bridge (${nativeLanguage.toUpperCase()}): "${concept}" works exactly like saying "estou a fazer" / "estoy haciendo" in everyday speech.`;
        break;

      case 'guided_exercise':
        explanationText = `Let's build this together step by step!`;
        guidedExercisePrompt = `Step 1: Choose a subject (e.g. Yo / I). Step 2: Add "${concept}". Step 3: Complete with an activity!`;
        break;

      case 'daily_life':
      default:
        explanationText = `Everyday Scenario: Imagine ordering coffee or chatting with a colleague about your daily routines—"${concept}" is what you use when describing your current project.`;
        break;
    }

    return {
      concept,
      selectedStyle,
      explanationText,
      guidedExercisePrompt,
    };
  }
}

export const defaultExplanationEngine = new ExplanationEngine();
