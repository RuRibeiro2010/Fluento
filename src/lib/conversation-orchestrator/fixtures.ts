/**
 * FLUENTO CONVERSATION ORCHESTRATOR - FIXTURES
 * 
 * Mock fixtures and sample data for testing and validating the Conversation Orchestrator.
 */

import { StudentLearningState } from '@/src/lib/learning-engine';
import { ComposedLesson } from '@/src/lib/lesson-composer';

export const mockStudentStateNormal: StudentLearningState = {
  studentId: 'student_123',
  currentCefr: 'B1',
  targetCefr: 'B2',
  framework: 'CEFR',
  frameworkLevel: {
    framework: 'CEFR',
    levelCode: 'B1',
    equivalentCefr: 'B1',
    title: 'Threshold',
    description: 'Intermediate'
  },
  energyLevel: 8,
  motivationLevel: 9,
  speakingAnxietyLevel: 25,
  confidenceScores: {
    speaking: 65,
    listening: 75,
    vocabulary: 70,
    grammar: 60,
    pronunciation: 65,
    overall: 67
  },
  fatigueScore: 15,
  availableMinutes: 15,
  daysSinceLastSession: 2,
  primaryGoal: 'Job Interview Preparation'
};

export const mockStudentStateHighAnxiety: StudentLearningState = {
  studentId: 'student_456',
  currentCefr: 'A2',
  targetCefr: 'B1',
  framework: 'CEFR',
  frameworkLevel: {
    framework: 'CEFR',
    levelCode: 'A2',
    equivalentCefr: 'A2',
    title: 'Waystage',
    description: 'Elementary'
  },
  energyLevel: 5,
  motivationLevel: 7,
  speakingAnxietyLevel: 80,
  confidenceScores: {
    speaking: 35,
    listening: 50,
    vocabulary: 45,
    grammar: 40,
    pronunciation: 40,
    overall: 42
  },
  fatigueScore: 40,
  availableMinutes: 10,
  daysSinceLastSession: 5,
  primaryGoal: 'Travel Conversation'
};

export const mockComposedLesson: ComposedLesson = {
  lessonId: 'lesson_mock_001',
  studentId: 'student_123',
  blueprintId: 'bp_mock_001',
  timestampIso: new Date().toISOString(),
  totalDurationMinutes: 15,
  pedagogicalConfig: {
    scaffoldingLevel: 'medium',
    recastingMode: 'involuntary_continuous',
    tone: 'warm_supportive',
    targetStudentTalkTimeRatio: 65,
    waitTimeSeconds: 4,
    forbiddenBehaviours: ['Corrigir diretamente', 'Interromper o aluno'],
    difficulty: {
      currentCefr: 'B1',
      difficultyDelta: 'maintain',
      lexicalDensity: 65,
      sentenceComplexity: 60,
      speechRateMultiplier: 0.95,
      scaffoldingPromptRatio: 35,
      allowNativeHints: false
    }
  },
  blocks: [
    {
      blockId: 'blk_warmup',
      type: 'warmup',
      title: 'Acolhimento Humano & Conexão Afetiva',
      durationMinutes: 2,
      pedagogicalObjective: 'Desativar o filtro afetivo.',
      interactionPattern: 'guided_q_and_a',
      activities: [],
      guidelines: ['Sem correções na recepção.']
    },
    {
      blockId: 'blk_conversation',
      type: 'conversation',
      title: 'Diálogo Fluido: Job Interview Practice',
      durationMinutes: 7,
      pedagogicalObjective: 'Garantir comunicação autêntica e STT > 65%.',
      interactionPattern: 'free_dialogue',
      activities: [],
      guidelines: ['Garantir STT > 65%.', 'Aplicar recasting involuntário.']
    },
    {
      blockId: 'blk_practice',
      type: 'practice',
      title: 'Prática Dirigida & Consolidação',
      durationMinutes: 3,
      pedagogicalObjective: 'Consolidar vocabulário chave.',
      interactionPattern: 'scenario_roleplay',
      activities: [],
      guidelines: ['Oferecer dicas se houver hesitação.']
    },
    {
      blockId: 'blk_correction',
      type: 'correction',
      title: 'Modelagem Natural',
      durationMinutes: 1,
      pedagogicalObjective: 'Recasting pontual.',
      interactionPattern: 'recasting_feedback',
      activities: [],
      guidelines: ['Modelagem natural de estruturas.']
    },
    {
      blockId: 'blk_reflection',
      type: 'reflection',
      title: 'Vitória do Dia',
      durationMinutes: 1,
      pedagogicalObjective: 'Reforçar autoeficácia.',
      interactionPattern: 'metacognitive_reflection',
      activities: [],
      guidelines: ['Celebrar um progresso específico.']
    },
    {
      blockId: 'blk_closing',
      type: 'closing',
      title: 'Despedida',
      durationMinutes: 1,
      pedagogicalObjective: 'Despedida serena.',
      interactionPattern: 'closing_bridge',
      activities: [],
      guidelines: ['Ponte para o quotidiano.']
    }
  ],
  successCriteria: ['STT > 60%', 'Redução de ansiedade']
};
