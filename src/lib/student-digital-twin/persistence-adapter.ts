/**
 * FLUENTO STUDENT DIGITAL TWIN - PERSISTENCE ADAPTER
 * 
 * Provides snapshot persistence and retrieval for Student Digital Twins.
 */

import { StudentDigitalTwinState } from './types';

export class TwinPersistenceAdapter {
  private inMemoryStore: Map<string, StudentDigitalTwinState> = new Map();

  public saveTwin(state: StudentDigitalTwinState): void {
    this.inMemoryStore.set(state.identity.studentId, state);

    // Synchronize to localStorage if available in browser context
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(
          `fluento_twin_${state.identity.studentId}`,
          JSON.stringify(state)
        );
      } catch (err) {
        console.warn('Unable to persist Digital Twin to localStorage:', err);
      }
    }
  }

  public loadTwin(studentId: string): StudentDigitalTwinState | undefined {
    // 1. Check in-memory store
    if (this.inMemoryStore.has(studentId)) {
      return this.inMemoryStore.get(studentId);
    }

    // 2. Fallback to localStorage if browser context
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = window.localStorage.getItem(`fluento_twin_${studentId}`);
        if (item) {
          const parsed = JSON.parse(item) as StudentDigitalTwinState;
          this.inMemoryStore.set(studentId, parsed);
          return parsed;
        }
      } catch (err) {
        console.warn('Error reading Digital Twin from localStorage:', err);
      }
    }

    return undefined;
  }

  public clear(studentId?: string): void {
    if (studentId) {
      this.inMemoryStore.delete(studentId);
    } else {
      this.inMemoryStore.clear();
    }
  }
}

export const twinPersistenceAdapter = new TwinPersistenceAdapter();
