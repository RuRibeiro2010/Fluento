/**
 * FLUENTO SESSION RUNTIME - LESSON EXECUTOR
 * 
 * Manages lesson block navigation, block duration tracking, and block index advancement.
 */

import { SessionSnapshot } from './types';
import { sessionEventEmitter } from './session-events';

export class LessonExecutor {
  /**
   * Evaluates if current lesson block should advance to the next block.
   */
  public evaluateBlockAdvancement(snapshot: SessionSnapshot): {
    shouldAdvance: boolean;
    newBlockIndex: number;
    isLessonCompleted: boolean;
  } {
    const totalBlocks = snapshot.lesson.blocks.length;
    const currentBlock = snapshot.lesson.blocks[snapshot.activeBlockIndex];

    // Simple rule: advance if active block turns exceed 4 or pacing recommends advancement
    const blockTurns = snapshot.turns.filter(t => t.speaker === 'student').length;
    const turnsPerBlock = Math.max(3, Math.floor(10 / totalBlocks));

    if (blockTurns >= turnsPerBlock * (snapshot.activeBlockIndex + 1)) {
      if (snapshot.activeBlockIndex + 1 < totalBlocks) {
        const newBlockIndex = snapshot.activeBlockIndex + 1;
        snapshot.activeBlockIndex = newBlockIndex;

        sessionEventEmitter.emit({
          sessionId: snapshot.sessionId,
          eventType: 'block_advanced',
          blockIndex: newBlockIndex,
          snapshot
        });

        return {
          shouldAdvance: true,
          newBlockIndex,
          isLessonCompleted: false
        };
      } else {
        return {
          shouldAdvance: false,
          newBlockIndex: snapshot.activeBlockIndex,
          isLessonCompleted: true
        };
      }
    }

    return {
      shouldAdvance: false,
      newBlockIndex: snapshot.activeBlockIndex,
      isLessonCompleted: false
    };
  }
}

export const lessonExecutor = new LessonExecutor();
