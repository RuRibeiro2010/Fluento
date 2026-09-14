/**
 * FLUENTO LEARNING THREADS - DIFFICULTY MEMORY MANAGER
 * 
 * Manages persistent student friction, grammatical confusion, or phonetical/L1 interference blocks.
 */

import { DifficultyMemory, DifficultySeverity, ThreadSnapshot } from './types';
import { CEFRLevel } from '@/types/brain';

export class DifficultyMemoryManager {
  /**
   * Adds or updates a DifficultyMemory in a ThreadSnapshot.
   */
  public recordDifficulty(
    snapshot: ThreadSnapshot,
    params: {
      title: string;
      description: string;
      cefrLevel?: CEFRLevel;
      severity?: DifficultySeverity;
      l1InterferenceTag?: string;
    }
  ): { updatedSnapshot: ThreadSnapshot; difficulty: DifficultyMemory } {
    const existingIndex = snapshot.difficulties.findIndex(
      d => !d.isResolved && d.title.toLowerCase() === params.title.toLowerCase()
    );

    let updatedDifficulties = [...snapshot.difficulties];
    let targetDifficulty: DifficultyMemory;

    if (existingIndex >= 0) {
      const existing = updatedDifficulties[existingIndex];
      targetDifficulty = {
        ...existing,
        lastObservedIso: new Date().toISOString(),
        occurrenceCount: existing.occurrenceCount + 1,
        severity: params.severity || existing.severity
      };
      updatedDifficulties[existingIndex] = targetDifficulty;
    } else {
      targetDifficulty = {
        id: `diff_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        studentId: snapshot.studentId,
        firstObservedIso: new Date().toISOString(),
        lastObservedIso: new Date().toISOString(),
        title: params.title,
        description: params.description,
        cefrLevel: params.cefrLevel || 'A2',
        severity: params.severity || 'moderate_friction',
        occurrenceCount: 1,
        isResolved: false,
        l1InterferenceTag: params.l1InterferenceTag
      };
      updatedDifficulties = [targetDifficulty, ...updatedDifficulties];
    }

    const updatedSnapshot: ThreadSnapshot = {
      ...snapshot,
      difficulties: updatedDifficulties,
      revision: snapshot.revision + 1
    };

    return { updatedSnapshot, difficulty: targetDifficulty };
  }

  /**
   * Manually resolves a difficulty.
   */
  public resolveDifficulty(snapshot: ThreadSnapshot, difficultyId: string): ThreadSnapshot {
    const updatedDifficulties = snapshot.difficulties.map(d => {
      if (d.id === difficultyId) {
        return {
          ...d,
          isResolved: true,
          resolutionTimestampIso: new Date().toISOString()
        };
      }
      return d;
    });

    return {
      ...snapshot,
      difficulties: updatedDifficulties,
      revision: snapshot.revision + 1
    };
  }

  /**
   * Gets active (unresolved) difficulty titles for prompt context or UI.
   */
  public getActiveDifficultyTitles(snapshot: ThreadSnapshot): string[] {
    return snapshot.difficulties
      .filter(d => !d.isResolved)
      .map(d => d.title);
  }
}

export const difficultyMemoryManager = new DifficultyMemoryManager();
