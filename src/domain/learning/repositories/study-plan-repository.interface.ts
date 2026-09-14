import { StudyPlanEntity } from '../entities/study-plan.entity';

export interface IStudyPlanRepository {
  findByStudentId(studentId: string): Promise<StudyPlanEntity | null>;
  save(plan: StudyPlanEntity): Promise<void>;
}
