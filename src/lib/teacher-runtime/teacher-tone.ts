/**
 * FLUENTO TEACHER RUNTIME - TEACHER TONE
 * 
 * Determines the precise tone, warmth index, and energy level of the Virtual Teacher
 * to maintain a low-anxiety, psychologically safe learning environment.
 */

import { ToneDirective, TeacherEvaluationInput, TeacherToneType } from './types';

export class TeacherTone {
  /**
   * Computes the tone directive for the turn.
   */
  public computeTone(input: TeacherEvaluationInput): ToneDirective {
    const anxiety = input.studentAnxietyLevel ?? input.studentState.speakingAnxietyLevel ?? 30;
    const affectiveFilter = input.affectiveFilterState ?? 'optimal';
    const recentError = input.recentErrorDetected || false;

    let primaryTone: TeacherToneType = 'warm_supportive';
    let warmthIndex = 85;
    let energyLevel = 75;
    let toneGuidanceNote = 'Tom caloroso, encorajador e amigável. Manter escuta ativa e validação constante.';

    if (affectiveFilter === 'panic' || anxiety > 70) {
      primaryTone = 'calm_reassuring';
      warmthIndex = 98;
      energyLevel = 55; // Lower energy, calm and soothing cadence
      toneGuidanceNote = 'Tom calmo, sereno e altamente reconfortante. Transmitir tranquilidade e remover toda a pressão de desempenho.';
    } else if (recentError) {
      primaryTone = 'gentle_guiding';
      warmthIndex = 90;
      energyLevel = 70;
      toneGuidanceNote = 'Tom suave e orientador. Recodificar o erro de forma natural sem colocar foco na falha.';
    } else if (input.orchestratorDirective?.pacing?.recommendedPacingAction === 'advance_to_next_block') {
      primaryTone = 'celebratory';
      warmthIndex = 95;
      energyLevel = 90;
      toneGuidanceNote = 'Tom de celebração autêntica. Reconhecer o progresso e o esforço do aluno com entusiasmo genuíno.';
    } else if (input.orchestratorDirective?.emotionalSignal?.recommendedTone === 'energetic_encouraging') {
      primaryTone = 'celebratory';
      warmthIndex = 92;
      energyLevel = 88;
      toneGuidanceNote = 'Tom entusiasmado e positivo. Incentivar o aluno a continuar a interagir com confiança.';
    } else if (input.orchestratorDirective?.emotionalSignal?.recommendedTone === 'gentle_recovery') {
      primaryTone = 'calm_reassuring';
      warmthIndex = 95;
      energyLevel = 60;
      toneGuidanceNote = 'Tom calmo, paciente e reconfortante para garantir segurança psicológica.';
    }

    return {
      primaryTone,
      warmthIndex,
      energyLevel,
      toneGuidanceNote
    };
  }
}

export const teacherTone = new TeacherTone();
