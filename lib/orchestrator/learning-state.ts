/**
 * Learning State Module (AI Teaching Orchestrator - Phase 15)
 * Classifies the student's dynamic cognitive and emotional state.
 */

export type StudentLearningState =
  | 'Ready to Learn'
  | 'Mentally Tired'
  | 'Needs Review'
  | 'Needs Motivation'
  | 'Needs Confidence'
  | 'Ready for Challenge'
  | 'Plateau'
  | 'High Performance'
  | 'Burnout Risk'
  | 'Recovery Mode'
  | 'Flow State';

export interface StudentStateEvaluationInput {
  fatigueScore: number; // 0 (rested) to 10 (exhausted)
  confidenceRating: number; // 1 (anxious) to 10 (confident)
  recentAccuracyPercentage: number; // 0 to 100
  streakDays: number;
  unreviewedItemsCount: number;
  daysInCurrentLevel: number;
}

export function evaluateStudentState(input: StudentStateEvaluationInput): StudentLearningState {
  if (input.fatigueScore >= 8) {
    return 'Burnout Risk';
  }

  if (input.fatigueScore >= 6) {
    return 'Mentally Tired';
  }

  if (input.unreviewedItemsCount > 15) {
    return 'Needs Review';
  }

  if (input.confidenceRating <= 4) {
    return 'Needs Confidence';
  }

  if (input.recentAccuracyPercentage >= 90 && input.fatigueScore <= 3) {
    return 'Flow State';
  }

  if (input.recentAccuracyPercentage >= 85) {
    return 'Ready for Challenge';
  }

  if (input.daysInCurrentLevel > 21 && input.recentAccuracyPercentage < 70) {
    return 'Plateau';
  }

  if (input.streakDays > 10 && input.recentAccuracyPercentage >= 80) {
    return 'High Performance';
  }

  if (input.streakDays === 0) {
    return 'Needs Motivation';
  }

  return 'Ready to Learn';
}
