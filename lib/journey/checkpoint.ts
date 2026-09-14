import { CheckpointStatus } from '@/types/journey';
import { CEFRLevel, StudentModel } from '@/types/brain';
import { LEARNING_GRAPH_NODES } from './learning-graph';

/**
 * Checkpoint Engine
 * Evaluates whether a student demonstrates sufficient mastery (>= 80% competency & key topic completion)
 * to pass CEFR checkpoints (A1 through C2) before unlocking the next level tier.
 */
export class CheckpointEngine {
  public static readonly PASS_THRESHOLD_PERCENT = 80;

  /**
   * Evaluates checkpoint status for a specific CEFR level
   */
  public evaluateCheckpoint(
    level: CEFRLevel,
    studentModel: StudentModel,
    masteredTopicIds: string[]
  ): CheckpointStatus {
    const levelTopics = LEARNING_GRAPH_NODES.filter((n) => n.cefrLevel === level);
    const requiredTopicsCount = levelTopics.length || 1;

    const masteredSet = new Set(masteredTopicIds.map((id) => id.toLowerCase()));
    const masteredInLevel = levelTopics.filter((n) => masteredSet.has(n.id.toLowerCase()));
    const masteredTopicsCount = masteredInLevel.length;

    // Calculate level overall mastery combining topic completion and skill scores
    const skillAvg = Math.round(
      (studentModel.grammarMasteryPercent +
        studentModel.vocabularyMasteryPercent +
        studentModel.speakingMasteryPercent +
        studentModel.listeningMasteryPercent) /
        4
    );

    const topicCompletionRatio = Math.min(1.0, masteredTopicsCount / requiredTopicsCount);
    const overallMasteryPercent = Math.round(skillAvg * 0.5 + topicCompletionRatio * 100 * 0.5);

    const isPassed = overallMasteryPercent >= CheckpointEngine.PASS_THRESHOLD_PERCENT && masteredTopicsCount >= Math.ceil(requiredTopicsCount * 0.75);

    // Determine if unlocked (unlocked if user's CEFR level matches or exceeds, or previous checkpoint passed)
    const cefrLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const userCefrIdx = cefrLevels.indexOf(studentModel.currentCefr);
    const targetCefrIdx = cefrLevels.indexOf(level);
    const isUnlocked = targetCefrIdx <= userCefrIdx + 1;

    const remainingRequirements: string[] = [];
    if (masteredTopicsCount < requiredTopicsCount) {
      const missing = levelTopics.filter((n) => !masteredSet.has(n.id.toLowerCase()));
      missing.forEach((m) => remainingRequirements.push(`Complete topic: ${m.title}`));
    }
    if (skillAvg < CheckpointEngine.PASS_THRESHOLD_PERCENT) {
      remainingRequirements.push(`Raise average skills from ${skillAvg}% to ${CheckpointEngine.PASS_THRESHOLD_PERCENT}%`);
    }

    const titlesMap: Record<CEFRLevel, string> = {
      A1: 'Checkpoint A1: Foundational Beginner',
      A2: 'Checkpoint A2: Elementary Social Communicator',
      B1: 'Checkpoint B1: Independent Intermediate',
      B2: 'Checkpoint B2: Upper-Intermediate Professional',
      C1: 'Checkpoint C1: Advanced Fluent Speaker',
      C2: 'Checkpoint C2: Native-like Mastery',
    };

    return {
      cefrLevel: level,
      title: titlesMap[level] || `Checkpoint ${level}`,
      isUnlocked,
      isPassed,
      overallMasteryPercent,
      requiredTopicsCount,
      masteredTopicsCount,
      remainingRequirements,
    };
  }

  /**
   * Evaluates all checkpoints from A1 to C2
   */
  public getAllCheckpoints(
    studentModel: StudentModel,
    masteredTopicIds: string[]
  ): CheckpointStatus[] {
    const cefrLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return cefrLevels.map((lvl) => this.evaluateCheckpoint(lvl, studentModel, masteredTopicIds));
  }

  /**
   * Checks if student is ready to unlock and jump to the next CEFR tier
   */
  public canProgressToNextLevel(
    currentLevel: CEFRLevel,
    studentModel: StudentModel,
    masteredTopicIds: string[]
  ): boolean {
    const status = this.evaluateCheckpoint(currentLevel, studentModel, masteredTopicIds);
    return status.isPassed;
  }
}

export const defaultCheckpointEngine = new CheckpointEngine();
