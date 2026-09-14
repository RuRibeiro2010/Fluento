/**
 * FLUENTO SESSION RUNTIME - MEMORY UPDATER
 * 
 * Responsible for updating student Learning Threads / memory context at the end of turns.
 * Captures ephemeral session notes, updates review items, and records successes or sensitive topics.
 */

import { MemoryThreadsContext } from '@/src/lib/learning-engine';
import { TurnRecord, OrchestratorActionDirective } from './types';

export class MemoryUpdater {
  /**
   * Updates memory threads based on turn events, recasting directives, and speech records.
   */
  public updateMemoryThreads(
    currentThreads: MemoryThreadsContext,
    studentText?: string,
    directive?: OrchestratorActionDirective
  ): MemoryThreadsContext {
    // Hoisted into its own guaranteed-array binding: `ephemeralSessionNotes` is
    // declared optional on MemoryThreadsContext, so reading it back off
    // `updatedThreads` later would still type as `string[] | undefined`. This
    // local const is always a real array (never undefined), and is the exact
    // same array instance placed on `updatedThreads` below, so mutating it
    // still updates the returned object.
    const ephemeralSessionNotes = [...(currentThreads.ephemeralSessionNotes || [])];

    const updatedThreads: MemoryThreadsContext = {
      ...currentThreads,
      ephemeralSessionNotes,
      permanentSuccessMemories: [...(currentThreads.permanentSuccessMemories || [])],
      permanentTraumaOrBlocks: [...(currentThreads.permanentTraumaOrBlocks || [])],
      intermediateReviewItems: [...(currentThreads.intermediateReviewItems || [])]
    };

    // 1. Record ephemeral note if recasting occurred
    if (directive?.recastingDirective.shouldCorrect && directive.recastingDirective.targetFocus) {
      const note = `Turno corrigido (${directive.recastingDirective.targetFocus}): ${directive.recastingDirective.rationale}`;
      if (!ephemeralSessionNotes.includes(note)) {
        ephemeralSessionNotes.push(note);
      }
    }

    // 2. Note student active participation
    if (studentText && studentText.trim().length > 20) {
      const fluencyNote = `Intervenção longa do aluno (${studentText.trim().length} caracteres)`;
      if (!ephemeralSessionNotes.includes(fluencyNote)) {
        ephemeralSessionNotes.push(fluencyNote);
      }
    }

    return updatedThreads;
  }
}

export const memoryUpdater = new MemoryUpdater();
