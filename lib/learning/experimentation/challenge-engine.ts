/**
 * Personal Challenge Level Engine
 * Discovers and enforces Vygotsky's Zone of Proximal Development (ZPD) for each student.
 * Ensures tasks are neither too easy (boredom) nor too hard (frustration).
 */

import { PersonalLearningProfile } from './personal-learning-profile';

export interface AdjustedChallengeParameters {
  targetDifficultyScore: number; // 0.0 to 1.0
  allowHints: boolean;
  maxOptionChoices: number; // e.g. 3 options vs 4 options vs direct recall
  targetResponseTimeSeconds: number;
  expectedLinguisticComplexity: 'foundational' | 'intermediate' | 'advanced_nuanced';
  pedagogicalZone: 'scaffolded_support' | 'goldilocks_flow' | 'stretch_challenge';
}

export function computeOptimalChallengeParameters(
  profile: PersonalLearningProfile
): AdjustedChallengeParameters {
  const diff = profile.optimalChallengeLevel || 0.70;

  let zone: AdjustedChallengeParameters['pedagogicalZone'] = 'goldilocks_flow';
  if (diff < 0.55) {
    zone = 'scaffolded_support';
  } else if (diff > 0.82) {
    zone = 'stretch_challenge';
  }

  const allowHints = diff < 0.75;
  const maxOptionChoices = diff < 0.60 ? 3 : diff < 0.80 ? 4 : 0; // 0 means open active recall response
  const targetResponseTime = Math.round(15 - diff * 8); // 15s for easy down to 7s for advanced

  let complexity: AdjustedChallengeParameters['expectedLinguisticComplexity'] = 'intermediate';
  if (diff < 0.55) complexity = 'foundational';
  if (diff > 0.80) complexity = 'advanced_nuanced';

  return {
    targetDifficultyScore: diff,
    allowHints,
    maxOptionChoices,
    targetResponseTimeSeconds: Math.max(5, targetResponseTime),
    expectedLinguisticComplexity: complexity,
    pedagogicalZone: zone,
  };
}
