/**
 * FLUENTO LEARNING ANALYTICS - REPORT BUILDER
 * 
 * Aggregates all individual metric evaluations into a strongly-typed, comprehensive
 * LearningAnalyticsReport. Generates composite evolution scores and executive summaries.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { ThreadSnapshot } from '@/src/lib/learning-threads';
import { ConfidenceMetric, IndependenceMetric, RetentionMetric, VelocityMetric, TransferMetric, AnxietyTrendMetric, ReadinessMetric, LearningROIMetric, LearningAnalyticsReport } from './types';

export class AnalyticsReportBuilder {
  public buildReport(
    twin: StudentDigitalTwinState,
    threads: ThreadSnapshot,
    metrics: {
      confidence: ConfidenceMetric;
      independence: IndependenceMetric;
      retention: RetentionMetric;
      velocity: VelocityMetric;
      transfer: TransferMetric;
      anxietyTrend: AnxietyTrendMetric;
      readiness: ReadinessMetric;
      roi: LearningROIMetric;
    }
  ): LearningAnalyticsReport {
    // Composite overall evolution score (0 - 100)
    const overallEvolutionScore = Math.round(
      metrics.confidence.score * 0.15 +
      metrics.independence.score * 0.15 +
      metrics.retention.score * 0.15 +
      metrics.transfer.score * 0.15 +
      metrics.readiness.overallReadinessScore * 0.20 +
      metrics.roi.efficiencyScore * 0.10 +
      (100 - metrics.anxietyTrend.currentAnxietyLevel) * 0.10
    );

    const executiveSummary =
      `Relatório de Evolução Pedagógica (${twin.identity.name}): Índice global de evolução de ${overallEvolutionScore}/100. ` +
      `Nível CEFR atual: ${metrics.velocity.currentCefr} (meta ${metrics.velocity.targetCefr}). ` +
      `Prontidão para o mundo real: ${metrics.readiness.readinessLevel} (${metrics.readiness.overallReadinessScore}/100). ` +
      `Grau de independência comunicativa: ${metrics.independence.score}/100 com tendência de ansiedade ${metrics.anxietyTrend.trend}.`;

    return {
      studentId: twin.identity.studentId,
      generatedAtIso: new Date().toISOString(),
      reportPeriodDays: 30,
      revision: twin.revision,
      confidence: metrics.confidence,
      independence: metrics.independence,
      retention: metrics.retention,
      velocity: metrics.velocity,
      transfer: metrics.transfer,
      anxietyTrend: metrics.anxietyTrend,
      readiness: metrics.readiness,
      roi: metrics.roi,
      overallEvolutionScore,
      executiveSummary
    };
  }
}

export const analyticsReportBuilder = new AnalyticsReportBuilder();
