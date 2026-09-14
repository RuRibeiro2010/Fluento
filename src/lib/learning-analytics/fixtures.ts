/**
 * FLUENTO LEARNING ANALYTICS - FIXTURES
 * 
 * Mock report fixtures and sample analytics data for testing.
 */

import { LearningAnalyticsReport } from './types';

export const mockLearningAnalyticsReport: LearningAnalyticsReport = {
  studentId: 'test_student_s10',
  generatedAtIso: new Date().toISOString(),
  reportPeriodDays: 30,
  revision: 1,
  confidence: {
    score: 78,
    speakingConfidence: 75,
    listeningConfidence: 80,
    grammarConfidence: 70,
    pronunciationConfidence: 75,
    trend: 'improving',
    evaluationNote: 'Confiança comunicativa em ascensão.'
  },
  independence: {
    score: 82,
    unassistedTurnRatio: 0.75,
    scaffoldDependencyLevel: 'minimal',
    avgResponseDelaySeconds: 3.2,
    evaluationNote: 'Alta independência de expressão.'
  },
  retention: {
    score: 85,
    activeRecallSuccessRate: 0.88,
    decayResilienceScore: 82,
    srsItemCount: 15,
    dueReviewItemsCount: 2,
    evaluationNote: 'Excelente retenção ativa de vocabulário.'
  },
  velocity: {
    currentCefr: 'B1',
    targetCefr: 'B2',
    masteryRatePerWeek: 3.5,
    estimatedWeeksToTargetCefr: 5,
    velocityRating: 'steady',
    evaluationNote: 'Ritmo constante de domínio de conceitos.'
  },
  transfer: {
    score: 76,
    spontaneousUsageCount: 8,
    l1InterferenceReductionRate: 0.65,
    contextAdaptabilityScore: 78,
    evaluationNote: 'Boa transferência de vocabulário para discurso livre.'
  },
  anxietyTrend: {
    currentAnxietyLevel: 25,
    baselineAnxietyLevel: 45,
    anxietyDelta: -20,
    trend: 'significantly_decreased',
    affectiveFilterStatus: 'optimal',
    evaluationNote: 'Filtro afetivo em nível ideal para aprendizagem.'
  },
  readiness: {
    overallReadinessScore: 80,
    professionalReadinessScore: 82,
    travelSocialReadinessScore: 85,
    spontaneityScore: 75,
    readinessLevel: 'proficient',
    evaluationNote: 'Pronto para interações profissionais e sociais.'
  },
  roi: {
    progressPointsPerHoursSpent: 6.2,
    efficiencyScore: 80,
    totalHoursSpent: 3.5,
    masteredConceptsTotal: 22,
    roiRating: 'high',
    evaluationNote: 'Retorno sobre tempo praticado muito elevado.'
  },
  overallEvolutionScore: 81,
  executiveSummary: 'Aluno apresenta evolução consistente em todas as métricas observáveis.'
};
