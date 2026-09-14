/**
 * FLUENTO TEACHER RUNTIME - FIXTURES
 * 
 * Mock fixtures and sample data for Teacher Runtime testing and validation.
 */

import { TeacherEvaluationInput, TeacherDirectives } from './types';
import { mockStudentStateNormal } from '@/src/lib/conversation-orchestrator/fixtures';

export const mockTeacherEvaluationInputNormal: TeacherEvaluationInput = {
  studentState: mockStudentStateNormal,
  affectiveFilterState: 'optimal',
  studentAnxietyLevel: 25,
  currentBlockType: 'guided_practice',
  recentErrorDetected: false
};

export const mockTeacherEvaluationInputHighAnxiety: TeacherEvaluationInput = {
  studentState: {
    ...mockStudentStateNormal,
    speakingAnxietyLevel: 80
  },
  affectiveFilterState: 'panic',
  studentAnxietyLevel: 85,
  currentBlockType: 'guided_practice',
  recentErrorDetected: true
};

export const mockSampleTeacherDirectives: TeacherDirectives = {
  profile: {
    teacherId: 'teacher_sofia_pt_en',
    name: 'Sofia',
    roleTitle: 'Fluento English & Fluency Coach',
    nativeLanguage: 'pt-PT',
    targetLanguage: 'en-US',
    corePhilosophy: 'Proporcionar um ambiente seguro, encorajador e de baixa ansiedade onde o erro é uma oportunidade de aprendizagem natural.',
    avatarPersonaSummary: 'Sofia é uma professora calorosa, empática, paciente e altamente comunicativa.'
  },
  personality: {
    empathyScore: 90,
    enthusiasmScore: 80,
    patienceScore: 95,
    formalityScore: 15,
    humorFrequency: 'subtle_light'
  },
  tone: {
    primaryTone: 'warm_supportive',
    warmthIndex: 85,
    energyLevel: 75,
    toneGuidanceNote: 'Tom caloroso, encorajador e amigável.'
  },
  language: {
    targetLanguageRatio: 80,
    portugueseScaffoldingLevel: 'moderate',
    vocabularyComplexity: 'A2_accessible',
    maxWordsPerSentence: 12,
    allowPortugueseClarification: true
  },
  presence: {
    conversationalRole: 'balanced',
    validationPrefixRequired: true,
    activeListeningMarkers: ['I see!', 'Great attempt!'],
    speechPace: 'natural_conversational'
  },
  empathy: {
    affectiveFilterAction: 'encourage',
    warmthBoost: false,
    validationFocus: 'Focar no esforço comunicativo.'
  },
  feedback: {
    correctionStyle: 'implicit_recast',
    maxCorrectionsPerTurn: 1,
    praiseType: 'effort_focused'
  },
  responseStyle: {
    maxSentenceCount: 2,
    targetWordCountLimit: 30,
    endingPattern: 'open_question',
    preventMonologue: true
  },
  guardrails: {
    forbiddenBehaviors: ['NUNCA emitir tom robótico.'],
    mandatoryRules: ['Sempre validar o esforço.'],
    safetyOverride: false
  },
  generatedTimestampIso: new Date().toISOString()
};
