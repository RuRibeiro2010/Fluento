import { StudentAnalyticsEntity } from '../../../../domain/analytics/entities/student-analytics.entity';
import { IAnalyticsRepository } from '../../../../domain/analytics/repositories/analytics-repository.interface';

/**
 * IN-MEMORY ANALYTICS REPOSITORY
 *
 * Default production implementation of `IAnalyticsRepository`. See
 * `in-memory-student.repository.ts` for the rationale and Sprint
 * 16A.4.1 relocation notes. Behavior is unchanged from the previous
 * implementation in `src/application/__tests__/fixtures.ts`.
 */
export class InMemoryAnalyticsRepository implements IAnalyticsRepository {
  private analyticsMap = new Map<string, StudentAnalyticsEntity>();

  public async findByStudentId(studentId: string): Promise<StudentAnalyticsEntity | null> {
    for (const a of this.analyticsMap.values()) {
      if (a.studentId === studentId) return a;
    }
    return null;
  }

  public async save(analytics: StudentAnalyticsEntity): Promise<void> {
    this.analyticsMap.set(analytics.id, analytics);
  }
}
