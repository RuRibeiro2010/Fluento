/**
 * FLUENTO PROMPT BUILDER - UNIT TESTS & VALIDATION
 * 
 * Comprehensive test suite for Prompt Builder and its context builders.
 */

import { promptBuilder } from '../prompt-builder';
import { promptCompressor } from '../prompt-compressor';
import { tokenBudgetManager } from '../token-budget-manager';
import { mockPromptBuilderInputNormal, mockPromptBuilderInputHighAnxiety } from '../fixtures';

export function runPromptBuilderTestSuite() {
  const results: { testName: string; passed: boolean; message: string }[] = [];

  function assert(condition: boolean, testName: string, message: string) {
    results.push({
      testName,
      passed: condition,
      message: condition ? 'PASSED' : `FAILED: ${message}`
    });
  }

  // -------------------------------------------------------------
  // Test 1: Context Package Assembly
  // -------------------------------------------------------------
  const pkg = promptBuilder.buildContextPackage(mockPromptBuilderInputNormal);
  assert(
    pkg.teacherSection.roleIdentity.length > 0 &&
    pkg.studentSection.currentCefrLevel.includes('B1') &&
    pkg.lessonSection.activeBlockTitle.includes('Bloco 2') &&
    pkg.conversationSection.currentTurnState === 'wait_time_2',
    'PromptBuilder - Context Package Assembly',
    'Should assemble all 6 context sections accurately from input state'
  );

  // -------------------------------------------------------------
  // Test 2: System Prompt Generation
  // -------------------------------------------------------------
  const promptResult = promptBuilder.buildPrompt(mockPromptBuilderInputNormal);
  assert(
    promptResult.systemPrompt.includes('# DIRETA DE IDENTIDADE DO PROFESSOR FLUENTO') &&
    promptResult.systemPrompt.includes('Recasting') &&
    promptResult.estimatedTokenCount > 0,
    'PromptBuilder - System Prompt Generation',
    'Should produce a complete markdown system prompt with estimated token count'
  );

  // -------------------------------------------------------------
  // Test 3: Prompt Compressor
  // -------------------------------------------------------------
  const compressedText = promptCompressor.compressContext(pkg);
  assert(
    compressedText.includes('[TEACHER]:') &&
    compressedText.includes('[STUDENT]:') &&
    compressedText.includes('[BLOCK]:') &&
    compressedText.length < promptResult.systemPrompt.length,
    'PromptCompressor - High Density Compression',
    'Compressed context summary should be significantly shorter than raw system prompt'
  );

  // -------------------------------------------------------------
  // Test 4: Token Budget Manager
  // -------------------------------------------------------------
  const estTokens = tokenBudgetManager.estimateTokenCount(promptResult.systemPrompt);
  const isWithinBudget = tokenBudgetManager.isWithinBudget(promptResult.systemPrompt, 2000);
  assert(
    estTokens > 100 && isWithinBudget === true,
    'TokenBudgetManager - Token Estimation & Budget Enforcement',
    'Should accurately estimate token counts and confirm budget compliance'
  );

  // -------------------------------------------------------------
  // Test 5: High Anxiety Safety Handling in Prompt
  // -------------------------------------------------------------
  const highAnxietyPromptResult = promptBuilder.buildPrompt(mockPromptBuilderInputHighAnxiety);
  assert(
    highAnxietyPromptResult.systemPrompt.includes('ALERTA DE ANSIEDADE') &&
    highAnxietyPromptResult.systemPrompt.includes('ELEVADA'),
    'PromptBuilder - High Anxiety Safety Rules',
    'High anxiety input MUST explicitly inject high anxiety alerts into system prompt'
  );

  // -------------------------------------------------------------
  // Test 6: Provider Compatibility
  // -------------------------------------------------------------
  const openaiResult = promptBuilder.buildPrompt({
    ...mockPromptBuilderInputNormal,
    provider: 'openai'
  });
  assert(
    openaiResult.provider === 'openai' && openaiResult.systemPrompt.length > 0,
    'PromptBuilder - Provider Support',
    'Should support switching target model provider to openai'
  );

  return results;
}
