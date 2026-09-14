/**
 * FLUENTO RUNTIME INTEGRATION - CONTRACTS & VALIDATORS
 * 
 * Verifies that each stage in the 12-step pipeline produces and receives
 * strongly-typed, uncorrupted contracts.
 */

import { ContractValidationResult, PipelineStage, PipelineExecutionResult } from './types';

export class PipelineContractsManager {
  public validateStageOutput(stage: PipelineStage, result: Partial<PipelineExecutionResult>): ContractValidationResult {
    const missingKeys: string[] = [];
    const issues: string[] = [];

    switch (stage) {
      case 'student_digital_twin':
        if (!result.twinState) missingKeys.push('twinState');
        else if (!result.twinState.identity.studentId) issues.push('Digital Twin state is missing studentId');
        break;

      case 'learning_analytics':
        if (!result.analyticsReport) missingKeys.push('analyticsReport');
        else if (typeof result.analyticsReport.overallEvolutionScore !== 'number') {
          issues.push('Analytics Report missing overallEvolutionScore');
        }
        break;

      case 'adaptive_planner':
        if (!result.adaptivePlan) missingKeys.push('adaptivePlan');
        else if (!result.adaptivePlan.primaryObjective) issues.push('Adaptive Plan missing primaryObjective');
        break;

      case 'learning_engine':
        if (!result.blueprint) missingKeys.push('blueprint');
        else if (!result.blueprint.blueprintId) issues.push('Lesson Blueprint missing blueprintId');
        break;

      case 'lesson_composer':
        if (!result.composedLesson) missingKeys.push('composedLesson');
        else if (!result.composedLesson.blocks || result.composedLesson.blocks.length === 0) {
          issues.push('Composed Lesson has no pedagogical blocks');
        }
        break;

      case 'conversation_orchestrator':
        if (!result.orchestratorDirective) missingKeys.push('orchestratorDirective');
        else if (!result.orchestratorDirective.nextSpeaker) issues.push('Orchestrator Directive missing nextSpeaker');
        break;

      case 'teacher_runtime':
        if (!result.teacherDirectives) missingKeys.push('teacherDirectives');
        else if (!result.teacherDirectives.profile) issues.push('Teacher Directives missing profile');
        break;

      case 'prompt_builder':
        if (!result.assembledPrompt) missingKeys.push('assembledPrompt');
        else if (!result.assembledPrompt.systemPrompt) issues.push('Assembled Prompt missing systemPrompt');
        break;

      case 'ai_runtime':
        if (!result.aiResponse) missingKeys.push('aiResponse');
        else if (!result.aiResponse.content) issues.push('AI Response missing content');
        break;

      case 'session_runtime':
        if (!result.sessionSnapshot) missingKeys.push('sessionSnapshot');
        else if (!result.sessionSnapshot.sessionId) issues.push('Session Snapshot missing sessionId');
        break;

      case 'learning_threads':
        if (!result.threadsSnapshot) missingKeys.push('threadsSnapshot');
        else if (!result.threadsSnapshot.studentId) issues.push('Threads Snapshot missing studentId');
        break;

      case 'twin_synchronization':
        if (!result.syncedTwinState) missingKeys.push('syncedTwinState');
        else if (!result.syncedTwinState.identity.studentId) issues.push('Synced Digital Twin missing studentId');
        break;

      default:
        break;
    }

    return {
      isValid: missingKeys.length === 0 && issues.length === 0,
      stage,
      missingKeys,
      issues
    };
  }
}

export const pipelineContractsManager = new PipelineContractsManager();
