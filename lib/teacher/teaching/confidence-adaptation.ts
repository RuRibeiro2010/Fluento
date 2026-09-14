/**
 * Confidence Adaptation Module (Human Teaching Engine)
 * Automatically adapts speech pace (WPM), sentence length, vocabulary tier,
 * hint frequency, and encouraging tone based on student confidence scores.
 * Fully prepared for audio/video & Gemini Live / Realtime integrations.
 */

export interface StudentConfidenceState {
  confidenceScore: number; // 0 to 100
  recentLatencyMs: number;
  hesitationCount: number;
  selfReportedConfidence?: 'certain' | 'somewhat_sure' | 'guessed';
}

export interface AudioVoiceParameters {
  speakingRate: number; // 0.75x to 1.25x
  pitch: number; // -2.0 to 2.0
  toneMood: 'gentle_supportive' | 'calm_clear' | 'energetic_brisk' | 'warm_conversational';
  pauseDurationFactor: number; // 1.0 to 1.8x longer pauses for processing
}

export interface TeacherAdaptationSettings {
  vocabularyComplexityTier: 'simplified' | 'standard' | 'advanced_idiomatic';
  maxWordsPerSentence: number;
  proactiveHintThreshold: 'immediate' | 'after_hesitation' | 'minimal';
  encouragementFrequency: 'high' | 'moderate' | 'subtle';
  voiceParameters: AudioVoiceParameters;
}

export function calculateTeacherAdaptation(
  studentState: StudentConfidenceState
): TeacherAdaptationSettings {
  const { confidenceScore, recentLatencyMs, hesitationCount } = studentState;

  // High hesitation or low confidence (< 45 or latency > 7000ms)
  if (confidenceScore < 45 || recentLatencyMs > 7000 || hesitationCount >= 2) {
    return {
      vocabularyComplexityTier: 'simplified',
      maxWordsPerSentence: 10,
      proactiveHintThreshold: 'immediate',
      encouragementFrequency: 'high',
      voiceParameters: {
        speakingRate: 0.82,
        pitch: 0.0,
        toneMood: 'gentle_supportive',
        pauseDurationFactor: 1.5,
      },
    };
  }

  // Moderate confidence (45 to 75)
  if (confidenceScore <= 75) {
    return {
      vocabularyComplexityTier: 'standard',
      maxWordsPerSentence: 16,
      proactiveHintThreshold: 'after_hesitation',
      encouragementFrequency: 'moderate',
      voiceParameters: {
        speakingRate: 0.95,
        pitch: 0.0,
        toneMood: 'calm_clear',
        pauseDurationFactor: 1.2,
      },
    };
  }

  // High confidence (> 75)
  return {
    vocabularyComplexityTier: 'advanced_idiomatic',
    maxWordsPerSentence: 24,
    proactiveHintThreshold: 'minimal',
    encouragementFrequency: 'subtle',
    voiceParameters: {
      speakingRate: 1.10,
      pitch: 0.5,
      toneMood: 'energetic_brisk',
      pauseDurationFactor: 1.0,
    },
  };
}
