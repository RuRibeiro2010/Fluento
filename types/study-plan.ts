export interface StudyPlanModule {
  id: string;
  title: string;
  description?: string;
  focus: string;
  lessonIds: string[];
  completedCount: number;
  totalLessons: number;
}

export interface StudyPlan {
  id: string;
  userId: string;
  targetLanguage: string;
  nativeLanguage: string;
  title: string;
  goal: string;
  currentLevel: string;
  modules: StudyPlanModule[];
  estimatedWeeks: number;
  createdAt: string;
  updatedAt: string;
}
