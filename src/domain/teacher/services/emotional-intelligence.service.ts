import { EmotionalState } from '@/types/coach';

/**
 * EMOTIONAL INTELLIGENCE SERVICE
 * 
 * Domain service responsible for analyzing student engagement metrics 
 * to determine emotional state and teacher adaptation strategies.
 * Strictly deterministic rule-based logic.
 */
export class EmotionalIntelligenceService {
  /**
   * Analyzes response time, error frequency, hesitations, inactivity, and consistency
   * to adjust difficulty, encouragement, and teaching strategy.
   */
  public analyzeState(metrics: {
    responseTimeMs?: number;
    recentErrorCount?: number;
    hesitationScore?: number;
    inactivityDays?: number;
    consistencyScore?: number;
  }): EmotionalState {
    const {
      responseTimeMs = 2500,
      recentErrorCount = 0,
      hesitationScore = 20,
      inactivityDays = 0,
      consistencyScore = 85,
    } = metrics;

    let detectedMood: EmotionalState['detectedMood'] = 'confident';
    let coachAdaptation = 'Manter ritmo e aprofundar expressão verbal.';

    if (inactivityDays > 3 || recentErrorCount >= 4 || hesitationScore > 65) {
      detectedMood = 'demotivated';
      coachAdaptation = 'Reduzir a dificuldade da gramática, oferecer incentivo extra e focar em conversação leve sobre temas favoritos.';
    } else if (responseTimeMs > 5000 || hesitationScore > 45) {
      detectedMood = 'hesitant';
      coachAdaptation = 'Dar mais tempo de pausa, fornecer exemplos visuais e reforçar com explicações claras.';
    } else if (recentErrorCount === 0 && hesitationScore < 20) {
      detectedMood = 'highly_motivated';
      coachAdaptation = 'Aumentar a complexidade do vocabulário e desafiar para respostas mais espontâneas.';
    }

    return {
      responseTimeMs,
      recentErrorCount,
      hesitationScore,
      inactivityDays,
      motivationScore: detectedMood === 'demotivated' ? 45 : detectedMood === 'hesitant' ? 65 : 90,
      consistencyScore,
      detectedMood,
      coachAdaptation,
    };
  }
}

export const emotionalIntelligenceService = new EmotionalIntelligenceService();
