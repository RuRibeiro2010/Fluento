/**
 * Personalization Engine Module (Fluento Intelligence 1.0 - Phase 16)
 * Continuously refines the individual learner model based on historical accuracy,
 * preferred study hours, speech pace, and interest affinities.
 */

export interface LearnerAffinityModel {
  userId: string;
  optimalPacing: 'slow' | 'moderate' | 'brisk';
  preferredLessonLengthMinutes: number;
  strongTopics: string[];
  vulnerableTopics: string[];
  learningVelocityMultiplier: number;
  modelConfidenceLevel: number; // 0 to 100
}

export function updatePersonalizedLearnerModel(
  currentModel: LearnerAffinityModel | null,
  recentSessionMetrics: {
    accuracy: number;
    durationMinutes: number;
    topicCategory: string;
    hesitationsCount: number;
  }
): LearnerAffinityModel {
  const existing = currentModel || {
    userId: 'current-user',
    optimalPacing: 'moderate',
    preferredLessonLengthMinutes: 15,
    strongTopics: [],
    vulnerableTopics: [],
    learningVelocityMultiplier: 1.0,
    modelConfidenceLevel: 20,
  };

  const newConfidence = Math.min(100, existing.modelConfidenceLevel + 10);
  const strongTopics = [...existing.strongTopics];
  const vulnerableTopics = [...existing.vulnerableTopics];

  if (recentSessionMetrics.accuracy >= 85) {
    if (!strongTopics.includes(recentSessionMetrics.topicCategory)) {
      strongTopics.push(recentSessionMetrics.topicCategory);
    }
  } else if (recentSessionMetrics.accuracy < 65) {
    if (!vulnerableTopics.includes(recentSessionMetrics.topicCategory)) {
      vulnerableTopics.push(recentSessionMetrics.topicCategory);
    }
  }

  let optimalPacing = existing.optimalPacing;
  if (recentSessionMetrics.hesitationsCount > 5) {
    optimalPacing = 'slow';
  } else if (recentSessionMetrics.accuracy > 90 && recentSessionMetrics.hesitationsCount <= 1) {
    optimalPacing = 'brisk';
  }

  return {
    ...existing,
    optimalPacing,
    strongTopics,
    vulnerableTopics,
    modelConfidenceLevel: newConfidence,
  };
}
