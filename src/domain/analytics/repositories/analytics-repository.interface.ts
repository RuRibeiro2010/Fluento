import { StudentAnalyticsEntity } from '../entities/student-analytics.entity';

export interface IAnalyticsRepository {
  findByStudentId(studentId: string): Promise<StudentAnalyticsEntity | null>;
  save(analytics: StudentAnalyticsEntity): Promise<void>;
}
