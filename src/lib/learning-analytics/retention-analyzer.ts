/**
 * FLUENTO LEARNING ANALYTICS - RETENTION ANALYZER
 * 
 * Measures active recall success rates, memory decay resilience,
 * and SRS review health from Learning Threads Runtime.
 */

import { ThreadSnapshot } from '@/src/lib/learning-threads';
import { RetentionMetric } from './types';

export class RetentionAnalyzer {
  public analyzeRetention(threads: ThreadSnapshot): RetentionMetric {
    const reviewItems = threads.reviewItems;
    const srsItemCount = reviewItems.length;

    if (srsItemCount === 0) {
      return {
        score: 70, // neutral baseline when starting out
        activeRecallSuccessRate: 0.8,
        decayResilienceScore: 70,
        srsItemCount: 0,
        dueReviewItemsCount: 0,
        evaluationNote: 'Sem itens SRS suficientes para cálculo avançado de retenção.'
      };
    }

    // Active recall success rate based on consecutive successes
    const totalConsecutive = reviewItems.reduce((acc, item) => acc + (item.consecutiveSuccesses || 0), 0);
    const recallRate = Math.min(1.0, totalConsecutive / Math.max(1, srsItemCount * 2));

    // Items with low decay score (< 40) are resilient
    const resilientItemsCount = reviewItems.filter(item => item.decayScore < 40).length;
    const decayResilienceScore = Math.round((resilientItemsCount / srsItemCount) * 100);

    const dueReviewItemsCount = reviewItems.filter(item => item.decayScore >= 50).length;

    // Overall retention score computation
    const retentionScore = Math.min(
      100,
      Math.max(0, Math.round(recallRate * 50 + decayResilienceScore * 0.5))
    );

    return {
      score: retentionScore,
      activeRecallSuccessRate: Math.round(recallRate * 100) / 100,
      decayResilienceScore,
      srsItemCount,
      dueReviewItemsCount,
      evaluationNote: `Taxa de retenção ativa calculada em ${retentionScore}/100 com ${dueReviewItemsCount} itens pendentes de revisão.`
    };
  }
}

export const retentionAnalyzer = new RetentionAnalyzer();
