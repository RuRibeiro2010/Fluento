/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - UNIT TESTS
 * 
 * Comprehensive test suite for Sprint 11 - Adaptive Learning Planner Engine.
 */

import { adaptivePlanner } from '../adaptive-planner';
import { goalPrioritizer } from '../goal-prioritizer';
import { timePlanner } from '../time-planner';
import { difficultyPlanner } from '../difficulty-planner';
import { reviewPlanner } from '../review-planner';
import { conversationPlanner } from '../conversation-planner';
import { lessonSelector } from '../lesson-selector';
import { plannerValidator } from '../planner-validator';
import { plannerTelemetry } from '../telemetry';
import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import { learningThreadsRuntime } from '@/src/lib/learning-threads';
import { learningAnalyticsEngine } from '@/src/lib/learning-analytics';

export async function runAdaptivePlannerTestSuite() {
  const results: { testName: string; passed: boolean; message: string }[] = [];

  function assert(condition: boolean, testName: string, message: string) {
    results.push({
      testName,
      passed: condition,
      message: condition ? 'PASSED' : `FAILED: ${message}`
    });
  }

  const studentId = 'test_student_s11_unit';
  plannerTelemetry.clear();

  // Setup Digital Twin & Threads
  studentDigitalTwin.getOrCreateTwin(studentId, 'Pedro Alves', 'pedro@fluento.pt');
  studentDigitalTwin.updateTwin(studentId, {
    goal: {
      targetCefrGoal: 'B2',
      professionalDomain: 'Tecnologia / Engenharia de Software',
      primaryMotivation: 'career_advancement'
    },
    recommendation: {
      recommendedSessionDurationMinutes: 15
    }
  });

  learningThreadsRuntime.addReviewItem(studentId, 'architecture', 'vocabulary');
  learningThreadsRuntime.addReviewItem(studentId, 'deploy', 'vocabulary');

  // 1. Full Adaptive Plan Generation
  const plan = adaptivePlanner.generatePlan(studentId);

  assert(
    plan.studentId === studentId &&
    Boolean(plan.planId) &&
    plan.recommendedDurationMinutes === 15 &&
    plan.targetCefr === 'B2',
    'AdaptivePlanner - Plan Generation',
    'Should generate valid, strongly-typed AdaptiveLearningPlan for student'
  );

  // 2. Goal Prioritization
  const twin = studentDigitalTwin.getOrCreateTwin(studentId);
  const analytics = learningAnalyticsEngine.generateReport(studentId);
  const goalRes = goalPrioritizer.prioritizeGoals(twin, analytics);

  assert(
    goalRes.primaryObjective.length > 0 && goalRes.secondaryFocusAreas.length > 0,
    'GoalPrioritizer - Career Goal Prioritization',
    'Should formulate professional domain objective for career advancement driver'
  );

  // 3. Time Planner
  const duration = timePlanner.planDuration(twin, analytics);

  assert(
    duration >= 5 && duration <= 30,
    'TimePlanner - Duration Optimization',
    'Should optimize session duration within 5-30 minute boundary'
  );

  // 4. Difficulty & ZPD Planning
  const diffRes = difficultyPlanner.planDifficulty(twin, analytics);

  assert(
    ['high', 'moderate', 'minimal', 'none'].includes(diffRes.scaffoldingLevel) &&
    ['comfortable', 'optimal_challenge', 'stretch'].includes(diffRes.difficultySetting),
    'DifficultyPlanner - Scaffolding & Challenge Level',
    'Should compute scaffolding and difficulty level based on ZPD'
  );

  // 5. SRS Review Selection
  const threads = learningThreadsRuntime.getSnapshot(studentId);
  const reviews = reviewPlanner.selectReviewItems(threads);

  assert(
    reviews.length >= 1,
    'ReviewPlanner - Due Review Items',
    'Should select review items from learning threads snapshot'
  );

  // 6. Conversation Scenario Selection
  const scenario = conversationPlanner.planScenario(twin, 'B2');

  assert(
    scenario.scenarioId.length > 0 && scenario.suggestedCefr !== undefined,
    'ConversationPlanner - Domain Scenario Matching',
    'Should match scenario configuration to student professional domain or CEFR'
  );

  // 7. Lesson Mode Selection
  const lessonMode = lessonSelector.selectLessonMode(analytics);

  assert(
    ['spontaneous_roleplay', 'vocabulary_reinforcement', 'grammar_clinic', 'fluency_sprint', 'confidence_builder'].includes(lessonMode),
    'LessonSelector - Pedagogical Mode Selection',
    'Should select valid lesson mode based on analytics report'
  );

  // 8. Plan Validation
  const validation = plannerValidator.validatePlan(plan);

  assert(
    validation.isValid,
    'PlannerValidator - Plan Integrity Verification',
    'Generated plan must satisfy structural validation rules'
  );

  // 9. Telemetry Recording
  const events = plannerTelemetry.getEvents(studentId);

  assert(
    events.length >= 1 && events[0].studentId === studentId,
    'PlannerTelemetry - Event Logging',
    'Generating a plan must record telemetry events'
  );

  return results;
}
