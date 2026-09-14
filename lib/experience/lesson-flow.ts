import { FlowStateStatus } from '@/types/experience';
import { StudentModel } from '@/types/brain';

/**
 * Lesson Flow Service
 * Monitors student accuracy, response speed, and hesitation to preserve Flow State.
 * Prevents frustration (too hard) and boredom (too easy).
 */
export class LessonFlowService {
  /**
   * Evaluates current challenge vs skill ratio to maintain Flow State
   */
  public evaluateFlowState(
    studentModel: StudentModel,
    recentAccuracy: number, // 0 - 100
    avgResponseTimeSeconds: number,
    consecutiveErrors: number
  ): FlowStateStatus {
    const skillLevel = studentModel.confidenceScore || 70;

    // Challenge index derived from response time and errors
    let challengeIndex = 100 - recentAccuracy + consecutiveErrors * 15;
    if (avgResponseTimeSeconds > 12) challengeIndex += 20;

    const skillLevelRatio = Number((skillLevel / Math.max(1, challengeIndex)).toFixed(2));

    if (consecutiveErrors >= 3 || recentAccuracy < 50) {
      return {
        currentState: 'frustration',
        skillLevelRatio,
        recommendedAdjustment: 'reduce_challenge',
        rationale: 'High error rate detected. Reducing challenge and providing immediate scaffolding to prevent frustration.',
      };
    }

    if (recentAccuracy > 92 && avgResponseTimeSeconds < 3) {
      return {
        currentState: 'boredom',
        skillLevelRatio,
        recommendedAdjustment: 'increase_challenge',
        rationale: 'Student is executing tasks effortlessly. Increasing challenge and conversation speed to prevent boredom.',
      };
    }

    return {
      currentState: 'flow',
      skillLevelRatio: 1.0,
      recommendedAdjustment: 'maintain',
      rationale: 'Optimal challenge-skill balance achieved. Maintaining current flow rhythm.',
    };
  }
}

export const defaultLessonFlowService = new LessonFlowService();
