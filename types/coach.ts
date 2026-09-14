export interface DailyCoachMessage {
  greeting: string;
  advice: string;
  focusSkill: 'grammar' | 'speaking' | 'vocabulary' | 'listening' | 'reading' | 'writing' | 'review' | 'mission' | 'conversation';
  recommendedAction: string;
  motivationQuote: string;
  tone: 'encouraging' | 'academic' | 'casual' | 'socratic' | 'strict';
}

export interface DaySchedule {
  dayNumber: number; // 1 to 7
  dayName: string; // 'Monday', 'Tuesday', etc.
  focusArea: 'conversation' | 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'writing' | 'reading' | 'review' | 'mission';
  title: string;
  description: string;
  estimatedMinutes: number;
  lessonType: string;
  difficultyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  isCompleted: boolean;
  missionTask?: string;
  topicTag?: string;
}

export interface WeeklyStudyPlan {
  id: string;
  userId: string;
  targetLanguage: string;
  nativeLanguage: string;
  weekNumber: number;
  title: string;
  overallGoal: string;
  dailySchedules: DaySchedule[];
  adaptedBasedOn: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WeakWordItem {
  word: string;
  translation: string;
  errorCount: number;
  lastPracticed: string;
}

export interface WeakGrammarItem {
  concept: string;
  errorRate: number; // e.g. 0.4 (40% error rate)
  lastReviewed: string;
}

export interface ConfidencePoint {
  date: string;
  score: number; // 0 to 100
}

export interface EmotionalState {
  responseTimeMs?: number;
  recentErrorCount?: number;
  hesitationScore?: number; // 0 to 100
  inactivityDays?: number;
  motivationScore?: number; // 0 to 100
  consistencyScore?: number; // 0 to 100
  detectedMood: 'highly_motivated' | 'confident' | 'hesitant' | 'demotivated' | 'fatigued';
  coachAdaptation: string;
}

export interface SundayWeeklyReview {
  id: string;
  weekNumber: number;
  dateRange: string;
  achievements: string[];
  weaknessesIdentified: string[];
  completedGoals: string[];
  nextWeekPlan: string[];
  coachPersonalNote: string;
  isViewed?: boolean;
}

export interface MonthlyMilestone {
  id: string;
  date: string;
  title: string;
  category: 'first_lesson' | 'level_up' | 'streak_milestone' | 'grammar_mastery' | 'speaking_breakthrough' | 'mission_completed';
  description: string;
  badgeIcon?: string;
}

export interface MonthlyEvolutionData {
  userId: string;
  firstLessonDate: string;
  initialLevel: string;
  currentLevel: string;
  wordsLearnedCount: number;
  grammarRulesMastered: number;
  pronunciationScore: number;
  fluencyScore: number;
  totalTimeStudiedMinutes: number;
  consecutiveStreakDays: number;
  biggestAchievements: string[];
  milestonesTimeline: MonthlyMilestone[];
}

export interface LongitudinalMemory {
  userId: string;
  targetLanguage: string;
  weakWords: WeakWordItem[];
  weakGrammar: WeakGrammarItem[];
  confidenceTrend: ConfidencePoint[];
  learningVelocity: 'accelerating' | 'steady' | 'needs_reinforcement';
  masteredTopics: string[];
  totalPracticeMinutes: number;
  streakDays: number;
  lastSessionDate?: string;
  emotionalState?: EmotionalState;
  pastErrorsMemory?: string[];
  userContextDetails?: {
    profession?: string;
    hobbies?: string[];
    favoriteTopics?: string[];
    ageGroup?: string;
    motivationReason?: string;
  };
}
