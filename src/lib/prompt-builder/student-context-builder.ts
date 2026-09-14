/**
 * FLUENTO PROMPT BUILDER - STUDENT CONTEXT BUILDER
 * 
 * Formats student proficiency level, emotional state, anxiety, confidence scores,
 * and primary goals into a structured context section.
 */

import { StudentContextSection } from './types';
import { StudentLearningState } from '@/src/lib/learning-engine';

export class StudentContextBuilder {
  public buildSection(studentState: StudentLearningState): StudentContextSection {
    const anxietyText = studentState.speakingAnxietyLevel >= 65
      ? `ELEVADA (${studentState.speakingAnxietyLevel}/100) - Exige alta empatia e zero pressão`
      : studentState.speakingAnxietyLevel >= 40
      ? `MODERADA (${studentState.speakingAnxietyLevel}/100) - Requer apoio e paciência`
      : `BAIXA (${studentState.speakingAnxietyLevel}/100) - Aluno confortável`;

    const summary = `Aluno de nível ${studentState.currentCefr} com objetivo em '${studentState.primaryGoal}'. Energia: ${studentState.energyLevel}/10. Confiança oral: ${studentState.confidenceScores.speaking}/100.`;

    const goals = [studentState.primaryGoal];
    if (studentState.preferredContext) {
      goals.push(`Contexto de interesse: ${studentState.preferredContext}`);
    }

    return {
      studentProfileSummary: summary,
      currentCefrLevel: `CEFR ${studentState.currentCefr} (${studentState.framework})`,
      emotionalStateAndAnxiety: `Nível de Ansiedade Oral: ${anxietyText}`,
      primaryGoalsAndInterests: goals
    };
  }
}

export const studentContextBuilder = new StudentContextBuilder();
