/**
 * FLUENTO PROMPT BUILDER - TYPES & INTERFACES
 * 
 * Defines the data structures for translating Fluento's internal pedagogical decisions,
 * lesson structures, conversation orchestration directives, and memory threads into
 * structured, LLM-agnostic system and conversation prompts.
 */

import { StudentLearningState, MemoryThreadsContext } from '@/src/lib/learning-engine';
import { ComposedLesson, LessonBlock } from '@/src/lib/lesson-composer';
import { OrchestratorActionDirective, TurnEvent } from '@/src/lib/conversation-orchestrator';

export type SupportedModelProvider = 'gemini' | 'openai' | 'anthropic' | 'generic';

export interface TokenBudgetConfig {
  maxTotalTokens: number; // e.g. 4096 or 8192
  systemPromptReserveTokens: number; // e.g. 1500
  historyReserveTokens: number; // e.g. 2000
  responseReserveTokens: number; // e.g. 500
}

export interface TeacherContextSection {
  roleIdentity: string;
  corePedagogicalRules: string[];
  toneAndEmpathyGuidelines: string;
  forbiddenBehaviours: string[];
}

export interface StudentContextSection {
  studentProfileSummary: string;
  currentCefrLevel: string;
  emotionalStateAndAnxiety: string;
  primaryGoalsAndInterests: string[];
}

export interface LessonContextSection {
  activeBlockTitle: string;
  activeBlockObjective: string;
  interactionPattern: string;
  scaffoldingLevel: string;
  targetStudentTalkTimeRatio: string;
}

export interface ConversationContextSection {
  currentTurnState: string;
  nextSpeaker: string;
  waitTimeInstruction: string;
  recastingDirectiveText: string;
  speakingRatioStatus: string;
}

export interface MemoryContextSection {
  permanentSuccesses: string[];
  permanentTraumasAndBlocks: string[];
  scheduledReviewItemsText: string[];
}

export interface SafetyContextSection {
  affectiveFilterProtectionRules: string[];
  emergencyDeescalationProtocol: string;
  ethicalPrivacyGuidelines: string[];
}

export interface PromptContextPackage {
  teacherSection: TeacherContextSection;
  studentSection: StudentContextSection;
  lessonSection: LessonContextSection;
  conversationSection: ConversationContextSection;
  memorySection: MemoryContextSection;
  safetySection: SafetyContextSection;
}

export interface AssembledPromptResult {
  provider: SupportedModelProvider;
  systemPrompt: string;
  developerInstructions: string;
  compressedContextSummary: string;
  estimatedTokenCount: number;
  withinTokenBudget: boolean;
}

export interface PromptBuilderInput {
  studentState: StudentLearningState;
  memoryThreads: MemoryThreadsContext;
  lesson: ComposedLesson;
  activeBlockIndex: number;
  orchestratorDirective: OrchestratorActionDirective;
  recentTurnEvents?: TurnEvent[];
  provider?: SupportedModelProvider;
  tokenBudget?: Partial<TokenBudgetConfig>;
}
