/**
 * FLUENTO TEACHER RUNTIME - TEACHER RESPONSE STYLE
 * 
 * Enforces response brevity and conversational dynamics: 1-3 sentences (15-40 words),
 * mandatory ending with open question or gentle prompt, zero teacher monologues.
 */

import { ResponseStyleDirective, TeacherEvaluationInput, EndingPattern } from './types';

export class TeacherResponseStyle {
  /**
   * Computes response style directive.
   */
  public computeResponseStyle(input: TeacherEvaluationInput): ResponseStyleDirective {
    const anxiety = input.studentAnxietyLevel ?? input.studentState.speakingAnxietyLevel ?? 30;
    const affectiveFilter = input.affectiveFilterState ?? 'optimal';

    let maxSentenceCount = 2; // Default 1-2 sentences
    let targetWordCountLimit = 30; // Max 30 words default
    let endingPattern: EndingPattern = 'open_question';
    const preventMonologue = true;

    if (affectiveFilter === 'panic' || anxiety > 70) {
      maxSentenceCount = 1;
      targetWordCountLimit = 18;
      endingPattern = 'reassuring_pause';
    } else if (input.studentState.currentCefr === 'A1') {
      maxSentenceCount = 2;
      targetWordCountLimit = 20;
      endingPattern = 'gentle_prompt';
    } else {
      maxSentenceCount = 3;
      targetWordCountLimit = 35;
      endingPattern = 'open_question';
    }

    return {
      maxSentenceCount,
      targetWordCountLimit,
      endingPattern,
      preventMonologue
    };
  }
}

export const teacherResponseStyle = new TeacherResponseStyle();
