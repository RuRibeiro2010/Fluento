import { CEFRLevel } from './brain';

export type UserGoalType =
  | 'conversation'
  | 'work'
  | 'university'
  | 'travel'
  | 'ielts'
  | 'toefl'
  | 'business'
  | 'medical'
  | 'tourism';

export type NodeStatus = 'locked' | 'available' | 'current' | 'completed' | 'mastered';

export interface GraphTopicNode {
  id: string;
  title: string;
  description: string;
  cefrLevel: CEFRLevel;
  prerequisites: string[]; // Node IDs required before this node unlocks
  nextTopics: string[]; // Node IDs that unlock after this node
  relatedSkills: ('grammar' | 'vocabulary' | 'speaking' | 'listening' | 'reading' | 'writing')[];
  baseDifficulty: number; // 1-10
  importanceWeight: number; // 1-10
  applicableGoals?: UserGoalType[];
  targetLanguage?: string; // 'universal' or specific code like 'es', 'en', 'pt'
}

export interface RoadmapNode {
  id: string;
  topicId: string;
  title: string;
  description: string;
  cefrLevel: CEFRLevel;
  status: NodeStatus;
  masteryPercent: number; // 0 - 100
  needsReview: boolean; // true if dropped below 70%
  orderIndex: number;
  missionId?: string;
  estimatedMinutes: number;
}

export interface GoalConfig {
  goalType: UserGoalType;
  title: string;
  description: string;
  primarySkills: ('grammar' | 'vocabulary' | 'speaking' | 'listening' | 'reading' | 'writing')[];
  keyTopicFocuses: string[];
  suggestedScenarios: string[];
}

export interface CheckpointStatus {
  cefrLevel: CEFRLevel;
  title: string;
  isUnlocked: boolean;
  isPassed: boolean;
  overallMasteryPercent: number;
  requiredTopicsCount: number;
  masteredTopicsCount: number;
  remainingRequirements: string[];
}

export interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  category: 'conversation' | 'vocabulary' | 'streak' | 'interview' | 'mastery' | 'xp';
  unlockedAt?: string;
  isUnlocked: boolean;
  iconName: string;
  xpReward: number;
}

export interface UnlockedFeature {
  id: string;
  type: 'scenario' | 'teacher_persona' | 'challenge' | 'mission' | 'lesson_type';
  title: string;
  description: string;
  unlockedAt: string;
  iconName?: string;
}

export interface MissionStep {
  stepId: string;
  title: string;
  scenarioTitle: string;
  targetSkills: string[];
  estimatedMinutes: number;
  isCompleted: boolean;
}

export interface Mission {
  id: string;
  title: string;
  locationContext: string;
  cefrLevel: CEFRLevel;
  goalTag: UserGoalType;
  steps: MissionStep[];
  isCompleted: boolean;
  finalSimulationTitle: string;
}

export interface JourneyNextStep {
  roadmapNode: RoadmapNode;
  stepType: 'new_topic' | 'review_decay' | 'mission_step' | 'checkpoint_eval';
  rationale: string;
  targetMission?: Mission;
  recommendedTeacherId: string;
  estimatedMinutes: number;
}
