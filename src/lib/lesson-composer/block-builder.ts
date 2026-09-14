/**
 * FLUENTO LESSON COMPOSER - BASE BLOCK BUILDER
 * 
 * Base abstract class providing common utilities for block builders.
 * Follows Clean Architecture and Single Responsibility Principles.
 */

import { LessonBlock, LessonActivity, BlockBuilderContext, BlockType, InteractionPattern } from './types';

export abstract class BaseBlockBuilder {
  abstract readonly blockType: BlockType;

  /**
   * Constructs a LessonBlock for the given context.
   */
  public abstract buildBlock(context: BlockBuilderContext): LessonBlock;

  /**
   * Helper to create a standardized LessonBlock structure.
   */
  protected createBlock(
    idPrefix: string,
    title: string,
    durationMinutes: number,
    pedagogicalObjective: string,
    interactionPattern: InteractionPattern,
    activities: LessonActivity[],
    guidelines: string[]
  ): LessonBlock {
    return {
      blockId: `${idPrefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: this.blockType,
      title,
      durationMinutes: Math.max(1, durationMinutes),
      pedagogicalObjective,
      interactionPattern,
      activities,
      guidelines
    };
  }

  /**
   * Helper to create a standardized LessonActivity.
   */
  protected createActivity(
    idPrefix: string,
    type: LessonActivity['type'],
    title: string,
    estimatedMinutes: number,
    scaffoldingHint: string,
    targetSkill: string,
    teacherInstruction: string
  ): LessonActivity {
    return {
      activityId: `${idPrefix}_act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      estimatedMinutes: Math.max(1, estimatedMinutes),
      scaffoldingHint,
      targetSkill,
      teacherInstruction
    };
  }
}
