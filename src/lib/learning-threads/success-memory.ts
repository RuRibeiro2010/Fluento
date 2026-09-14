/**
 * FLUENTO LEARNING THREADS - SUCCESS MEMORY MANAGER
 * 
 * Manages positive achievements, fluency breakthroughs, and milestone victories.
 */

import { SuccessMemory, ThreadSnapshot } from './types';
import { CEFRLevel } from '@/types/brain';

export class SuccessMemoryManager {
  /**
   * Adds a new SuccessMemory to a ThreadSnapshot.
   */
  public addSuccess(
    snapshot: ThreadSnapshot,
    params: {
      title: string;
      description: string;
      cefrLevel?: CEFRLevel;
      skillCategory?: 'speaking' | 'listening' | 'vocabulary' | 'grammar' | 'pronunciation';
      confidenceBoostScore?: number;
    }
  ): { updatedSnapshot: ThreadSnapshot; newSuccess: SuccessMemory } {
    const newSuccess: SuccessMemory = {
      id: `succ_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId: snapshot.studentId,
      timestampIso: new Date().toISOString(),
      title: params.title,
      description: params.description,
      cefrLevel: params.cefrLevel || 'A2',
      skillCategory: params.skillCategory || 'speaking',
      confidenceBoostScore: params.confidenceBoostScore || 10,
      permanenceLevel: 'permanent',
      occurrenceCount: 1
    };

    const updatedSnapshot: ThreadSnapshot = {
      ...snapshot,
      successes: [newSuccess, ...snapshot.successes],
      revision: snapshot.revision + 1
    };

    return { updatedSnapshot, newSuccess };
  }

  /**
   * Gets top success titles for prompt building or UI display.
   */
  public getTopSuccessTitles(snapshot: ThreadSnapshot, limit = 5): string[] {
    return snapshot.successes
      .slice(0, limit)
      .map(s => s.title);
  }
}

export const successMemoryManager = new SuccessMemoryManager();
