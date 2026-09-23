export interface LearningHistoryRecord {
  readonly sessionId: string;
  readonly dateIso: string;
  readonly topicTitle: string;
  readonly cefrLevel: string;
  readonly accuracyPercent: number;
  readonly keyFeedback?: string;
}

export interface StudentProfileDTO {
  readonly id: string;
  readonly name?: string;
  readonly email?: string;
  readonly nativeLanguage: string;
  readonly targetLanguages: string[];
  readonly currentLevel: string;
  readonly targetLevel: string;
  readonly objectives: {
    readonly primaryMotivation: string;
    readonly professionalDomain?: string;
    readonly currentFocus: string;
    readonly targetExamOrMilestone?: string;
  };
  readonly interests: string[];
  readonly preferences: {
    readonly dailyGoalMinutes: number;
    readonly weeklyGoalMinutes: number;
    readonly preferredTeacherPersona: string;
    readonly correctionStrictness: 'gentle' | 'balanced' | 'strict';
    readonly pace: 'slow' | 'moderate' | 'fast';
    readonly learningStyle?: 'auditory' | 'visual' | 'interactive' | 'reflective';
  };
  readonly version: number;
  readonly createdAtIso: string;
  readonly updatedAtIso: string;
  readonly lastSyncedAtIso?: string;
}

// Alias for backward compatibility during migration
export type StudentProfileData = StudentProfileDTO;
