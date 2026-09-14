/**
 * FLUENTO LESSON COMPOSER - MAIN ORCHESTRATOR
 * 
 * Takes a LessonBlueprint produced by the Learning Engine and orchestrates
 * specialized builders (Warmup, Conversation, Practice, Correction, Reflection, Closing)
 * to construct a pedagogical, multi-block ComposedLesson.
 * 
 * Purely structural orchestrator: does NOT generate text for the student or call LLMs.
 */

import { LessonBlueprint } from '@/src/lib/learning-engine';
import { ComposedLesson, LessonBlock } from './types';
import { warmupBuilder } from './warmup-builder';
import { conversationBuilder } from './conversation-builder';
import { practiceBuilder } from './practice-builder';
import { correctionBuilder } from './correction-builder';
import { reflectionBuilder } from './reflection-builder';
import { closingBuilder } from './closing-builder';

export class LessonComposer {
  /**
   * Composes a complete structured lesson from a LessonBlueprint.
   */
  public composeLesson(blueprint: LessonBlueprint): ComposedLesson {
    const timestampIso = new Date().toISOString();
    const lessonId = `lesson_${blueprint.studentId}_${Date.now()}`;
    const totalMinutes = Math.max(5, blueprint.totalDurationMinutes);

    // 1. Determine dynamic block duration distribution based on session duration
    const timeAllocation = this.allocateTimeBudget(totalMinutes, blueprint.decision.primaryFocus);

    // 2. Invoke specialized block builders sequentially
    const blocks: LessonBlock[] = [];
    let sequenceIndex = 0;

    // Warmup Block
    if (timeAllocation.warmup > 0) {
      blocks.push(
        warmupBuilder.buildBlock({
          blueprint,
          allocatedMinutes: timeAllocation.warmup,
          blockSequenceIndex: sequenceIndex++
        })
      );
    }

    // Main Conversation Block
    if (timeAllocation.conversation > 0) {
      blocks.push(
        conversationBuilder.buildBlock({
          blueprint,
          allocatedMinutes: timeAllocation.conversation,
          blockSequenceIndex: sequenceIndex++
        })
      );
    }

    // Target Practice / SRS Review Block
    if (timeAllocation.practice > 0) {
      blocks.push(
        practiceBuilder.buildBlock({
          blueprint,
          allocatedMinutes: timeAllocation.practice,
          blockSequenceIndex: sequenceIndex++
        })
      );
    }

    // Recasting & Correction Block
    if (timeAllocation.correction > 0) {
      blocks.push(
        correctionBuilder.buildBlock({
          blueprint,
          allocatedMinutes: timeAllocation.correction,
          blockSequenceIndex: sequenceIndex++
        })
      );
    }

    // Metacognitive Reflection Block
    if (timeAllocation.reflection > 0) {
      blocks.push(
        reflectionBuilder.buildBlock({
          blueprint,
          allocatedMinutes: timeAllocation.reflection,
          blockSequenceIndex: sequenceIndex++
        })
      );
    }

    // Session Closing Block
    if (timeAllocation.closing > 0) {
      blocks.push(
        closingBuilder.buildBlock({
          blueprint,
          allocatedMinutes: timeAllocation.closing,
          blockSequenceIndex: sequenceIndex++
        })
      );
    }

    // 3. Assemble complete ComposedLesson structure
    return {
      lessonId,
      studentId: blueprint.studentId,
      blueprintId: blueprint.blueprintId,
      timestampIso,
      totalDurationMinutes: totalMinutes,
      pedagogicalConfig: {
        scaffoldingLevel: blueprint.decision.strategy.scaffoldingLevel,
        recastingMode: blueprint.decision.strategy.recastingMode,
        tone: blueprint.decision.strategy.tone,
        targetStudentTalkTimeRatio: blueprint.decision.strategy.targetStudentTalkTimeRatio,
        waitTimeSeconds: blueprint.decision.strategy.waitTimeSeconds,
        forbiddenBehaviours: blueprint.teacherRules,
        difficulty: blueprint.decision.difficulty
      },
      blocks,
      successCriteria: blueprint.successCriteria
    };
  }

  /**
   * Helper to distribute the total session time budget across pedagogical blocks.
   */
  private allocateTimeBudget(
    totalMinutes: number,
    primaryFocus: string
  ): {
    warmup: number;
    conversation: number;
    practice: number;
    correction: number;
    reflection: number;
    closing: number;
  } {
    // Micro-session (< 10 minutes)
    if (totalMinutes <= 10) {
      return {
        warmup: 2,
        conversation: primaryFocus === 'review' ? 2 : Math.max(3, totalMinutes - 5),
        practice: primaryFocus === 'review' ? Math.max(3, totalMinutes - 5) : 1,
        correction: 1,
        reflection: 1,
        closing: 1
      };
    }

    // Standard session (15 minutes)
    if (totalMinutes <= 15) {
      return {
        warmup: 2,
        conversation: primaryFocus === 'review' ? 4 : 7,
        practice: primaryFocus === 'review' ? 5 : 2,
        correction: 2,
        reflection: 1,
        closing: 1
      };
    }

    // Extended session (30+ minutes)
    const warmup = 3;
    const reflection = 2;
    const closing = 2;
    const remaining = totalMinutes - warmup - reflection - closing;

    let conversation = Math.round(remaining * 0.55);
    let practice = Math.round(remaining * 0.25);
    let correction = remaining - conversation - practice;

    if (primaryFocus === 'review') {
      const temp = conversation;
      conversation = practice;
      practice = temp;
    }

    return {
      warmup,
      conversation,
      practice,
      correction,
      reflection,
      closing
    };
  }
}

export const lessonComposer = new LessonComposer();
