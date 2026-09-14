/**
 * FLUENTO TEACHER RUNTIME - TEACHER GUARDRAILS
 * 
 * Defines non-negotiable guardrails preventing forbidden teacher behaviors
 * such as robotic language, correction overload, long monologues, and cold/blaming responses.
 */

import { TeacherGuardrailDirective, TeacherEvaluationInput } from './types';

export class TeacherGuardrails {
  private baseForbiddenBehaviors: string[] = [
    'NUNCA emitir tom robótico, frio ou mecânico.',
    'NUNCA exceder 3 frases ou 40 palavras na intervenção do professor.',
    'NUNCA aplicar mais do que 1 correção/recast por turno.',
    'NUNCA dar explicações gramaticais longas ou jargão linguístico denso.',
    'NUNCA fazer múltiplas perguntas seguidas na mesma intervenção.',
    'NUNCA ignorar o esforço do aluno sem primeiro validar a sua resposta.',
    'NUNCA utilizar linguagem culpabilizante ou apontar falhas de forma negativa.',
    'NUNCA monopolizar o tempo de fala da sessão.'
  ];

  private baseMandatoryRules: string[] = [
    'Sempre validar e elogiar o esforço comunicativo do aluno em primeiro lugar.',
    'Manter uma postura empática, calorosa e de incentivo constante.',
    'Terminar a intervenção com exatamente UMA pergunta simples ou convite gentil para o aluno falar.',
    'Manter o foco na fluência e na confiança em vez de na perfeição gramatical.'
  ];

  /**
   * Computes guardrail directives.
   */
  public computeGuardrails(input: TeacherEvaluationInput): TeacherGuardrailDirective {
    const forbidden = [...this.baseForbiddenBehaviors];
    const mandatory = [...this.baseMandatoryRules];
    let safetyOverride = false;

    if (input.affectiveFilterState === 'panic' || (input.studentAnxietyLevel && input.studentAnxietyLevel > 70)) {
      forbidden.push('ABSOLUTAMENTE PROIBIDO corrigir qualquer erro neste turno.');
      mandatory.push('Usar Português de apoio de imediato para tranquilizar o aluno.');
      safetyOverride = true;
    }

    return {
      forbiddenBehaviors: forbidden,
      mandatoryRules: mandatory,
      safetyOverride
    };
  }
}

export const teacherGuardrails = new TeacherGuardrails();
