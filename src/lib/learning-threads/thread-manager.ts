/**
 * FLUENTO LEARNING THREADS - THREAD MANAGER
 * 
 * Manages thread snapshots for students in-memory and provides persistence sync.
 */

import { ThreadSnapshot } from './types';
import { threadValidator } from './thread-validator';

export class ThreadManager {
  private store: Map<string, ThreadSnapshot> = new Map();

  /**
   * Retrieves or initializes a ThreadSnapshot for a student.
   */
  public getOrCreateSnapshot(studentId: string): ThreadSnapshot {
    if (this.store.has(studentId)) {
      return this.store.get(studentId)!;
    }

    const nowIso = new Date().toISOString();
    const newSnapshot: ThreadSnapshot = {
      studentId,
      lastConsolidatedIso: nowIso,
      successes: [],
      difficulties: [],
      reviewItems: [],
      ephemeralNotes: [],
      totalPromotionsCount: 0,
      revision: 1
    };

    // Try loading from localStorage if browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = window.localStorage.getItem(`fluento_thread_${studentId}`);
        if (item) {
          const parsed = JSON.parse(item) as ThreadSnapshot;
          if (threadValidator.validateThreadSnapshot(parsed).isValid) {
            this.store.set(studentId, parsed);
            return parsed;
          }
        }
      } catch (err) {
        console.warn('Error reading thread snapshot from localStorage:', err);
      }
    }

    this.saveSnapshot(newSnapshot);
    return newSnapshot;
  }

  /**
   * Saves snapshot to memory and localStorage.
   */
  public saveSnapshot(snapshot: ThreadSnapshot): void {
    const val = threadValidator.validateThreadSnapshot(snapshot);
    if (!val.isValid) {
      throw new Error(`Invalid ThreadSnapshot: ${val.issues.join('; ')}`);
    }

    this.store.set(snapshot.studentId, snapshot);

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(
          `fluento_thread_${snapshot.studentId}`,
          JSON.stringify(snapshot)
        );
      } catch (err) {
        console.warn('Unable to persist thread snapshot to localStorage:', err);
      }
    }
  }

  public clear(studentId?: string): void {
    if (studentId) {
      this.store.delete(studentId);
    } else {
      this.store.clear();
    }
  }
}

export const threadManager = new ThreadManager();
