/**
 * FLUENTO LEARNING ENGINE - MAIN FAÇADE
 * 
 * Central orchestrator for Fluento's learning engine. Unifies pre-session diagnosis,
 * decision pipeline evaluation, blueprint generation, real-time flow telemetry,
 * and post-session Learning ROI analysis.
 */

import {
  StudentLearningState,
  DecisionContext,
  PedagogicalDecision,
  LessonBlueprint,
  FlowMetrics,
  LearningRoiMetrics,
  ReviewItem
} from './types';

import { decisionPipeline } from './decision-pipeline';
import { strategySelector } from './strategy-selector';
import { difficultyEngine } from './difficulty-engine';
import { reviewEngine } from './review-engine';
import { flowEngine } from './flow-engine';
import { learningRoiEngine } from './learning-roi';
import { lessonBlueprintGenerator } from './lesson-blueprint';

export class LearningEngine {
  /**
   * Runs the complete pre-session diagnosis and returns a PedagogicalDecision and LessonBlueprint.
   */
  public prepareSession(context: DecisionContext): {
    decision: PedagogicalDecision;
    blueprint: LessonBlueprint;
  } {
    // 1. Run Decision Pipeline
    const decision = decisionPipeline.evaluate(context);

    // 2. Generate Executable Lesson Blueprint
    const blueprint = lessonBlueprintGenerator.generateBlueprint(decision, context.studentState);

    return {
      decision,
      blueprint
    };
  }

  /**
   * Evaluates real-time Flow State and Cognitive Load during an active session.
   */
  public monitorFlowState(
    studentState: StudentLearningState,
    recentAccuracyPercent: number = 75,
    recentHesitationCount: number = 2
  ): FlowMetrics {
    return flowEngine.evaluateFlowState(studentState, recentAccuracyPercent, recentHesitationCount);
  }

  /**
   * Evaluates real Learning ROI at the conclusion of a session.
   */
  public evaluateSessionRoi(
    initialState: StudentLearningState,
    finalState: StudentLearningState,
    flowMetrics: FlowMetrics,
    studentTalkTimeRatio: number = 65
  ): LearningRoiMetrics {
    return learningRoiEngine.evaluateLearningRoi(initialState, finalState, flowMetrics, studentTalkTimeRatio);
  }

  /**
   * Updates review item stability after student practice.
   */
  public processReviewResult(item: ReviewItem, wasSuccessful: boolean): ReviewItem {
    return reviewEngine.updateItemAfterReview(item, wasSuccessful);
  }

  /**
   * Exposes individual sub-engines for specialized queries.
   */
  public get subEngines() {
    return {
      decisionPipeline,
      strategySelector,
      difficultyEngine,
      reviewEngine,
      flowEngine,
      learningRoiEngine,
      lessonBlueprintGenerator
    };
  }
}

export const learningEngine = new LearningEngine();
