/**
 * FLUENTO RUNTIME INTEGRATION - FIXTURES
 * 
 * Mock fixtures and sample data structures for testing the Runtime Integration module.
 */

import { PipelineExecutionOptions, PipelineExecutionResult } from './types';

export const mockPipelineOptions: PipelineExecutionOptions = {
  studentId: 'student_test_101',
  sessionId: 'sess_test_101',
  userUtterance: 'Olá! Gostaria de praticar uma conversa sobre apresentações de trabalho.'
};

export const mockAiFailureOptions: PipelineExecutionOptions = {
  studentId: 'student_test_101',
  sessionId: 'sess_test_ai_fail_102',
  simulateAiFailure: true
};
