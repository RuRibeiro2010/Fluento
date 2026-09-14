/**
 * FLUENTO LEARNING ANALYTICS ENGINE - TYPES & INTERFACES
 * 
 * Defines the strongly-typed data structures for objective student evolution measurement.
 * Excludes vanity metrics (streaks, raw minutes) as primary indicators.
 * Focuses on observable linguistic progress, independence, retention, velocity, transfer,
 * anxiety reduction, real-world readiness, and learning ROI.
 */

import { CEFRLevel } from '@/types/brain';

export interface ConfidenceMetric {
  score: number; // 0 - 100
  speakingConfidence: number; // 0 - 100
  listeningConfidence: number; // 0 - 100
  grammarConfidence: number; // 0 - 100
  pronunciationConfidence: number; // 0 - 100
  trend: 'improving' | 'stable' | 'declining';
  evaluationNote: string;
}

export interface IndependenceMetric {
  score: number; // 0 - 100 (high student talk ratio, low scaffold dependency)
  unassistedTurnRatio: number; // 0.0 - 1.0
  scaffoldDependencyLevel: 'none' | 'minimal' | 'moderate' | 'heavy';
  avgResponseDelaySeconds: number;
  evaluationNote: string;
}

export interface RetentionMetric {
  score: number; // 0 - 100
  activeRecallSuccessRate: number; // 0.0 - 1.0
  decayResilienceScore: number; // 0 - 100
  srsItemCount: number;
  dueReviewItemsCount: number;
  evaluationNote: string;
}

export interface VelocityMetric {
  currentCefr: CEFRLevel;
  targetCefr: CEFRLevel;
  masteryRatePerWeek: number; // concepts mastered per week
  estimatedWeeksToTargetCefr: number;
  velocityRating: 'accelerated' | 'steady' | 'sluggish' | 'stalled';
  evaluationNote: string;
}

export interface TransferMetric {
  score: number; // 0 - 100
  spontaneousUsageCount: number;
  l1InterferenceReductionRate: number; // 0.0 - 1.0
  contextAdaptabilityScore: number; // 0 - 100
  evaluationNote: string;
}

export interface AnxietyTrendMetric {
  currentAnxietyLevel: number; // 0 - 100
  baselineAnxietyLevel: number; // 0 - 100
  anxietyDelta: number; // negative is reduction (positive)
  trend: 'significantly_decreased' | 'improving' | 'stable' | 'escalating';
  affectiveFilterStatus: 'optimal' | 'moderate' | 'panic';
  evaluationNote: string;
}

export interface ReadinessMetric {
  overallReadinessScore: number; // 0 - 100
  professionalReadinessScore: number; // 0 - 100
  travelSocialReadinessScore: number; // 0 - 100
  spontaneityScore: number; // 0 - 100
  readinessLevel: 'emerging' | 'functional' | 'proficient' | 'autonomous';
  evaluationNote: string;
}

export interface LearningROIMetric {
  progressPointsPerHoursSpent: number; // e.g. 15.5 points / hour
  efficiencyScore: number; // 0 - 100
  totalHoursSpent: number;
  masteredConceptsTotal: number;
  roiRating: 'exceptional' | 'high' | 'moderate' | 'suboptimal';
  evaluationNote: string;
}

export interface LearningAnalyticsReport {
  studentId: string;
  generatedAtIso: string;
  reportPeriodDays: number;
  revision: number;
  confidence: ConfidenceMetric;
  independence: IndependenceMetric;
  retention: RetentionMetric;
  velocity: VelocityMetric;
  transfer: TransferMetric;
  anxietyTrend: AnxietyTrendMetric;
  readiness: ReadinessMetric;
  roi: LearningROIMetric;
  overallEvolutionScore: number; // 0 - 100 composite index
  executiveSummary: string;
}

export interface AnalyticsTelemetryEvent {
  eventId: string;
  studentId: string;
  timestampIso: string;
  overallScore: number;
  keyObservation: string;
}
