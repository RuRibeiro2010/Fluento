import { StudyPlanEntity } from '../../../../domain/learning/entities/study-plan.entity';
import { IStudyPlanRepository } from '../../../../domain/learning/repositories/study-plan-repository.interface';

/**
 * IN-MEMORY STUDY PLAN REPOSITORY
 *
 * Default production implementation of `IStudyPlanRepository`. See
 * `in-memory-student.repository.ts` for the rationale and Sprint
 * 16A.4.1 relocation notes. Behavior is unchanged from the previous
 * implementation in `src/application/__tests__/fixtures.ts`.
 */
export class InMemoryStudyPlanRepository implements IStudyPlanRepository {
  private plans = new Map<string, StudyPlanEntity>();

  public async findByStudentId(studentId: string): Promise<StudyPlanEntity | null> {
    for (const plan of this.plans.values()) {
      if (plan.studentId === studentId) return plan;
    }
    return null;
  }

  public async save(plan: StudyPlanEntity): Promise<void> {
    this.plans.set(plan.id, plan);
  }
}
