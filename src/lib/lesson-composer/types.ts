/**
 * FLUENTO LESSON COMPOSER - TYPES & INTERFACES
 * 
 * Defines the structural representation of a composed, multi-block pedagogical lesson.
 * Translates a LessonBlueprint from the Learning Engine into a fully structured,
 * executable session architecture.
 */

import { LessonBlueprint, TeachingStrategy, DifficultyParameters } from '@/src/lib/learning-engine';

export type BlockType = 
  | 'warmup' 
  | 'conversation' 
  | 'practice' 
  | 'correction' 
  | 'reflection' 
  | 'closing';

export type InteractionPattern = 
  | 'free_dialogue' 
  | 'guided_q_and_a' 
  | 'scenario_roleplay' 
  | 'recasting_feedback' 
  | 'metacognitive_reflection'
  | 'closing_bridge';

export interface LessonActivity {
  activityId: string;
  type: 'icebreaker' | 'roleplay' | 'guided_question' | 'recasting_exercise' | 'reflection_prompt' | 'closing_summary';
  title: string;
  estimatedMinutes: number;
  scaffoldingHint: string;
  targetSkill: string;
  teacherInstruction: string;
}

export interface LessonBlock {
  blockId: string;
  type: BlockType;
  title: string;
  durationMinutes: number;
  pedagogicalObjective: string;
  interactionPattern: InteractionPattern;
  activities: LessonActivity[];
  guidelines: string[];
}

export interface ComposedLessonPedagogyConfig {
  scaffoldingLevel: TeachingStrategy['scaffoldingLevel'];
  recastingMode: TeachingStrategy['recastingMode'];
  tone: TeachingStrategy['tone'];
  targetStudentTalkTimeRatio: number;
  waitTimeSeconds: number;
  forbiddenBehaviours: string[];
  difficulty: DifficultyParameters;
}

export interface ComposedLesson {
  lessonId: string;
  studentId: string;
  blueprintId: string;
  timestampIso: string;
  totalDurationMinutes: number;
  pedagogicalConfig: ComposedLessonPedagogyConfig;
  blocks: LessonBlock[];
  successCriteria: string[];
}

export interface BlockBuilderContext {
  blueprint: LessonBlueprint;
  allocatedMinutes: number;
  blockSequenceIndex: number;
}
