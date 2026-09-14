/**
 * Módulo 2: Retrieval Practice Engine
 * Unannounced retrieval practice weaving previously learned items into current lessons.
 */

import { LongitudinalMemory } from '@/types/coach';
import { getLearningScienceConfig } from './science-config';

export interface UnannouncedRetrievalItem {
  id: string;
  concept: string;
  originalLearnedDaysAgo: number;
  prompt: string;
  targetAnswer: string;
  skillType: 'vocabulary' | 'grammar' | 'pronunciation';
}

export function selectUnannouncedRetrievalItems(
  memory?: LongitudinalMemory,
  maxItems?: number
): UnannouncedRetrievalItem[] {
  const config = getLearningScienceConfig();
  const limit = maxItems ?? config.activeRecall.maxUnannouncedItemsPerLesson;

  if (!memory) return [];

  const items: UnannouncedRetrievalItem[] = [];

  // Weak vocabulary retrieval
  if (memory.weakWords && memory.weakWords.length > 0) {
    memory.weakWords.slice(0, limit).forEach((w, idx) => {
      items.push({
        id: `ret-vocab-${idx}-${Date.now()}`,
        concept: w.word,
        originalLearnedDaysAgo: 4 + idx,
        prompt: `[Revisão Surpresa]: Lembras-te do significado de "${w.word}"?`,
        targetAnswer: w.word,
        skillType: 'vocabulary',
      });
    });
  }

  // Weak grammar retrieval
  if (memory.weakGrammar && memory.weakGrammar.length > 0 && items.length < limit) {
    memory.weakGrammar.slice(0, limit - items.length).forEach((g, idx) => {
      items.push({
        id: `ret-gram-${idx}-${Date.now()}`,
        concept: g.concept,
        originalLearnedDaysAgo: 6 + idx,
        prompt: `[Revisão Surpresa]: Como aplicas "${g.concept}" numa frase rápida?`,
        targetAnswer: g.concept,
        skillType: 'grammar',
      });
    });
  }

  return items.slice(0, limit);
}
