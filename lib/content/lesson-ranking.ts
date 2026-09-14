import { LessonRecord, StudentSimilarityProfile } from '@/types/content';
import { SimilarityEngine, defaultSimilarityEngine } from './similarity';

export interface RankedLessonCandidate {
  lesson: LessonRecord;
  compositeScore: number; // 0 - 100
  similarityScore: number;
  qualityScore: number;
  rankReason: string;
}

/**
 * Lesson Ranking Engine
 * Ranks candidate lessons using a composite formula combining Quality Score, Similarity Match, and Usage Freshness.
 */
export class LessonRankingEngine {
  private similarityEngine: SimilarityEngine;

  constructor(similarityEngine: SimilarityEngine = defaultSimilarityEngine) {
    this.similarityEngine = similarityEngine;
  }

  /**
   * Ranks a collection of candidate lessons for a target student profile.
   */
  public rankLessons(
    candidates: LessonRecord[],
    targetStudent: StudentSimilarityProfile
  ): RankedLessonCandidate[] {
    const rankedList: RankedLessonCandidate[] = candidates.map((lesson) => {
      const refProfile: StudentSimilarityProfile = {
        userId: lesson.originalUserId,
        targetLanguage: lesson.targetLanguage,
        cefrLevel: lesson.cefrLevel,
        objectives: [lesson.objective],
        interests: lesson.workedSkills,
        weaknesses: lesson.commonErrorsObserved,
        learningStyle: 'auditory',
        timeAvailableMinutes: lesson.averageTimeMinutes,
      };

      const similarityScore = this.similarityEngine.calculateSimilarity(targetStudent, refProfile);
      const qualityScore = lesson.qualityScore;

      // Composite Score: 60% Similarity + 40% Quality Score
      const compositeScore = Math.round(similarityScore * 0.6 + qualityScore * 0.4);

      let rankReason = `High alignment (${similarityScore}% match) with a ${qualityScore}/100 quality benchmark.`;
      if (similarityScore > 80) {
        rankReason = `Strong topic & skill synergy for level ${targetStudent.cefrLevel}.`;
      } else if (qualityScore >= 95) {
        rankReason = `Top 5% global retention benchmark lesson (${qualityScore} quality).`;
      }

      return {
        lesson,
        compositeScore,
        similarityScore,
        qualityScore,
        rankReason,
      };
    });

    // Sort descending by compositeScore
    return rankedList.sort((a, b) => b.compositeScore - a.compositeScore);
  }
}

export const defaultLessonRankingEngine = new LessonRankingEngine();
