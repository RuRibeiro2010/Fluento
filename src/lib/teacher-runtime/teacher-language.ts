/**
 * FLUENTO TEACHER RUNTIME - TEACHER LANGUAGE
 * 
 * Controls language scaffolding ratios (English vs Portuguese), vocabulary complexity,
 * sentence length boundaries, and Portuguese clarification triggers based on student CEFR level and anxiety.
 */

import { LanguageDirective, TeacherEvaluationInput, VocabularyComplexity, PortugueseScaffoldingLevel } from './types';

export class TeacherLanguage {
  /**
   * Computes language scaffolding directive.
   */
  public computeLanguageDirective(input: TeacherEvaluationInput): LanguageDirective {
    const cefr = input.studentState.currentCefr || 'A2';
    const anxiety = input.studentAnxietyLevel ?? input.studentState.speakingAnxietyLevel ?? 30;
    const affectiveFilter = input.affectiveFilterState ?? 'optimal';

    let targetLanguageRatio = 80; // 80% English default
    let portugueseScaffoldingLevel: PortugueseScaffoldingLevel = 'minimal';
    let vocabularyComplexity: VocabularyComplexity = 'A2_accessible';
    let maxWordsPerSentence = 12;
    let allowPortugueseClarification = true;

    // Adjust based on CEFR level
    switch (cefr) {
      case 'A1':
        targetLanguageRatio = 60;
        portugueseScaffoldingLevel = 'high';
        vocabularyComplexity = 'A1_simple';
        maxWordsPerSentence = 8;
        break;
      case 'A2':
        targetLanguageRatio = 75;
        portugueseScaffoldingLevel = 'moderate';
        vocabularyComplexity = 'A2_accessible';
        maxWordsPerSentence = 12;
        break;
      case 'B1':
        targetLanguageRatio = 90;
        portugueseScaffoldingLevel = 'minimal';
        vocabularyComplexity = 'B1_conversational';
        maxWordsPerSentence = 16;
        break;
      case 'B2':
      case 'C1':
      case 'C2':
        targetLanguageRatio = 98;
        portugueseScaffoldingLevel = 'none';
        vocabularyComplexity = 'B2_expressive';
        maxWordsPerSentence = 20;
        break;
    }

    // Adjust if student is in high anxiety or panic state
    if (affectiveFilter === 'panic' || anxiety > 70) {
      targetLanguageRatio = Math.max(40, targetLanguageRatio - 30);
      portugueseScaffoldingLevel = 'high';
      maxWordsPerSentence = Math.min(8, maxWordsPerSentence);
      allowPortugueseClarification = true;
    }

    return {
      targetLanguageRatio,
      portugueseScaffoldingLevel,
      vocabularyComplexity,
      maxWordsPerSentence,
      allowPortugueseClarification
    };
  }
}

export const teacherLanguage = new TeacherLanguage();
