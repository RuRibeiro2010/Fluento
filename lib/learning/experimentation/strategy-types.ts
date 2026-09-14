/**
 * Strategy Types for Teaching Strategy & Personal Learning Optimization Engine
 * Defines types for evidence-based pedagogical approaches, learning profiles, and experiment tracking.
 */

export type PedagogicalOrder = 'examples_first' | 'theory_first' | 'guided_discovery';

export type ModalityFocus = 'balanced' | 'speaking_heavy' | 'listening_heavy' | 'interactive_roleplay' | 'story_context';

export type ReviewStyle = 'micro_burst' | 'deep_spaced_review' | 'active_recall_retrieval';

export type CoachPersonalityFit = 'encouraging' | 'direct_demanding' | 'analytical' | 'socratic_guide';

export type ExplanationType = 'analogy' | 'direct_breakdown' | 'native_contrast' | 'real_world_scenario';

export type IncentiveType = 'progress_milestone' | 'mastery_achievement' | 'curiosity_discovery' | 'real_world_utility';

export type TimeOfDayWindow = 'morning' | 'afternoon' | 'evening' | 'night';

export interface StrategyWeight {
  strategyId: string;
  category: 'order' | 'modality' | 'review' | 'explanation';
  weight: number; // 0.0 to 1.0 confidence score
  sampleCount: number;
  avgEfficiencyScore: number;
}

export interface SessionRecord {
  sessionId: string;
  timestamp: number; // ms
  timeOfDay: TimeOfDayWindow;
  durationMinutes: number;
  targetSkill: string;
  completed: boolean;
  accuracyRate: number; // 0.0 to 1.0
  retentionScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  learningEfficiencyScore: number; // LES (0 to 100)
  perceivedChallenge: number; // 0.0 (too easy) to 1.0 (too hard)
  appliedStrategy: {
    order: PedagogicalOrder;
    modality: ModalityFocus;
    reviewStyle: ReviewStyle;
    explanationType: ExplanationType;
  };
}
