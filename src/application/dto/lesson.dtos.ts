import { LessonDTO } from './application.dtos';

export interface LessonContentDTO {
  readonly vocabulary: Array<{
    readonly word: string;
    readonly translation: string;
    readonly example: string;
  }>;
  readonly grammarNotes: string[];
  readonly dialogue: Array<{
    readonly speaker: string;
    readonly text: string;
    readonly translation: string;
  }>;
  readonly exercises: Array<{
    readonly id: string;
    readonly type: string;
    readonly prompt: string;
    readonly options?: Array<{ id: string; text: string }>;
    readonly correctAnswer: string;
    readonly explanation: string;
  }>;
  readonly explainBetter: {
    readonly concept: string;
    readonly simpleExplanation: string;
    readonly analogy: string;
    readonly nativeLanguageBridge: string;
  };
}

export interface DetailedLessonDTO extends LessonDTO {
  readonly description: string;
  readonly targetLanguage: string;
  readonly nativeLanguage: string;
  readonly type: string;
  readonly completed: boolean;
  readonly pedagogicalDecision: {
    readonly studentNeeds: string;
    readonly rationale: string;
    readonly methodology: string;
    readonly estimatedMinutes: number;
    readonly expectedFriction: string;
    readonly motivationalHook: string;
  };
  readonly smartIntroduction: {
    readonly whyThisLessonExists: string;
    readonly whyItIsImportant: string;
    readonly howItHelpsGoal: string;
  };
  readonly smartEnding: {
    readonly whatImproved: string;
    readonly whatNeedsWork: string;
    readonly previewTomorrow: string;
  };
  readonly intelligentHomework: {
    readonly title: string;
    readonly type: string;
    readonly description: string;
    readonly estimatedMinutes: number;
    readonly goalTag: string;
    readonly actionInstruction: string;
  };
  readonly content: LessonContentDTO;
  readonly createdAt: string;
}
