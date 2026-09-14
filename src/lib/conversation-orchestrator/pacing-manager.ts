/**
 * FLUENTO CONVERSATION ORCHESTRATOR - PACING MANAGER
 * 
 * Tracks time allocation per block and overall session cadence.
 * Recommends block transitions and pacing adjustments to ensure a complete,
 * well-balanced session within the available time budget.
 */

import { PacingState } from './types';
import { ComposedLesson } from '@/src/lib/lesson-composer';

export class PacingManager {
  /**
   * Evaluates session pacing and returns the current PacingState and recommendations.
   */
  public evaluatePacing(
    activeBlockIndex: number,
    elapsedBlockSeconds: number,
    lesson: ComposedLesson
  ): PacingState {
    const blocks = lesson.blocks;
    const safeIndex = Math.min(Math.max(0, activeBlockIndex), blocks.length - 1);
    const currentBlock = blocks[safeIndex];

    const allocatedBlockSeconds = currentBlock.durationMinutes * 60;
    const isBlockOverdue = elapsedBlockSeconds >= allocatedBlockSeconds;
    const completionPercent = allocatedBlockSeconds > 0 ? (elapsedBlockSeconds / allocatedBlockSeconds) * 100 : 100;

    let recommendedPacingAction: PacingState['recommendedPacingAction'] = 'maintain_cadence';

    if (completionPercent >= 110) {
      recommendedPacingAction = 'advance_to_next_block';
    } else if (completionPercent >= 85) {
      recommendedPacingAction = 'wrap_up_block';
    } else {
      recommendedPacingAction = 'maintain_cadence';
    }

    return {
      currentBlockIndex: safeIndex,
      currentBlock,
      elapsedBlockSeconds,
      allocatedBlockSeconds,
      isBlockOverdue,
      recommendedPacingAction
    };
  }
}

export const pacingManager = new PacingManager();
