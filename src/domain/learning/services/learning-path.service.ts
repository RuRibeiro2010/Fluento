import { StudyPlanEntity } from '../entities/study-plan.entity';

export class LearningPathService {
  /**
   * Calculates overall progress percentage for a study plan based on completed missions.
   */
  public calculateProgressPercentage(plan: StudyPlanEntity): number {
    const missions = plan.missions;
    if (missions.length === 0) return 0;
    const completedCount = missions.filter((m) => m.isCompleted).length;
    return Math.round((completedCount / missions.length) * 100);
  }
}
