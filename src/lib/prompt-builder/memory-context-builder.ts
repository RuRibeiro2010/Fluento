/**
 * FLUENTO PROMPT BUILDER - MEMORY CONTEXT BUILDER
 * 
 * Formats long-term memory threads (SRS review items, permanent successes,
 * emotional blocks/traumas) into a structured context section for LLM prompts.
 */

import { MemoryContextSection } from './types';
import { MemoryThreadsContext } from '@/src/lib/learning-engine';

export class MemoryContextBuilder {
  public buildSection(memoryThreads: MemoryThreadsContext): MemoryContextSection {
    const srsItems = (memoryThreads.intermediateReviewItems || []).map(
      item => `${item.conceptOrWord} (${item.category}, CEFR ${item.cefrLevel})`
    );

    return {
      permanentSuccesses: memoryThreads.permanentSuccessMemories || [],
      permanentTraumasAndBlocks: memoryThreads.permanentTraumaOrBlocks || [],
      scheduledReviewItemsText: srsItems
    };
  }
}

export const memoryContextBuilder = new MemoryContextBuilder();
