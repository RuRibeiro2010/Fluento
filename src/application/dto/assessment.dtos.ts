import { SkillMatrix, LearningProfileDiagnostic, DiagnosticInitialPlan } from '../../../types/profile';
import { AssessmentTurnResponse, AssessmentResult } from '../../domain/assessment/types';

export interface AssessmentTurnResponseDTO extends AssessmentTurnResponse {}

export interface AssessmentResultDTO extends Omit<AssessmentResult, 'aiSelfValidation' | 'recommendedLevel'> {}
