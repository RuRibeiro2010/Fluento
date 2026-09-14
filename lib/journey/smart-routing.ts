/**
 * Smart Routing Engine Module (User Journey - Phase 12)
 * Evaluates user profile state and onboarding indicators to determine
 * the exact required view in the continuous user journey.
 */

export interface SmartRoutingContext {
  isAuthenticated: boolean;
  onboarding_complete: boolean;
  placement_complete: boolean;
  active_learning_plan: boolean;
  current_language?: string;
  hasSeenFirstMission?: boolean;
  hasCompletedFirstLesson?: boolean;
}

export type ContinuousJourneyStep =
  | 'landing'
  | 'auth'
  | 'adaptive_assessment'
  | 'personalized_plan'
  | 'first_mission'
  | 'first_lesson'
  | 'dashboard';

export function determineNextJourneyStep(
  ctx: SmartRoutingContext
): ContinuousJourneyStep {
  // If user is not authenticated, show landing page or auth
  if (!ctx.isAuthenticated) {
    return 'landing';
  }

  // Check if user has all 4 completed prerequisites
  const isFullySetup =
    ctx.onboarding_complete &&
    ctx.placement_complete &&
    ctx.active_learning_plan &&
    Boolean(ctx.current_language);

  // If everything exists and user already completed first lesson flow, go straight to Dashboard
  if (isFullySetup && ctx.hasCompletedFirstLesson) {
    return 'dashboard';
  }

  // Otherwise, route through the progressive onboarding sequence:
  if (!ctx.placement_complete) {
    return 'adaptive_assessment';
  }

  if (!ctx.active_learning_plan) {
    return 'personalized_plan';
  }

  if (!ctx.hasSeenFirstMission) {
    return 'first_mission';
  }

  if (!ctx.hasCompletedFirstLesson) {
    return 'first_lesson';
  }

  return 'dashboard';
}
