/**
 * FLUENTO LEARNING ANALYTICS - UNIT TESTS
 * 
 * Comprehensive unit test suite for Sprint 10 - Learning Analytics Engine.
 */

import { learningAnalyticsEngine } from '../learning-analytics';
import { confidenceAnalyzer } from '../confidence-analyzer';
import { independenceAnalyzer } from '../independence-analyzer';
import { retentionAnalyzer } from '../retention-analyzer';
import { velocityAnalyzer } from '../velocity-analyzer';
import { transferAnalyzer } from '../transfer-analyzer';
import { anxietyAnalyzer } from '../anxiety-analyzer';
import { readinessAnalyzer } from '../readiness-analyzer';
import { roiAnalyzer } from '../roi-analyzer';
import { analyticsTelemetry } from '../telemetry';
import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import { learningThreadsRuntime } from '@/src/lib/learning-threads';

export async function runLearningAnalyticsTestSuite() {
  const results: { testName: string; passed: boolean; message: string }[] = [];

  function assert(condition: boolean, testName: string, message: string) {
    results.push({
      testName,
      passed: condition,
      message: condition ? 'PASSED' : `FAILED: ${message}`
    });
  }

  const studentId = 'test_student_s10_unit';
  analyticsTelemetry.clear();

  // Setup initial twin and thread data
  studentDigitalTwin.getOrCreateTwin(studentId, 'Maria Santos', 'maria@fluento.pt');
  learningThreadsRuntime.addSuccessMemory(studentId, 'Apresentação em Reunião', 'Apresentou a reunião com clareza');
  learningThreadsRuntime.addReviewItem(studentId, 'collaborate', 'vocabulary');

  // 1. Full Analytics Report Generation
  const report = learningAnalyticsEngine.generateReport(studentId);

  assert(
    report.studentId === studentId &&
    report.overallEvolutionScore >= 0 &&
    report.overallEvolutionScore <= 100,
    'LearningAnalyticsEngine - Report Generation',
    'Should generate complete LearningAnalyticsReport with valid overall score bounds'
  );

  // 2. Confidence Analysis
  const twin = studentDigitalTwin.getOrCreateTwin(studentId);
  const threads = learningThreadsRuntime.getSnapshot(studentId);
  const confidenceRes = confidenceAnalyzer.analyzeConfidence(twin, threads);

  assert(
    confidenceRes.score >= 0 &&
    confidenceRes.score <= 100 &&
    ['improving', 'stable', 'declining'].includes(confidenceRes.trend),
    'ConfidenceAnalyzer - Score & Trend Computation',
    'Should calculate weighted domain confidence and trend'
  );

  // 3. Independence Analysis
  const independenceRes = independenceAnalyzer.analyzeIndependence(twin);

  assert(
    independenceRes.score >= 0 &&
    independenceRes.score <= 100 &&
    ['none', 'minimal', 'moderate', 'heavy'].includes(independenceRes.scaffoldDependencyLevel),
    'IndependenceAnalyzer - Scaffold Dependency Evaluation',
    'Should calculate unassisted turn ratio and scaffold dependency'
  );

  // 4. Retention Analysis
  const retentionRes = retentionAnalyzer.analyzeRetention(threads);

  assert(
    retentionRes.score >= 0 &&
    retentionRes.score <= 100 &&
    retentionRes.srsItemCount >= 1,
    'RetentionAnalyzer - Active Recall & SRS Health',
    'Should compute active recall rate and decay resilience from thread SRS items'
  );

  // 5. Velocity & CEFR Progression Analysis
  const velocityRes = velocityAnalyzer.analyzeVelocity(twin, threads);

  assert(
    velocityRes.currentCefr === 'A2' &&
    velocityRes.masteryRatePerWeek >= 0 &&
    ['accelerated', 'steady', 'sluggish', 'stalled'].includes(velocityRes.velocityRating),
    'VelocityAnalyzer - CEFR Mastery Rate',
    'Should evaluate mastery rate per week and CEFR velocity rating'
  );

  // 6. Transfer Analysis
  const transferRes = transferAnalyzer.analyzeTransfer(twin, threads);

  assert(
    transferRes.score >= 0 &&
    transferRes.score <= 100 &&
    transferRes.spontaneousUsageCount >= 0,
    'TransferAnalyzer - Pragmatic Spontaneity',
    'Should measure spontaneous usage and L1 interference reduction rate'
  );

  // 7. Anxiety Trajectory Analysis
  const anxietyRes = anxietyAnalyzer.analyzeAnxietyTrend(twin);

  assert(
    anxietyRes.currentAnxietyLevel >= 0 &&
    ['optimal', 'moderate', 'panic'].includes(anxietyRes.affectiveFilterStatus),
    'AnxietyAnalyzer - Affective Filter Trajectory',
    'Should calculate anxiety delta and affective filter status'
  );

  // 8. Real World Readiness Analysis
  const readinessRes = readinessAnalyzer.analyzeReadiness(twin, threads);

  assert(
    readinessRes.overallReadinessScore >= 0 &&
    ['emerging', 'functional', 'proficient', 'autonomous'].includes(readinessRes.readinessLevel),
    'ReadinessAnalyzer - Real World Readiness Level',
    'Should compute professional, social, and spontaneity readiness levels'
  );

  // 9. Learning ROI Analysis
  const roiRes = roiAnalyzer.analyzeROI(twin, threads);

  assert(
    roiRes.progressPointsPerHoursSpent >= 0 &&
    ['exceptional', 'high', 'moderate', 'suboptimal'].includes(roiRes.roiRating),
    'ROIAnalyzer - Pedagogy Return on Investment',
    'Should measure progress points per active practice hour spent'
  );

  // 10. Telemetry Event Recording
  const telemetryEvents = analyticsTelemetry.getEvents(studentId);

  assert(
    telemetryEvents.length >= 1 && telemetryEvents[0].studentId === studentId,
    'AnalyticsTelemetry - Event Storage',
    'Generating analytics report must record telemetry events'
  );

  return results;
}
