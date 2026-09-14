/**
 * FLUENTO PROMPT BUILDER - LESSON CONTEXT BUILDER
 * 
 * Formats active lesson block objectives, interaction patterns,
 * scaffolding levels, and talk-time targets into a structured context section.
 */

import { LessonContextSection } from './types';
import { ComposedLesson } from '@/src/lib/lesson-composer';

export class LessonContextBuilder {
  public buildSection(lesson: ComposedLesson, activeBlockIndex: number): LessonContextSection {
    const blocks = lesson.blocks;
    const safeIndex = Math.min(Math.max(0, activeBlockIndex), blocks.length - 1);
    const activeBlock = blocks[safeIndex];

    return {
      activeBlockTitle: `Bloco ${safeIndex + 1}/${blocks.length}: ${activeBlock.title}`,
      activeBlockObjective: activeBlock.pedagogicalObjective,
      interactionPattern: activeBlock.interactionPattern,
      scaffoldingLevel: lesson.pedagogicalConfig.scaffoldingLevel,
      targetStudentTalkTimeRatio: `Mínimo de ${lesson.pedagogicalConfig.targetStudentTalkTimeRatio}% de tempo de fala do aluno`
    };
  }
}

export const lessonContextBuilder = new LessonContextBuilder();
