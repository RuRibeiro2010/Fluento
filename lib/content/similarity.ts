import { StudentSimilarityProfile } from '@/types/content';

/**
 * Similarity Engine
 * Calculates a multi-dimensional similarity score (0 to 100) between two learners or a learner and a historical lesson context.
 * Compares: CEFR level, target language, objectives, weaknesses, interests, learning style, and available time.
 */
export class SimilarityEngine {
  /**
   * Calculates similarity score between a target student profile and a reference profile.
   */
  public calculateSimilarity(
    studentA: StudentSimilarityProfile,
    studentB: StudentSimilarityProfile
  ): number {
    // 1. Target Language Check (Must match or score is heavily reduced)
    if (studentA.targetLanguage.toLowerCase() !== studentB.targetLanguage.toLowerCase()) {
      return 0;
    }

    // 2. CEFR Level Similarity (Weight: 25%)
    const levelScore = this.calculateCefrMatch(studentA.cefrLevel, studentB.cefrLevel) * 25;

    // 3. Objectives Overlap (Weight: 20%)
    const objectivesScore = this.calculateSetOverlap(studentA.objectives, studentB.objectives) * 20;

    // 4. Weaknesses / Difficulties Overlap (Weight: 20%)
    const weaknessesScore = this.calculateSetOverlap(studentA.weaknesses, studentB.weaknesses) * 20;

    // 5. Interests Overlap (Weight: 15%)
    const interestsScore = this.calculateSetOverlap(studentA.interests, studentB.interests) * 15;

    // 6. Learning Style Match (Weight: 10%)
    const styleScore = studentA.learningStyle === studentB.learningStyle ? 10 : 3;

    // 7. Time Available Proximity (Weight: 10%)
    const timeDiffMinutes = Math.abs(studentA.timeAvailableMinutes - studentB.timeAvailableMinutes);
    const timeScore = Math.max(0, 10 - timeDiffMinutes * 0.5);

    const totalSimilarityScore = Math.round(
      levelScore + objectivesScore + weaknessesScore + interestsScore + styleScore + timeScore
    );

    return Math.min(100, Math.max(0, totalSimilarityScore));
  }

  private calculateCefrMatch(levelA: string, levelB: string): number {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const idxA = levels.indexOf(levelA);
    const idxB = levels.indexOf(levelB);

    if (idxA === -1 || idxB === -1) return 0.5;
    const distance = Math.abs(idxA - idxB);

    if (distance === 0) return 1.0;
    if (distance === 1) return 0.7;
    if (distance === 2) return 0.3;
    return 0.0;
  }

  private calculateSetOverlap(listA: string[], listB: string[]): number {
    if (!listA || !listB || listA.length === 0 || listB.length === 0) return 0.2;

    const setB = new Set(listB.map((s) => s.toLowerCase()));
    let matches = 0;

    listA.forEach((item) => {
      if (setB.has(item.toLowerCase())) {
        matches++;
      } else {
        // Partial string match check
        for (const bItem of Array.from(setB)) {
          if (bItem.includes(item.toLowerCase()) || item.toLowerCase().includes(bItem)) {
            matches += 0.5;
            break;
          }
        }
      }
    });

    const maxLen = Math.max(listA.length, listB.length);
    return Math.min(1.0, matches / maxLen);
  }
}

export const defaultSimilarityEngine = new SimilarityEngine();
