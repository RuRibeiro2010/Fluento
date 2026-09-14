/**
 * FLUENTO LEARNING THREADS - THREAD SEARCH
 * 
 * Provides query, keyword search, and filtering across ThreadSnapshot memory items.
 */

import {
  ThreadSnapshot,
  ThreadSearchFilter,
  SuccessMemory,
  DifficultyMemory,
  ReviewMemoryItem,
  EphemeralNote
} from './types';

export class ThreadSearch {
  /**
   * Queries and searches across memory categories within a ThreadSnapshot.
   */
  public searchThreads(snapshot: ThreadSnapshot, filter: ThreadSearchFilter): {
    successes: SuccessMemory[];
    difficulties: DifficultyMemory[];
    reviewItems: ReviewMemoryItem[];
    ephemeralNotes: EphemeralNote[];
    totalCount: number;
  } {
    const kw = filter.keyword ? filter.keyword.toLowerCase() : undefined;

    // Filter Successes
    let filteredSuccesses = snapshot.successes;
    if (filter.category && filter.category !== 'success_breakthrough') {
      filteredSuccesses = [];
    } else {
      if (kw) {
        filteredSuccesses = filteredSuccesses.filter(
          s => s.title.toLowerCase().includes(kw) || s.description.toLowerCase().includes(kw)
        );
      }
      if (filter.cefrLevel) {
        filteredSuccesses = filteredSuccesses.filter(s => s.cefrLevel === filter.cefrLevel);
      }
    }

    // Filter Difficulties
    let filteredDifficulties = snapshot.difficulties;
    if (filter.category && filter.category !== 'persistent_difficulty') {
      filteredDifficulties = [];
    } else {
      if (kw) {
        filteredDifficulties = filteredDifficulties.filter(
          d => d.title.toLowerCase().includes(kw) || d.description.toLowerCase().includes(kw)
        );
      }
      if (filter.cefrLevel) {
        filteredDifficulties = filteredDifficulties.filter(d => d.cefrLevel === filter.cefrLevel);
      }
      if (filter.isResolved !== undefined) {
        filteredDifficulties = filteredDifficulties.filter(d => d.isResolved === filter.isResolved);
      }
    }

    // Filter Review Items
    let filteredReviewItems = snapshot.reviewItems;
    if (filter.category && filter.category !== 'srs_review_item') {
      filteredReviewItems = [];
    } else {
      if (kw) {
        filteredReviewItems = filteredReviewItems.filter(
          r => r.conceptOrWord.toLowerCase().includes(kw)
        );
      }
      if (filter.cefrLevel) {
        filteredReviewItems = filteredReviewItems.filter(r => r.cefrLevel === filter.cefrLevel);
      }
      if (filter.minDecayScore !== undefined) {
        filteredReviewItems = filteredReviewItems.filter(r => r.decayScore >= filter.minDecayScore!);
      }
    }

    // Filter Ephemeral Notes
    let filteredEphemeralNotes = snapshot.ephemeralNotes;
    if (filter.category && filter.category !== 'ephemeral_session_note') {
      filteredEphemeralNotes = [];
    } else {
      if (kw) {
        filteredEphemeralNotes = filteredEphemeralNotes.filter(
          n => n.content.toLowerCase().includes(kw) || n.categoryTag.toLowerCase().includes(kw)
        );
      }
    }

    // Limit if requested
    const limit = filter.limit || 100;
    filteredSuccesses = filteredSuccesses.slice(0, limit);
    filteredDifficulties = filteredDifficulties.slice(0, limit);
    filteredReviewItems = filteredReviewItems.slice(0, limit);
    filteredEphemeralNotes = filteredEphemeralNotes.slice(0, limit);

    const totalCount =
      filteredSuccesses.length +
      filteredDifficulties.length +
      filteredReviewItems.length +
      filteredEphemeralNotes.length;

    return {
      successes: filteredSuccesses,
      difficulties: filteredDifficulties,
      reviewItems: filteredReviewItems,
      ephemeralNotes: filteredEphemeralNotes,
      totalCount
    };
  }
}

export const threadSearch = new ThreadSearch();
