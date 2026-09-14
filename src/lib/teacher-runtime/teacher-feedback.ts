/**
 * FLUENTO TEACHER RUNTIME - TEACHER FEEDBACK
 * 
 * Enforces low-anxiety feedback principles: implicit recasting over explicit correction,
 * maximum 1 correction per turn, and effort-oriented praise.
 */

import { FeedbackDirective, TeacherEvaluationInput, CorrectionStyle } from './types';

export class TeacherFeedback {
  /**
   * Computes feedback directive.
   */
  public computeFeedback(input: TeacherEvaluationInput): FeedbackDirective {
    const anxiety = input.studentAnxietyLevel ?? input.studentState.speakingAnxietyLevel ?? 30;
    const affectiveFilter = input.affectiveFilterState ?? 'optimal';
    const orchestratorDirective = input.orchestratorDirective;

    let correctionStyle: CorrectionStyle = 'implicit_recast';
    let maxCorrectionsPerTurn = 1;
    let praiseType: FeedbackDirective['praiseType'] = 'effort_focused';
    let recastingTarget: string | undefined = undefined;

    if (orchestratorDirective?.recastingDirective?.shouldCorrect) {
      recastingTarget = orchestratorDirective.recastingDirective.targetFocus;
    }

    // High anxiety or panic state -> ZERO explicit corrections in this turn
    if (affectiveFilter === 'panic' || anxiety > 70) {
      correctionStyle = 'ignore';
      maxCorrectionsPerTurn = 0;
      praiseType = 'effort_focused';
    } else if (
      orchestratorDirective?.recastingDirective?.correctionType === 'involuntary_echo' ||
      orchestratorDirective?.recastingDirective?.correctionType === 'end_of_turn_rephrase'
    ) {
      correctionStyle = 'implicit_recast';
      maxCorrectionsPerTurn = 1;
    } else if (orchestratorDirective?.recastingDirective?.correctionType === 'defer_to_reflection') {
      correctionStyle = 'delayed_review';
      maxCorrectionsPerTurn = 0;
    } else if (orchestratorDirective?.recastingDirective?.correctionType === 'suppress') {
      correctionStyle = 'ignore';
      maxCorrectionsPerTurn = 0;
    }

    return {
      correctionStyle,
      maxCorrectionsPerTurn,
      praiseType,
      recastingTarget
    };
  }
}

export const teacherFeedback = new TeacherFeedback();
