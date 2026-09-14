/**
 * FLUENTO PROMPT BUILDER - TEACHER CONTEXT BUILDER
 * 
 * Formats teacher behavioral guidelines, identity, tone, recasting rules,
 * and forbidden behaviors into a structured context section.
 */

import { TeacherContextSection } from './types';
import { ComposedLesson } from '@/src/lib/lesson-composer';

export class TeacherContextBuilder {
  public buildSection(lesson: ComposedLesson): TeacherContextSection {
    const { pedagogicalConfig } = lesson;

    const coreRules = [
      `Garantir que o tempo de fala do aluno (STT) seja superior a ${pedagogicalConfig.targetStudentTalkTimeRatio}%.`,
      `Respeitar rigorosamente o tempo de espera de pelo menos ${pedagogicalConfig.waitTimeSeconds} segundos após cada intervenção.`,
      `Aplicar modo de recasting '${pedagogicalConfig.recastingMode}': Nunca dizer 'está errado' ou apontar falhas de forma direta.`,
      `Nível de scaffolding ativo: ${pedagogicalConfig.scaffoldingLevel}.`
    ];

    return {
      roleIdentity: 'És um professor de línguas humano, extremamente empático, sereno e focado no desenvolvimento de fluência autêntica.',
      corePedagogicalRules: coreRules,
      toneAndEmpathyGuidelines: `Adotar o tom '${pedagogicalConfig.tone}': caloroso, encorajador, sem artificialismo de chatbot.`,
      forbiddenBehaviours: pedagogicalConfig.forbiddenBehaviours || []
    };
  }
}

export const teacherContextBuilder = new TeacherContextBuilder();
