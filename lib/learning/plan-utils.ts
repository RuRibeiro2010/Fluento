import { StudyPlan, StudyPlanModule } from '@/types/study-plan';

export function getPlanProgress(plan: StudyPlan): number {
  if (!plan.modules || plan.modules.length === 0) return 0;

  const totalLessons = plan.modules.reduce((acc, m) => acc + (m.totalLessons || m.lessonIds.length || 0), 0);
  if (totalLessons === 0) return 0;

  const completed = plan.modules.reduce((acc, m) => acc + (m.completedCount || 0), 0);
  return Math.min(100, Math.round((completed / totalLessons) * 100));
}

export function getActiveModule(plan: StudyPlan): StudyPlanModule | null {
  if (!plan.modules || plan.modules.length === 0) return null;
  return plan.modules.find((m) => m.completedCount < m.totalLessons) || plan.modules[0];
}
