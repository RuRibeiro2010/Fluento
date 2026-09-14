import { ReviewItem, StudentModel } from '@/types/brain';
import { TrackedWord } from '@/types/profile';

/**
 * Review Engine
 * Implements non-random, scientifically grounded spaced repetition (SM-2 + Forgetting Curve R = e^(-t/S)).
 * Decides WHEN, WHAT, HOW MUCH, and WHY to review based on Confidence, History, and Memory Strength.
 */
export class ReviewEngine {
  /**
   * Generates a tailored, prioritized review queue for the user.
   */
  public generateReviewQueue(
    model: StudentModel,
    maxItemsCount?: number
  ): { reviewQueue: ReviewItem[]; totalDueCount: number; reviewReasonSummary: string } {
    const limit = maxItemsCount || Math.max(3, Math.round(model.preferredSessionLengthMinutes / 3));
    const items: ReviewItem[] = [];

    const now = new Date().getTime();

    // 1. Process Vocabulary Items requiring review
    model.vocabularyInventory.forEach((word) => {
      const reviewItem = this.evaluateWordForReview(word, now);
      if (reviewItem) {
        items.push(reviewItem);
      }
    });

    // 2. Process Grammar Concepts requiring review
    model.commonErrorsList.forEach((err, idx) => {
      const lastOccurredMs = new Date(err.lastOccurred).getTime();
      const hoursPassed = (now - lastOccurredMs) / (1000 * 3600);
      const decayProbability = Math.min(95, Math.max(10, Math.round(hoursPassed * 0.8 + err.frequency * 10)));

      items.push({
        id: `rev-grm-${err.id}`,
        contentType: 'grammar',
        title: err.concept,
        translationOrExplanation: err.examples[0] || 'Grammar rule practice',
        intervalDays: Math.max(1, Math.round(7 / (err.frequency || 1))),
        easeFactor: 2.2,
        repetitionsCount: err.frequency,
        nextDueDate: new Date(now + 86400000).toISOString(),
        reasonToReview: `High error frequency (${err.frequency}x) in recent sessions.`,
        forgettingProbabilityPercent: decayProbability,
      });
    });

    // Sort queue by highest forgetting probability & lowest ease factor
    items.sort((a, b) => b.forgettingProbabilityPercent - a.forgettingProbabilityPercent);

    const reviewQueue = items.slice(0, limit);
    const reviewReasonSummary =
      reviewQueue.length > 0
        ? `Targeting ${reviewQueue.length} priority items due to memory decay and recent practice logs.`
        : 'All items are currently well-retained! Optimal time for new content.';

    return {
      reviewQueue,
      totalDueCount: items.length,
      reviewReasonSummary,
    };
  }

  /**
   * Evaluates a tracked word using the Forgetting Curve R = e^(-t / S)
   */
  private evaluateWordForReview(word: TrackedWord, nowMs: number): ReviewItem | null {
    const lastUsedMs = new Date(word.lastUsedDate).getTime();
    const daysElapsed = Math.max(0.1, (nowMs - lastUsedMs) / (1000 * 3600 * 24));

    // Memory strength S derived from confidence score & state
    let memoryStrength = (word.confidenceScore || 50) / 10; // e.g. 1 to 10 days
    if (word.state === 'uses_naturally') memoryStrength *= 2.5;
    if (word.state === 'uses_with_help') memoryStrength *= 1.5;
    if (word.state === 'recognizes') memoryStrength *= 0.6;

    // Forgetting probability R_loss = (1 - e^(-t / S)) * 100
    const retentionRate = Math.exp(-daysElapsed / Math.max(0.5, memoryStrength));
    const forgettingProbability = Math.min(99, Math.max(5, Math.round((1 - retentionRate) * 100)));

    // Determine if due for review
    const isDue =
      forgettingProbability >= 45 ||
      word.state === 'understands' ||
      word.state === 'uses_with_help' ||
      word.errorCount >= 2;

    if (!isDue) return null;

    let reasonToReview = 'Scheduled Spaced Repetition';
    if (word.state === 'understands') {
      reasonToReview = 'Needs contextual practice to escalate from Passive to Active vocabulary.';
    } else if (word.state === 'uses_with_help') {
      reasonToReview = 'Practice natural unassisted usage in conversational sentences.';
    } else if (forgettingProbability >= 60) {
      reasonToReview = `Memory decay detected (${forgettingProbability}% risk of forgetting).`;
    }

    return {
      id: `rev-word-${word.id}`,
      contentType: 'word',
      title: word.word,
      translationOrExplanation: word.translation,
      intervalDays: Math.round(memoryStrength),
      easeFactor: 2.5,
      repetitionsCount: word.timesUsedCorrectly,
      nextDueDate: new Date(nowMs + 86400000 * memoryStrength).toISOString(),
      reasonToReview,
      forgettingProbabilityPercent: forgettingProbability,
    };
  }
}

export const defaultReviewEngine = new ReviewEngine();
