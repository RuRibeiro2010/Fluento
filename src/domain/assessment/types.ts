import { SkillMatrix, LearningProfileDiagnostic, DiagnosticInitialPlan } from '@/types/profile';
import { CEFRLevelType } from '../shared/value-objects/cefr-level.vo';

/**
 * ASSESSMENT DOMAIN TYPES
 */

export interface AssessmentTurnResponse {
  turnId: string;
  turnType: 'speaking' | 'listening' | 'reading' | 'writing' | 'grammar' | 'image_description';
  userResponseText: string;
  selectedOptionId?: string;
  isOptionCorrect?: boolean;
  responseTimeMs?: number;
  hesitationDetected?: boolean;
  selfCorrectionCount?: number;
  audioPlaybackSpeedUsed?: number;
}

export interface AssessmentAiSelfValidation {
  isInformationSufficient: boolean;
  underEvaluatedSkills: string[];
  inconsistenciesDetected: boolean;
  confidenceInResultPercent: number;
  recommendedExtensionAction?: string;
}

export interface AssessmentResult {
  assignedLevel: CEFRLevelType;
  score: number;
  skillMatrix: SkillMatrix;
  confidenceScore: number;
  learningProfile: LearningProfileDiagnostic;
  initialPlan: DiagnosticInitialPlan;
  aiSelfValidation: AssessmentAiSelfValidation;
  recommendedLevel: string;
  strengths: string[];
  focusAreas: string[];
  summary: string;
}
