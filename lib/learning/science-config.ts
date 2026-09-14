/**
 * Learning Science Configuration
 * Centralized hub for tweaking evidence-based cognitive parameters, formulas,
 * decay rates, and thresholds without changing overall system architecture.
 */

export interface LearningScienceConfig {
  // 1. Spaced Repetition (Dynamic SRS)
  spacedRepetition: {
    initialStabilityDays: number;
    decayConstant: number;
    confidenceMultiplier: number;
    errorPenaltyMultiplier: number;
    speedFactorWeight: number;
    targetRecallThreshold: number; // e.g. 0.85 (85% probability)
  };

  // 2. Cognitive Load Management
  cognitiveLoad: {
    maxInformationUnitsPerChunk: number;
    fatigueThresholdMinutes: number;
    complexityCapScore: number;
    chunkSplitThreshold: number; // Load score above which lesson auto-splits
  };

  // 3. Interleaving
  interleaving: {
    maxConsecutiveSameSkillMinutes: number;
    optimalSkillDistribution: {
      grammarPercent: number;
      vocabularyPercent: number;
      speakingPercent: number;
      listeningPercent: number;
      readingPercent: number;
      writingPercent: number;
    };
  };

  // 4. Learning Efficiency Score (LES)
  efficiencyScoreWeights: {
    accuracy: number;
    retention: number;
    confidence: number;
    speedEfficiency: number;
    fatiguePenalty: number;
    effortReward: number;
  };

  // 5. Mastery & Transfer Learning
  masteryCriteria: {
    requiredSuccessfulContextsCount: number; // e.g. 3 distinct contexts
    minStreakWithoutErrors: number;
    requiredConfidenceScore: number;
  };

  // 6. Active Recall & Retrieval
  activeRecall: {
    minIntervalDaysForUnannouncedRetrieval: number;
    maxUnannouncedItemsPerLesson: number;
  };
}

export const DEFAULT_LEARNING_SCIENCE_CONFIG: LearningScienceConfig = {
  spacedRepetition: {
    initialStabilityDays: 1.5,
    decayConstant: 0.08,
    confidenceMultiplier: 1.25,
    errorPenaltyMultiplier: 0.6,
    speedFactorWeight: 0.15,
    targetRecallThreshold: 0.82,
  },
  cognitiveLoad: {
    maxInformationUnitsPerChunk: 7, // Miller's Law: 7 ± 2 items
    fatigueThresholdMinutes: 20,
    complexityCapScore: 85,
    chunkSplitThreshold: 75,
  },
  interleaving: {
    maxConsecutiveSameSkillMinutes: 6,
    optimalSkillDistribution: {
      speakingPercent: 30,
      listeningPercent: 20,
      grammarPercent: 15,
      vocabularyPercent: 15,
      readingPercent: 10,
      writingPercent: 10,
    },
  },
  efficiencyScoreWeights: {
    accuracy: 0.25,
    retention: 0.25,
    confidence: 0.2,
    speedEfficiency: 0.1,
    fatiguePenalty: 0.1,
    effortReward: 0.1,
  },
  masteryCriteria: {
    requiredSuccessfulContextsCount: 3,
    minStreakWithoutErrors: 4,
    requiredConfidenceScore: 85,
  },
  activeRecall: {
    minIntervalDaysForUnannouncedRetrieval: 2,
    maxUnannouncedItemsPerLesson: 3,
  },
};

let currentConfig: LearningScienceConfig = { ...DEFAULT_LEARNING_SCIENCE_CONFIG };

export function getLearningScienceConfig(): LearningScienceConfig {
  return currentConfig;
}

export function updateLearningScienceConfig(partial: Partial<LearningScienceConfig>): LearningScienceConfig {
  currentConfig = {
    ...currentConfig,
    ...partial,
  };
  return currentConfig;
}

export function resetLearningScienceConfig(): LearningScienceConfig {
  currentConfig = { ...DEFAULT_LEARNING_SCIENCE_CONFIG };
  return currentConfig;
}
