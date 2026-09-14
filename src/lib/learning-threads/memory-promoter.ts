/**
 * FLUENTO LEARNING THREADS - MEMORY PROMOTER
 * 
 * Evaluates candidate memory items and automatically promotes high-value
 * observations into permanent successes or persistent difficulties.
 */

import {
  EphemeralNote,
  SuccessMemory,
  DifficultyMemory,
  PromotionRuleResult,
  ThreadSnapshot
} from './types';

export class MemoryPromoter {
  /**
   * Evaluates an EphemeralNote for promotion to SuccessMemory or DifficultyMemory.
   */
  public evaluatePromotion(
    note: EphemeralNote,
    snapshot: ThreadSnapshot
  ): PromotionRuleResult {
    const textLower = note.content.toLowerCase();

    // 1. Check for Success Promotion
    if (
      textLower.includes('sucesso') ||
      textLower.includes('conseguiu') ||
      textLower.includes('mastered') ||
      textLower.includes('breakthrough') ||
      textLower.includes('discurso livre')
    ) {
      // Search if similar success note already exists
      const matchingCount = snapshot.ephemeralNotes.filter(n =>
        n.content.toLowerCase().includes(note.categoryTag.toLowerCase())
      ).length;

      if (matchingCount >= 2 || textLower.includes('breakthrough') || textLower.includes('sucesso')) {
        const newSuccess: SuccessMemory = {
          id: `succ_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          studentId: note.studentId,
          timestampIso: new Date().toISOString(),
          title: `Sucesso Promovido: ${note.categoryTag || 'Conquista de Fluência'}`,
          description: note.content,
          cefrLevel: 'A2',
          skillCategory: 'speaking',
          confidenceBoostScore: 10,
          permanenceLevel: 'permanent',
          occurrenceCount: matchingCount + 1
        };

        return {
          promoted: true,
          promotedItemType: 'success',
          reason: 'Auto-promoted from ephemeral note due to breakthrough milestone or repeated success.',
          newItem: newSuccess
        };
      }
    }

    // 2. Check for Difficulty Promotion
    if (
      textLower.includes('dificuldade') ||
      textLower.includes('erro recorrente') ||
      textLower.includes('hesitação') ||
      textLower.includes('bloqueio')
    ) {
      const existingDifficulty = snapshot.difficulties.find(
        d => !d.isResolved && d.title.toLowerCase().includes(note.categoryTag.toLowerCase())
      );

      if (!existingDifficulty) {
        const newDifficulty: DifficultyMemory = {
          id: `diff_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          studentId: note.studentId,
          firstObservedIso: new Date().toISOString(),
          lastObservedIso: new Date().toISOString(),
          title: `Ponto de Fricção: ${note.categoryTag || 'Estrutura Gramatical'}`,
          description: note.content,
          cefrLevel: 'A2',
          severity: 'moderate_friction',
          occurrenceCount: 2,
          isResolved: false,
          l1InterferenceTag: note.content.toLowerCase().includes('português') ? 'pt_interference' : undefined
        };

        return {
          promoted: true,
          promotedItemType: 'difficulty',
          reason: 'Auto-promoted from recurring friction note to persistent difficulty.',
          newItem: newDifficulty
        };
      }
    }

    return {
      promoted: false
    };
  }
}

export const memoryPromoter = new MemoryPromoter();
