/**
 * FLUENTO PROMPT BUILDER - FIXTURES
 * 
 * Mock fixtures and sample input data for testing and validating the Prompt Builder.
 */

import { PromptBuilderInput } from './types';
import { mockStudentStateNormal, mockStudentStateHighAnxiety, mockComposedLesson } from '@/src/lib/conversation-orchestrator/fixtures';
import { MemoryThreadsContext } from '@/src/lib/learning-engine';
import { OrchestratorActionDirective } from '@/src/lib/conversation-orchestrator';

export const mockMemoryThreads: MemoryThreadsContext = {
  permanentSuccessMemories: ['Excelente pronúncia da consoante "th"', 'Vocabulário de negócios B1 consolidado'],
  permanentTraumaOrBlocks: ['Evitar perguntar diretamente sobre falar em público antes de aquecer'],
  intermediateDecayingItemsCount: 1,
  intermediateReviewItems: [
    {
      id: 'srs_001',
      conceptOrWord: 'Past Continuous tense',
      category: 'grammar_structure',
      cefrLevel: 'B1',
      stability: 3,
      difficulty: 2.5,
      lastReviewedIso: new Date().toISOString(),
      nextReviewIso: new Date().toISOString(),
      decayScore: 40,
      consecutiveSuccesses: 2
    }
  ],
  ephemeralSessionNotes: ['Demonstrou bom ritmo no último bloco']
};

export const mockOrchestratorDirective: OrchestratorActionDirective = {
  actionId: 'action_test_001',
  timestampIso: new Date().toISOString(),
  currentTurnState: 'wait_time_2',
  nextSpeaker: 'teacher',
  allowTeacherSpeech: true,
  waitTimeRemainingSeconds: 0,
  recastingDirective: {
    shouldCorrect: true,
    recastingMode: 'involuntary_continuous',
    correctionType: 'involuntary_echo',
    originalPhrase: 'I goes to office yesterday',
    targetFocus: 'grammar',
    rationale: 'Reformular naturalmente com "went to the office" na resposta do professor.'
  },
  speakingRatio: {
    totalSessionSeconds: 300,
    studentTalkSeconds: 210,
    teacherTalkSeconds: 90,
    silenceSeconds: 30,
    studentTalkTimeRatio: 70.0,
    teacherTalkTimeRatio: 30.0,
    targetStudentRatio: 65,
    isCompliant: true,
    recommendation: 'maintain_equilibrium'
  },
  pacing: {
    currentBlockIndex: 1,
    currentBlock: mockComposedLesson.blocks[1],
    elapsedBlockSeconds: 180,
    allocatedBlockSeconds: 420,
    isBlockOverdue: false,
    recommendedPacingAction: 'maintain_cadence'
  },
  emotionalSignal: {
    anxietyLevel: 25,
    fatigueScore: 15,
    confidenceScore: 67,
    affectiveFilterState: 'optimal',
    recommendedTone: 'warm_supportive',
    recommendedWaitTimeDeltaSeconds: 0
  },
  guidelinesForNextTurn: [
    'Manter foco na prática de entrevista.',
    'Aplicar recasting natural de "went to the office".'
  ]
};

export const mockPromptBuilderInputNormal: PromptBuilderInput = {
  studentState: mockStudentStateNormal,
  memoryThreads: mockMemoryThreads,
  lesson: mockComposedLesson,
  activeBlockIndex: 1,
  orchestratorDirective: mockOrchestratorDirective,
  provider: 'gemini'
};

export const mockPromptBuilderInputHighAnxiety: PromptBuilderInput = {
  studentState: mockStudentStateHighAnxiety,
  memoryThreads: mockMemoryThreads,
  lesson: mockComposedLesson,
  activeBlockIndex: 1,
  orchestratorDirective: {
    ...mockOrchestratorDirective,
    emotionalSignal: {
      anxietyLevel: 80,
      fatigueScore: 40,
      confidenceScore: 35,
      affectiveFilterState: 'panic',
      recommendedTone: 'gentle_recovery',
      recommendedWaitTimeDeltaSeconds: 3
    },
    recastingDirective: {
      shouldCorrect: false,
      recastingMode: 'involuntary_continuous',
      correctionType: 'suppress',
      rationale: 'Ansiedade elevada: correções suprimidas'
    }
  },
  provider: 'gemini'
};
