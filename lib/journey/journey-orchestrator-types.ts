/**
 * Learning Journey Orchestrator - Types & Interfaces (Sprint A)
 * Complete data model for multi-horizon planning (1w, 1m, 3m, 6m),
 * real-world goals, competency milestones, life events, learning ROI,
 * internal professor notebook, decision explainability, and safety constraints.
 */

export type RealWorldGoalCategory =
  | 'job_interview'
  | 'work_presentation'
  | 'team_meetings'
  | 'travel_relocation'
  | 'university_admission'
  | 'certification_exam';

export interface RealWorldGoal {
  id: string;
  category: RealWorldGoalCategory;
  title: string;
  description: string;
  targetDateIso?: string;
  priorityScore: number; // 0-100
  isCompleted: boolean;
}

export interface CompetencyMilestone {
  id: string;
  title: string;
  description: string;
  requiredCompetencies: string[];
  estimatedWeeksToUnlock: number;
  isUnlocked: boolean;
  isAchieved: boolean;
  achievedAtIso?: string;
}

export interface LifeEvent {
  id: string;
  type: RealWorldGoalCategory;
  title: string;
  eventDateIso: string;
  urgencyLevel: 'low' | 'moderate' | 'high' | 'critical';
  status: 'upcoming' | 'active' | 'completed';
  temporaryFocusTopics: string[];
  postEventAction: 'resume_standard_journey' | 'reevaluate_goals';
}

export interface HorizonProjection {
  timeframe: '1_week' | '1_month' | '3_months' | '6_months';
  targetCEFR: string;
  estimatedMasteryPercentage: number;
  forecastedMilestones: string[];
  probabilisticSuccessRate: number; // 0.0 to 1.0 (Safety constraint: always probabilistic)
  keyRiskFactors: string[];
}

export interface HorizonProjections {
  oneWeek: HorizonProjection;
  oneMonth: HorizonProjection;
  threeMonths: HorizonProjection;
  sixMonths: HorizonProjection;
}

export interface LearningROIEvaluation {
  activityTitle: string;
  learningYieldPerMinute: number; // Score 0-100
  timeCostMinutes: number;
  expectedCompetencyGain: number; // 0-100
  alternativeComparison: string;
  recommendationDecision: 'proceed' | 'optimize_duration' | 'replace_with_higher_roi';
}

export interface ProfessorNotebookEntry {
  id: string;
  timestampIso: string;
  observationCategory:
    | 'spontaneous_speaking'
    | 'confidence_shift'
    | 'grammar_avoidance'
    | 'effective_pedagogy'
    | 'struggle_point';
  observationText: string;
  pedagogicalActionTaken: string;
  internalOnlyFlag: true; // Explicitly marked internal, never rendered in user UI
}

export interface JourneyExplainability {
  primaryDecisionRationale: string;
  rejectedAlternativesRationale: string;
  expectedLongTermImpact: string;
  safetyCheckPassed: boolean; // Confirms no artificial ceilings or harmful labels were imposed
}

export interface OrchestratedJourneySnapshot {
  userId: string;
  activeGoal: RealWorldGoal;
  milestones: CompetencyMilestone[];
  activeLifeEvents: LifeEvent[];
  horizons: HorizonProjections;
  roiEvaluations: LearningROIEvaluation[];
  professorNotebook: ProfessorNotebookEntry[];
  explainability: JourneyExplainability;
  lastRecalculatedIso: string;
}
