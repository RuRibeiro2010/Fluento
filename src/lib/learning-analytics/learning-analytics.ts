/**
 * FLUENTO LEARNING ANALYTICS ENGINE - MAIN FACADE
 * 
 * Central coordinator for objective student evolution measurement.
 * Integrates all 8 specialized analytical analyzers:
 * 1. ConfidenceAnalyzer
 * 2. IndependenceAnalyzer
 * 3. RetentionAnalyzer
 * 4. VelocityAnalyzer
 * 5. TransferAnalyzer
 * 6. AnxietyAnalyzer
 * 7. ReadinessAnalyzer
 * 8. ROIAnalyzer
 * 
 * Interacts with Student Digital Twin and Learning Threads Runtime via public APIs.
 * STRICT MANDATES:
 * - NO vanity metrics (streaks/minutes) as primary indicators.
 * - NO prompt generation or AI model coupling.
 * - NO direct UI coupling.
 */

import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import { learningThreadsRuntime } from '@/src/lib/learning-threads';
import { LearningAnalyticsReport } from './types';

import { confidenceAnalyzer } from './confidence-analyzer';
import { independenceAnalyzer } from './independence-analyzer';
import { retentionAnalyzer } from './retention-analyzer';
import { velocityAnalyzer } from './velocity-analyzer';
import { transferAnalyzer } from './transfer-analyzer';
import { anxietyAnalyzer } from './anxiety-analyzer';
import { readinessAnalyzer } from './readiness-analyzer';
import { roiAnalyzer } from './roi-analyzer';
import { analyticsReportBuilder } from './analytics-report';
import { analyticsTelemetry } from './telemetry';

export class LearningAnalyticsEngine {
  /**
   * Evaluates complete objective learning analytics and produces a LearningAnalyticsReport.
   */
  public generateReport(studentId: string): LearningAnalyticsReport {
    // 1. Fetch data from Student Digital Twin and Learning Threads Runtime
    const twin = studentDigitalTwin.getOrCreateTwin(studentId);
    const threads = learningThreadsRuntime.getSnapshot(studentId);

    // 2. Compute individual analytical dimensions
    const confidence = confidenceAnalyzer.analyzeConfidence(twin, threads);
    const independence = independenceAnalyzer.analyzeIndependence(twin);
    const retention = retentionAnalyzer.analyzeRetention(threads);
    const velocity = velocityAnalyzer.analyzeVelocity(twin, threads);
    const transfer = transferAnalyzer.analyzeTransfer(twin, threads);
    const anxietyTrend = anxietyAnalyzer.analyzeAnxietyTrend(twin);
    const readiness = readinessAnalyzer.analyzeReadiness(twin, threads);
    const roi = roiAnalyzer.analyzeROI(twin, threads);

    // 3. Build composite report
    const report = analyticsReportBuilder.buildReport(twin, threads, {
      confidence,
      independence,
      retention,
      velocity,
      transfer,
      anxietyTrend,
      readiness,
      roi
    });

    // 4. Record telemetry event
    analyticsTelemetry.recordReportGenerated({
      eventId: `rep_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      timestampIso: report.generatedAtIso,
      overallScore: report.overallEvolutionScore,
      keyObservation: report.executiveSummary
    });

    return report;
  }
}

export const learningAnalyticsEngine = new LearningAnalyticsEngine();
