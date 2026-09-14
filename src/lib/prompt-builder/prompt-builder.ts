/**
 * FLUENTO PROMPT BUILDER - MAIN PROMPT BUILDER
 * 
 * Central translation engine that converts internal Fluento pedagogical state
 * (from Learning Engine, Lesson Composer, Conversation Orchestrator, and Memory Threads)
 * into a structured, LLM-optimized prompt package.
 * 
 * MANDATE:
 * - Does NOT make pedagogical decisions.
 * - Does NOT alter teacher behavior rules.
 * - Purely translates and formats structured context.
 */

import {
  PromptBuilderInput,
  PromptContextPackage,
  AssembledPromptResult,
  SupportedModelProvider
} from './types';

import { teacherContextBuilder } from './teacher-context-builder';
import { studentContextBuilder } from './student-context-builder';
import { lessonContextBuilder } from './lesson-context-builder';
import { conversationContextBuilder } from './conversation-context-builder';
import { memoryContextBuilder } from './memory-context-builder';
import { safetyContextBuilder } from './safety-context-builder';
import { systemPromptBuilder } from './system-prompt-builder';
import { promptCompressor } from './prompt-compressor';
import { tokenBudgetManager } from './token-budget-manager';

export class PromptBuilder {
  /**
   * Assembles a full PromptContextPackage from the provided input state.
   */
  public buildContextPackage(input: PromptBuilderInput): PromptContextPackage {
    const { studentState, memoryThreads, lesson, activeBlockIndex, orchestratorDirective } = input;

    return {
      teacherSection: teacherContextBuilder.buildSection(lesson),
      studentSection: studentContextBuilder.buildSection(studentState),
      lessonSection: lessonContextBuilder.buildSection(lesson, activeBlockIndex),
      conversationSection: conversationContextBuilder.buildSection(orchestratorDirective),
      memorySection: memoryContextBuilder.buildSection(memoryThreads),
      safetySection: safetyContextBuilder.buildSection(studentState)
    };
  }

  /**
   * Generates an assembled LLM prompt result including system prompt, developer instructions,
   * compressed summary, and token budget estimations.
   */
  public buildPrompt(input: PromptBuilderInput): AssembledPromptResult {
    const provider: SupportedModelProvider = input.provider || 'gemini';
    const pkg = this.buildContextPackage(input);

    const systemPrompt = systemPromptBuilder.buildSystemPrompt(pkg, provider);
    const compressedContextSummary = promptCompressor.compressContext(pkg);

    const estimatedTokenCount = tokenBudgetManager.estimateTokenCount(systemPrompt);
    const budgetConfig = tokenBudgetManager.resolveBudgetConfig(input.tokenBudget);
    const withinTokenBudget = tokenBudgetManager.isWithinBudget(systemPrompt, budgetConfig.systemPromptReserveTokens);

    const developerInstructions = `[FLUENTO SYSTEM DIRECTIVE] Adhere strictly to the System Prompt guidelines. Maintain Student Talk Time > 60%, enforce Wait Times, and execute natural recasting.`;

    return {
      provider,
      systemPrompt,
      developerInstructions,
      compressedContextSummary,
      estimatedTokenCount,
      withinTokenBudget
    };
  }

  /**
   * Exposes sub-builders for direct context section generation.
   */
  public get subBuilders() {
    return {
      teacherContextBuilder,
      studentContextBuilder,
      lessonContextBuilder,
      conversationContextBuilder,
      memoryContextBuilder,
      safetyContextBuilder,
      systemPromptBuilder,
      promptCompressor,
      tokenBudgetManager
    };
  }
}

export const promptBuilder = new PromptBuilder();
