/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - SESSION PLANNER ORCHESTRATOR
 * 
 * Orchestrates sub-planners to assemble a complete, strongly-typed AdaptiveLearningPlan.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { ThreadSnapshot } from '@/src/lib/learning-threads';
import { LearningAnalyticsReport } from '@/src/lib/learning-analytics';
import { AdaptiveLearningPlan } from './types';

import { goalPrioritizer } from './goal-prioritizer';
import { timePlanner } from './time-planner';
import { difficultyPlanner } from './difficulty-planner';
import { reviewPlanner } from './review-planner';
import { conversationPlanner } from './conversation-planner';
import { lessonSelector } from './lesson-selector';
import { motivationPlanner } from './motivation-planner';
import { recommendationEngine } from './recommendation-engine';
import { plannerValidator } from './planner-validator';

export class SessionPlanner {
  public planSession(
    twin: StudentDigitalTwinState,
    threads: ThreadSnapshot,
    analytics?: LearningAnalyticsReport
  ): AdaptiveLearningPlan {
    // 1. Goal prioritization
    const goalsRes = goalPrioritizer.prioritizeGoals(twin, analytics);

    // 2. Duration planning
    const duration = timePlanner.planDuration(twin, analytics);

    // 3. Difficulty and scaffolding planning
    const diffRes = difficultyPlanner.planDifficulty(twin, analytics);

    // 4. SRS reviews selection
    const reviews = reviewPlanner.selectReviewItems(threads);

    // 5. Conversation scenario planning
    const scenario = conversationPlanner.planScenario(twin, twin.goal.targetCefrGoal);

    // 6. Lesson mode selection
    const lessonMode = lessonSelector.selectLessonMode(analytics);

    // 7. Motivation strategy planning
    const motivation = motivationPlanner.planMotivation(twin, analytics);

    // 8. Recommendations generation
    const recommendations = recommendationEngine.generateRecommendations(
      analytics,
      diffRes.scaffoldingLevel,
      diffRes.difficultySetting
    );

    const plan: AdaptiveLearningPlan = {
      planId: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId: twin.identity.studentId,
      generatedAtIso: new Date().toISOString(),
      recommendedDurationMinutes: duration,
      targetCefr: twin.goal.targetCefrGoal,
      primaryObjective: goalsRes.primaryObjective,
      secondaryFocusAreas: goalsRes.secondaryFocusAreas,
      lessonMode,
      scaffoldingLevel: diffRes.scaffoldingLevel,
      difficultySetting: diffRes.difficultySetting,
      reviewItemsToCover: reviews,
      conversationScenario: scenario,
      tutorStyle: diffRes.tutorStyle,
      motivationStrategy: motivation,
      recommendations,
      revision: twin.revision
    };

    // Validate plan
    const validation = plannerValidator.validatePlan(plan);
    if (!validation.isValid) {
      console.warn('AdaptiveLearningPlan generated with validation warnings:', validation.issues);
    }

    return plan;
  }
}

export const sessionPlanner = new SessionPlanner();
