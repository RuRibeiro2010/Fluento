/**
 * FLUENTO TEACHER RUNTIME - TEACHER PRESENCE
 * 
 * Controls teacher conversational role, active listening markers, speech pace,
 * and mandatory effort validation to ensure high student talk-time.
 */

import { PresenceDirective, TeacherEvaluationInput, SpeechPace } from './types';

export class TeacherPresence {
  /**
   * Computes presence directive.
   */
  public computePresence(input: TeacherEvaluationInput): PresenceDirective {
    const anxiety = input.studentAnxietyLevel ?? input.studentState.speakingAnxietyLevel ?? 30;
    const affectiveFilter = input.affectiveFilterState ?? 'optimal';

    let conversationalRole: PresenceDirective['conversationalRole'] = 'balanced';
    let speechPace: SpeechPace = 'natural_conversational';
    let validationPrefixRequired = true; // Always validate student's attempt first

    if (affectiveFilter === 'panic' || anxiety > 60) {
      conversationalRole = 'light_scaffold';
      speechPace = 'slow_deliberate';
    } else if (input.studentState.currentCefr === 'A1') {
      speechPace = 'slow_deliberate';
      conversationalRole = 'active_guide';
    }

    const activeListeningMarkers = [
      'I see!',
      'Great attempt!',
      'That makes total sense.',
      'Aha, exactly!',
      'Compreendo perfeitamente!'
    ];

    return {
      conversationalRole,
      validationPrefixRequired,
      activeListeningMarkers,
      speechPace
    };
  }
}

export const teacherPresence = new TeacherPresence();
