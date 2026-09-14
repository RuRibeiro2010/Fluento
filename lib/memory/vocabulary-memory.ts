import { VocabularyMemory, VocabularyItem } from '@/types/memory';

/**
 * Vocabulary Memory Module
 * Manages spaced repetition queue, learned words, weak spots, and mastery tracking.
 */
export class VocabularyMemoryService {
  private memory: VocabularyMemory;

  constructor(userId: string = 'usr_default', targetLanguage: string = 'es') {
    this.memory = {
      userId,
      targetLanguage,
      items: [
        {
          id: 'v1',
          word: 'estacionamiento',
          translation: 'parking lot',
          contextSentence: 'El estacionamiento está cerca del hotel.',
          masteryScore: 45,
          timesSeen: 4,
          timesCorrect: 2,
          lastPracticedDate: new Date().toISOString(),
          nextReviewDate: new Date().toISOString(),
          isWeakSpot: true,
          categoryTag: 'travel',
        },
        {
          id: 'v2',
          word: 'disculpe',
          translation: 'excuse me',
          contextSentence: 'Disculpe, ¿dónde está el baño?',
          masteryScore: 90,
          timesSeen: 8,
          timesCorrect: 8,
          lastPracticedDate: new Date().toISOString(),
          nextReviewDate: new Date(Date.now() + 86400000 * 5).toISOString(),
          isWeakSpot: false,
          categoryTag: 'daily_life',
        },
      ],
      totalMasteredWords: 1,
      totalWeakWords: 1,
    };
  }

  public get(): VocabularyMemory {
    return { ...this.memory };
  }

  public recordWordPractice(
    word: string,
    translation: string,
    isCorrect: boolean,
    contextSentence?: string,
    categoryTag?: string
  ): VocabularyItem {
    const existing = this.memory.items.find(
      (item) => item.word.toLowerCase() === word.toLowerCase()
    );

    let updatedItem: VocabularyItem;

    if (existing) {
      const timesSeen = existing.timesSeen + 1;
      const timesCorrect = existing.timesCorrect + (isCorrect ? 1 : 0);
      const masteryScore = Math.min(100, Math.max(0, Math.round((timesCorrect / timesSeen) * 100)));
      const isWeakSpot = masteryScore < 60;

      updatedItem = {
        ...existing,
        timesSeen,
        timesCorrect,
        masteryScore,
        isWeakSpot,
        lastPracticedDate: new Date().toISOString(),
        nextReviewDate: new Date(Date.now() + (isCorrect ? 86400000 * 3 : 86400000)).toISOString(),
        contextSentence: contextSentence || existing.contextSentence,
      };

      this.memory.items = this.memory.items.map((i) => (i.id === existing.id ? updatedItem : i));
    } else {
      const timesCorrect = isCorrect ? 1 : 0;
      const masteryScore = isCorrect ? 70 : 30;

      updatedItem = {
        id: `voc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        word,
        translation,
        contextSentence,
        masteryScore,
        timesSeen: 1,
        timesCorrect,
        lastPracticedDate: new Date().toISOString(),
        nextReviewDate: new Date(Date.now() + (isCorrect ? 86400000 * 2 : 86400000)).toISOString(),
        isWeakSpot: !isCorrect,
        categoryTag,
      };

      this.memory.items.push(updatedItem);
    }

    this.recalculateTotals();
    return updatedItem;
  }

  public getWeakWords(): VocabularyItem[] {
    return this.memory.items.filter((item) => item.isWeakSpot || item.masteryScore < 60);
  }

  public getDueForReview(): VocabularyItem[] {
    const now = new Date().toISOString();
    return this.memory.items.filter((item) => item.nextReviewDate <= now);
  }

  private recalculateTotals(): void {
    this.memory.totalMasteredWords = this.memory.items.filter((i) => i.masteryScore >= 80).length;
    this.memory.totalWeakWords = this.memory.items.filter((i) => i.isWeakSpot).length;
  }
}
