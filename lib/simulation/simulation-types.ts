/**
 * Teacher Simulation Lab - Types & Interfaces (Sprint 1)
 * Complete data model for synthetic student profiles, simulation scenarios,
 * session telemetry evaluation, teacher guideline compliance auditing,
 * and automated lab quality reporting.
 */

export type StudentArchetype =
  | 'exam_prep_teen'
  | 'erasmus_student'
  | 'emigrating_pro'
  | 'doctor'
  | 'engineer'
  | 'very_shy'
  | 'highly_confident'
  | 'speaking_anxiety'
  | 'dyslexia_learner'
  | 'fast_learner'
  | 'high_revision_needed'
  | 'time_constrained_10min';

export interface StudentPersonalityTraits {
  shynessLevel: number; // 0-100
  speakingAnxietyLevel: number; // 0-100
  learningSpeed: number; // 0-100
  retentionDecayRate: number; // 0-100
  dailyAvailableMinutes: number;
  hasDyslexia: boolean;
  preferredContext: 'medical' | 'engineering' | 'corporate' | 'academic' | 'casual';
}

export interface SyntheticStudentProfile {
  id: string;
  name: string;
  archetype: StudentArchetype;
  traits: StudentPersonalityTraits;
  currentCEFR: string;
  targetCEFR: string;
  primaryGoal: string;
  isFictional: true; // Safety constraint: 100% fictional profile guarantee
}

export type SimulationScenarioType =
  | 'onboarding'
  | 'placement_test'
  | 'first_lesson'
  | 'consecutive_sessions'
  | 'reviews'
  | 'missions'
  | 'conversations'
  | 'shadowing'
  | 'presentations'
  | 'multi_week_evolution';

export interface SimulationConfig {
  scenarioType: SimulationScenarioType;
  simulatedSessionsCount: number;
  simulatedWeeksDuration: number;
  studentProfile: SyntheticStudentProfile;
}

export interface StudentSessionTelemetry {
  retentionScore: number; // 0-100
  confidenceScore: number; // 0-100
  studentTalkTimeRatio: number; // 0-100 (%)
  cognitiveLoadScore: number; // 0-100
  motivationScore: number; // 0-100
  naturalnessScore: number; // 0-100
  progressScore: number; // 0-100
  learningRoiScore: number; // 0-100
  flowStateIndex: number; // 0-100
}

export interface TeacherComplianceEvaluation {
  spokeTooMuch: boolean; // Flagged if teacher talk time > 45%
  overCorrected: boolean; // Flagged if corrections per turn > 2
  askedOpenEndedQuestions: boolean; // Verified open question ratio
  respectedWaitTimeAndSilence: boolean; // Verified pause allowance
  explainedSimplyWithoutMonologue: boolean; // Verified concise explanations
  adaptedDifficultyInRealTime: boolean; // Verified momentum offset
  leveragedSuccessMemories: boolean; // Verified "Memory of Success" usage
  builtConfidenceAndReducedAnxiety: boolean; // Verified positive shift
  overallTeacherGuidelineScore: number; // 0-100
  violatedGuidelines: string[];
}

export interface SimulatedSessionResult {
  sessionId: string;
  sessionNumber: number;
  scenarioType: SimulationScenarioType;
  studentTelemetry: StudentSessionTelemetry;
  teacherEvaluation: TeacherComplianceEvaluation;
  timestampIso: string;
}

export interface TeacherSimulationLabReport {
  reportId: string;
  timestampIso: string;
  evaluatedStudentProfile: SyntheticStudentProfile;
  totalSessionsSimulated: number;
  averageStudentTalkTime: number; // %
  averageFlowStateIndex: number; // 0-100
  averageLearningRoi: number; // 0-100
  averageTeacherComplianceScore: number; // 0-100
  strengths: string[];
  discoveredIssues: string[];
  detectedRegressions: string[];
  improvementOpportunities: string[];
  summaryConclusion: string;
}
