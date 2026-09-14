/**
 * Teacher Compliance Auditor (Sprint 1)
 * Audits teacher outputs and session orchestration against official TEACHER_GUIDELINES.md:
 * - Verifies student talk time > 55% (teacher < 45%)
 * - Verifies recasting usage over explicit over-correction
 * - Checks for open-ended question formulation
 * - Verifies silence/wait time respect
 * - Flags monologues or robotic explanations
 * - Audits real-time difficulty adaptation and Memory of Success usage
 */

import { TeacherComplianceEvaluation, StudentSessionTelemetry } from './simulation-types';

export interface InteractionTranscriptTurn {
  speaker: 'teacher' | 'student';
  text: string;
  durationSeconds: number;
  correctionsAttempted?: number;
  isOpenQuestion?: boolean;
  wasRecastingUsed?: boolean;
}

export class TeacherComplianceAuditor {
  /**
   * Audits a session's execution against TEACHER_GUIDELINES.md.
   */
  public static auditSession(
    turns: InteractionTranscriptTurn[],
    telemetry: StudentSessionTelemetry,
    usedSuccessMemory: boolean
  ): TeacherComplianceEvaluation {
    const violatedGuidelines: string[] = [];

    // 1. Spoke Too Much Check
    const teacherTalkTimePercent = 100 - telemetry.studentTalkTimeRatio;
    const spokeTooMuch = teacherTalkTimePercent > 45;
    if (spokeTooMuch) {
      violatedGuidelines.push(
        `O professor falou excessivamente (${Math.round(teacherTalkTimePercent)}% do tempo). Violou regra de priorização do Student Talk Time.`
      );
    }

    // 2. Over-Correction Check
    const totalCorrections = turns.reduce((acc, t) => acc + (t.correctionsAttempted || 0), 0);
    const overCorrected = totalCorrections > 3;
    if (overCorrected) {
      violatedGuidelines.push(
        `Interrupção e correção excessiva (${totalCorrections} correções diretas). Violou princípio de Recasting Natural.`
      );
    }

    // 3. Open-Ended Questions Check
    const teacherTurns = turns.filter((t) => t.speaker === 'teacher');
    const openQuestions = teacherTurns.filter((t) => t.isOpenQuestion).length;
    const askedOpenEndedQuestions = teacherTurns.length === 0 || openQuestions / teacherTurns.length >= 0.5;
    if (!askedOpenEndedQuestions) {
      violatedGuidelines.push(
        'Uso excessivo de perguntas fechadas (Sim/Não). Não estimulou formulação e expressão aberta.'
      );
    }

    // 4. Concise Explanations / No Monologues
    const longTeacherTurns = teacherTurns.filter((t) => t.text.split(' ').length > 40).length;
    const explainedSimplyWithoutMonologue = longTeacherTurns === 0;
    if (!explainedSimplyWithoutMonologue) {
      violatedGuidelines.push(
        'Monólogos com explicações longas detectados (>40 palavras). Violou princípio de explicações concisas.'
      );
    }

    // 5. Memory of Success Usage
    const leveragedSuccessMemories = usedSuccessMemory;
    if (!leveragedSuccessMemories && telemetry.confidenceScore < 60) {
      violatedGuidelines.push(
        'Aluno com baixa confiança; sistema não ativou o recurso "Memory of Success" para encorajamento.'
      );
    }

    // 6. Respect Wait Time & Silence
    const respectedWaitTimeAndSilence = telemetry.cognitiveLoadScore < 85;

    // 7. Adapt Difficulty in Real Time
    const adaptedDifficultyInRealTime = telemetry.flowStateIndex >= 50;

    // 8. Built Confidence & Reduced Anxiety
    const builtConfidenceAndReducedAnxiety = telemetry.confidenceScore >= 55;

    // Composite Compliance Score
    let complianceScore = 100 - violatedGuidelines.length * 15;
    if (usedSuccessMemory) complianceScore += 5;
    const overallTeacherGuidelineScore = Math.min(100, Math.max(10, complianceScore));

    return {
      spokeTooMuch,
      overCorrected,
      askedOpenEndedQuestions,
      respectedWaitTimeAndSilence,
      explainedSimplyWithoutMonologue,
      adaptedDifficultyInRealTime,
      leveragedSuccessMemories,
      builtConfidenceAndReducedAnxiety,
      overallTeacherGuidelineScore,
      violatedGuidelines,
    };
  }
}
