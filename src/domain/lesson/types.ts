/**
 * LESSON DOMAIN TYPES
 */

export interface SmartLessonIntroduction {
  whyThisLessonExists: string;
  whyItIsImportant: string;
  howItHelpsGoal: string;
}

export interface SmartLessonEnding {
  whatImproved: string;
  whatNeedsWork: string;
  previewTomorrow: string;
}

export interface PedagogicalDecision {
  studentNeeds: string;
  rationale: string;
  methodology: string;
  estimatedMinutes: number;
  expectedFriction: string;
  motivationalHook: string;
}

export interface IntelligentHomework {
  title: string;
  type: 'video' | 'podcast' | 'news' | 'speech' | 'writing';
  description: string;
  estimatedMinutes: number;
  goalTag?: string;
  actionInstruction?: string;
}
