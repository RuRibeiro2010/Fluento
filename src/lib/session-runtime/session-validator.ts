/**
 * FLUENTO SESSION RUNTIME - SESSION VALIDATOR
 * 
 * Validates the structural integrity, block index boundaries, and state consistency
 * of a SessionSnapshot before or during execution.
 */

import { SessionSnapshot, SessionValidationResult } from './types';

export class SessionValidator {
  public validateSession(snapshot: SessionSnapshot): SessionValidationResult {
    const issues: string[] = [];

    if (!snapshot.sessionId) issues.push('Missing sessionId');
    if (!snapshot.studentId) issues.push('Missing studentId');
    if (!snapshot.lesson || !snapshot.lesson.blocks || snapshot.lesson.blocks.length === 0) {
      issues.push('Invalid or empty lesson blocks');
    } else {
      if (snapshot.activeBlockIndex < 0 || snapshot.activeBlockIndex >= snapshot.lesson.blocks.length) {
        issues.push(`activeBlockIndex (${snapshot.activeBlockIndex}) out of bounds [0, ${snapshot.lesson.blocks.length - 1}]`);
      }
    }

    if (!snapshot.studentState) {
      issues.push('Missing studentState');
    }

    if (!snapshot.memoryThreads) {
      issues.push('Missing memoryThreads');
    }

    return {
      isValid: issues.length === 0,
      sessionId: snapshot.sessionId || 'unknown',
      issues
    };
  }
}

export const sessionValidator = new SessionValidator();
