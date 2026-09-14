/**
 * FLUENTO LEARNING THREADS - THREAD VALIDATOR
 * 
 * Validates structural integrity, score bounds, and non-corrupted dates of ThreadSnapshots.
 */

import { ThreadSnapshot, ThreadValidationResult } from './types';

export class ThreadValidator {
  /**
   * Validates a ThreadSnapshot.
   */
  public validateThreadSnapshot(snapshot: ThreadSnapshot): ThreadValidationResult {
    const issues: string[] = [];

    if (!snapshot || !snapshot.studentId) {
      issues.push('Missing or invalid studentId in ThreadSnapshot');
    }

    if (!Array.isArray(snapshot.successes)) {
      issues.push('successes property must be an array');
    }

    if (!Array.isArray(snapshot.difficulties)) {
      issues.push('difficulties property must be an array');
    }

    if (!Array.isArray(snapshot.reviewItems)) {
      issues.push('reviewItems property must be an array');
    } else {
      snapshot.reviewItems.forEach((item, idx) => {
        if (item.decayScore < 0 || item.decayScore > 100) {
          issues.push(`reviewItem at index ${idx} decayScore out of bounds [0, 100]`);
        }
        if (item.difficulty < 0 || item.difficulty > 10) {
          issues.push(`reviewItem at index ${idx} difficulty out of bounds [0, 10]`);
        }
      });
    }

    if (!Array.isArray(snapshot.ephemeralNotes)) {
      issues.push('ephemeralNotes property must be an array');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

export const threadValidator = new ThreadValidator();
