import { assessmentRulesService } from '../../../domain/assessment/services/assessment-rules.service';
import { deterministicAssessmentService } from '../deterministic-assessment.service';
import { RuntimeAssessmentAiAdapter } from '../runtime-assessment-ai.adapter';
import { AssessmentTurnResponse } from '../../../domain/assessment/types';

/**
 * ASSESSMENT MIGRATION TEST (Micro-Sprint 6B.3)
 * 
 * Verifies that deterministic assessment logic was successfully extracted
 * from legacy AI module and that behaviors are preserved.
 */
async function runTests() {
  const log = (msg: string) => console.log(`[ASSESSMENT-MIGRATION-TEST] ${msg}`);
  
  try {
    log('1. Testing assessmentRulesService.calculateConfidenceScore (Deterministic)...');
    const turns: AssessmentTurnResponse[] = [
      { turnId: '1', turnType: 'speaking', userResponseText: 'Hello world', responseTimeMs: 2000 },
      { turnId: '2', turnType: 'listening', userResponseText: 'Yes', responseTimeMs: 10000, hesitationDetected: true }
    ];
    // Baseline: 75 + (responseTime < 3000 ? +3) + (wordCount >= 8 ? +4 : wordCount <= 2 ? -3) = 75 + 3 - 3 = 75
    // Turn 2: 75 + (responseTime > 9000 ? -2) + (wordCount <= 2 ? -3) + (hesitation ? -2) = 75 - 2 - 3 - 2 = 68
    const confidence = assessmentRulesService.calculateConfidenceScore(turns);
    if (confidence !== 68) throw new Error(`Unexpected confidence score: ${confidence}`);

    log('2. Testing assessmentRulesService.calculateNextAdaptiveDifficulty (Deterministic)...');
    const lastTurn: AssessmentTurnResponse = { 
      turnId: '3', 
      turnType: 'reading', 
      userResponseText: 'This is a very long response that should definitely have more than ten words in it.', 
      isOptionCorrect: true 
    };
    // 0.5 + 0.12 (correct) + 0.08 (10+ words) = 0.7
    const nextDiff = assessmentRulesService.calculateNextAdaptiveDifficulty(0.5, lastTurn);
    if (nextDiff !== 0.7) throw new Error(`Unexpected difficulty: ${nextDiff}`);

    log('3. Testing deterministicAssessmentService.evaluateUserLevelMultimodal...');
    const result = deterministicAssessmentService.evaluateUserLevelMultimodal(turns);
    if (result.assignedLevel !== 'B1') throw new Error(`Unexpected assigned level: ${result.assignedLevel}`);
    if (result.score < 50) throw new Error(`Unexpected low score: ${result.score}`);

    log('4. Verifying RuntimeAssessmentAiAdapter uses Domain Service...');
    const mockAiRuntime: any = { execute: () => Promise.resolve({ content: JSON.stringify({ assignedLevel: 'B1', skillMatrix: {} }) }) };
    const runtimeAdapter = new RuntimeAssessmentAiAdapter(mockAiRuntime);
    const diffFromRuntime = runtimeAdapter.calculateNextAdaptiveDifficulty(0.5, lastTurn);
    if (diffFromRuntime !== 0.7) throw new Error('Runtime adapter did not return correct deterministic difficulty');

    log('ALL ASSESSMENT MIGRATION TESTS PASSED!');
  } catch (error: any) {
    console.error(`[ASSESSMENT-MIGRATION-TEST] TEST FAILED: ${error.message}`);
    process.exit(1);
  }
}

runTests();
