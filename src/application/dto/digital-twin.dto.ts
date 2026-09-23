export interface DigitalTwinDTO {
  readonly studentId: string;
  readonly currentLevel: string;
  readonly targetLevel: string;
  readonly competencies: {
    readonly speaking: number;
    readonly listening: number;
    readonly reading: number;
    readonly writing: number;
    readonly grammar: number;
    readonly vocabulary: number;
    readonly pronunciation: number;
    readonly fluency: number;
    readonly confidence: number;
  };
  readonly progress: {
    readonly completedSessionsCount: number;
    readonly totalMinutesPracticed: number;
    readonly wordsLearnedCount: number;
    readonly streakDays: number;
    readonly completedMinutesThisWeek: number;
    readonly lastSessionDateIso: string;
    readonly lastSessionTopic: string;
  };
  readonly strengths: string[];
  readonly weaknesses: string[];
  readonly version: number;
  readonly updatedAtIso: string;
}
