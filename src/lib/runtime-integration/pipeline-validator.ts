/**
 * FLUENTO RUNTIME INTEGRATION - PIPELINE VALIDATOR
 * 
 * Enforces structural pipeline validation and prevents invalid state transitions.
 */

import { PipelineExecutionResult, SessionLifecycleState } from './types';
import { pipelineContractsManager } from './contracts';

export class PipelineValidator {
  public validatePipelineProgress(
    currentState: SessionLifecycleState,
    result: Partial<PipelineExecutionResult>
  ): { isValid: boolean; reason?: string } {
    if (!result.studentId || result.studentId.trim() === '') {
      return { isValid: false, reason: 'studentId is required' };
    }

    if (!result.sessionId || result.sessionId.trim() === '') {
      return { isValid: false, reason: 'sessionId is required' };
    }

    // Check specific state pre-conditions
    if (currentState === 'analytics_ready' && !result.twinState) {
      return { isValid: false, reason: 'Digital Twin state must be loaded before Analytics stage' };
    }

    if (currentState === 'plan_ready' && !result.analyticsReport) {
      return { isValid: false, reason: 'Analytics report must be present before Adaptive Planner stage' };
    }

    if (currentState === 'blueprint_ready' && !result.adaptivePlan) {
      return { isValid: false, reason: 'Adaptive Plan must be present before Learning Engine stage' };
    }

    if (currentState === 'lesson_composed' && !result.blueprint) {
      return { isValid: false, reason: 'Lesson Blueprint must be present before Lesson Composer stage' };
    }

    return { isValid: true };
  }
}

export const pipelineValidator = new PipelineValidator();
