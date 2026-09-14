/**
 * FLUENTO TEACHER RUNTIME - TEACHER PERSONALITY
 * 
 * Manages the invariant personality traits (Teacher DNA) of the Virtual Teacher.
 * Ensures warmth, high patience, low formality, and authentic encouragement.
 */

import { PersonalityTraits, TeacherEvaluationInput } from './types';

export class TeacherPersonality {
  /**
   * Computes personality trait attributes based on student state and anxiety levels.
   */
  public computeTraits(input: TeacherEvaluationInput): PersonalityTraits {
    const anxiety = input.studentAnxietyLevel ?? input.studentState.speakingAnxietyLevel ?? 30;
    const affectiveFilter = input.affectiveFilterState ?? 'optimal';

    // 1. Empathy Score is elevated when student anxiety or affective filter rises
    let empathyScore = 85;
    if (anxiety > 60 || affectiveFilter === 'panic') {
      empathyScore = 98;
    } else if (anxiety > 40 || affectiveFilter === 'moderate') {
      empathyScore = 92;
    }

    // 2. Patience Score is always high (never drops below 90)
    let patienceScore = 95;
    if (anxiety > 50) {
      patienceScore = 100;
    }

    // 3. Enthusiasm Score adapts to student energy and progress
    let enthusiasmScore = 80;
    if (affectiveFilter === 'panic') {
      // Lower energy to avoid overwhelming a panicked student
      enthusiasmScore = 65;
    } else if (input.orchestratorDirective?.emotionalSignal?.affectiveFilterState === 'optimal') {
      enthusiasmScore = 88;
    }

    // 4. Formality Score is strictly low (10-25) to maintain an approachable, friendly environment
    const formalityScore = 15;

    // 5. Humor frequency
    let humorFrequency: PersonalityTraits['humorFrequency'] = 'subtle_light';
    if (affectiveFilter === 'panic' || anxiety > 70) {
      humorFrequency = 'none'; // Avoid misinterpretations during high anxiety
    }

    return {
      empathyScore,
      enthusiasmScore,
      patienceScore,
      formalityScore,
      humorFrequency
    };
  }
}

export const teacherPersonality = new TeacherPersonality();
