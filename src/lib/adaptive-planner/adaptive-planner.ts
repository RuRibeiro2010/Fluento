/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - MAIN FACADE
 * 
 * Central coordinator for automatic session planning.
 * Interacts with Student Digital Twin, Learning Threads Runtime, and
 * Learning Analytics Engine via public interfaces.
 * 
 * STRICT MANDATES:
 * - NO user text or LLM prompt template generation.
 * - NO direct AI provider or UI dependencies.
 * - Strongly-typed AdaptiveLearningPlan outputs.
 */

import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import { learningThreadsRuntime } from '@/src/lib/learning-threads';
import { learningAnalyticsEngine } from '@/src/lib/learning-analytics';
import { AdaptiveLearningPlan } from './types';
import { sessionPlanner } from './session-planner';
import { plannerTelemetry } from './telemetry';

export class AdaptivePlanner {
  /**
   * Generates a fully adaptive session plan for the given student.
   */
  public generatePlan(studentId: string): AdaptiveLearningPlan {
    // 1. Fetch public states
    const twin = studentDigitalTwin.getOrCreateTwin(studentId);
    const threads = learningThreadsRuntime.getSnapshot(studentId);

    // 2. Fetch objective analytics report
    const analytics = learningAnalyticsEngine.generateReport(studentId);

    // 3. Plan session
    const plan = sessionPlanner.planSession(twin, threads, analytics);

    // 4. Record telemetry
    plannerTelemetry.recordPlanGenerated({
      eventId: `plan_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      timestampIso: plan.generatedAtIso,
      planId: plan.planId,
      recommendedDurationMinutes: plan.recommendedDurationMinutes,
      lessonMode: plan.lessonMode,
      difficultySetting: plan.difficultySetting
    });

    return plan;
  }
}

export const adaptivePlanner = new AdaptivePlanner();
