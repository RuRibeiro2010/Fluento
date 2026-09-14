/**
 * FLUENTO LEARNING THREADS - FIXTURES
 * 
 * Mock thread snapshots and sample data for unit tests and demonstration.
 */

import { ThreadSnapshot } from './types';

export const mockThreadSnapshotNormal: ThreadSnapshot = {
  studentId: 'test_student_s9',
  lastConsolidatedIso: new Date().toISOString(),
  successes: [
    {
      id: 'succ_101',
      studentId: 'test_student_s9',
      timestampIso: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Apresentação de Projeto Concluída',
      description: 'Conseguiu apresentar o projeto técnico durante 5 minutos sem travar.',
      cefrLevel: 'B1',
      skillCategory: 'speaking',
      confidenceBoostScore: 15,
      permanenceLevel: 'permanent',
      occurrenceCount: 2
    }
  ],
  difficulties: [
    {
      id: 'diff_202',
      studentId: 'test_student_s9',
      firstObservedIso: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastObservedIso: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Uso Incorreto de Phrasal Verbs',
      description: 'Dificuldade recorrente com phrasal verbs como look forward to e carry out.',
      cefrLevel: 'A2',
      severity: 'moderate_friction',
      occurrenceCount: 3,
      isResolved: false,
      l1InterferenceTag: 'pt_translation_literal'
    }
  ],
  reviewItems: [
    {
      id: 'srs_303',
      studentId: 'test_student_s9',
      createdIso: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      conceptOrWord: 'accomplish',
      category: 'vocabulary',
      cefrLevel: 'B1',
      stability: 2,
      difficulty: 4,
      lastReviewedIso: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      nextReviewIso: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      decayScore: 65,
      consecutiveSuccesses: 1
    }
  ],
  ephemeralNotes: [
    {
      id: 'eph_404',
      studentId: 'test_student_s9',
      sessionId: 'sess_999',
      timestampIso: new Date().toISOString(),
      content: 'Aluno demonstrou grande avanço na pronúncia das vogais longas.',
      categoryTag: 'pronunciation'
    }
  ],
  totalPromotionsCount: 1,
  revision: 1
};
