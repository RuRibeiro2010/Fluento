import { MicroBreakRecommendation } from '@/types/experience';

/**
 * Micro Break Service
 * Monitors active session duration and fatigue indicators (rising error rate, slowed responses)
 * to suggest strategic micro breaks or intensity shifts.
 */
export class MicroBreakService {
  /**
   * Evaluates active session time and fatigue to recommend breaks
   */
  public evaluateBreakNeeds(
    sessionDurationMinutes: number,
    recentResponseDelaySeconds: number,
    recentErrorCount: number
  ): MicroBreakRecommendation {
    let fatigueScore = Math.min(100, Math.round(sessionDurationMinutes * 2.5 + recentErrorCount * 12));
    if (recentResponseDelaySeconds > 15) fatigueScore += 15;

    if (sessionDurationMinutes >= 35 || fatigueScore >= 80) {
      return {
        shouldTakeBreak: true,
        sessionDurationMinutes,
        fatigueScore,
        suggestedAction: 'wrap_up_session',
        message: `You've completed ${sessionDurationMinutes} minutes of focused immersion. To maximize long-term memory consolidation, now is the optimal moment to wrap up today's session.`,
      };
    }

    if (sessionDurationMinutes >= 20 || fatigueScore >= 55) {
      return {
        shouldTakeBreak: true,
        sessionDurationMinutes,
        fatigueScore,
        suggestedAction: 'micro_break_60s',
        message: `High cognitive load detected after ${sessionDurationMinutes} minutes. Take a 60-second breather before our final conversational exercise.`,
      };
    }

    if (recentErrorCount >= 3) {
      return {
        shouldTakeBreak: false,
        sessionDurationMinutes,
        fatigueScore,
        suggestedAction: 'reduce_intensity',
        message: `Let's slow down the pace slightly and focus on simple sentence patterns for the next 2 minutes.`,
      };
    }

    return {
      shouldTakeBreak: false,
      sessionDurationMinutes,
      fatigueScore,
      suggestedAction: 'continue',
      message: 'Cognitive rhythm is optimal. Continue current exercise block.',
    };
  }
}

export const defaultMicroBreakService = new MicroBreakService();
