import { UserProfile } from '@/types/profile';
import { LongitudinalMemory } from '@/types/coach';

/**
 * LONGITUDINAL MEMORY SERVICE
 * 
 * Domain service responsible for the lifecycle and evolution of a student's 
 * long-term learning memory. This logic is strictly deterministic and 
 * business-rule driven.
 */
export class LongitudinalMemoryService {
  /**
   * Creates an initial longitudinal memory state for a user.
   */
  public createInitial(
    userId: string,
    targetLanguage: string,
    profile?: Partial<UserProfile>
  ): LongitudinalMemory {
    const level = profile?.last_assessment?.level || 'A1';

    return {
      userId: userId || 'guest-user',
      targetLanguage: targetLanguage || 'es',
      weakWords: [
        { word: 'por vs para', translation: 'for/by', errorCount: 2, lastPracticed: new Date().toISOString() },
        { word: 'estacionamiento', translation: 'parking lot', errorCount: 1, lastPracticed: new Date().toISOString() },
      ],
      weakGrammar: [
        { concept: 'Past Subjunctive Conjugations', errorRate: 0.35, lastReviewed: new Date().toISOString() },
        { concept: 'Indirect Object Pronouns', errorRate: 0.25, lastReviewed: new Date().toISOString() },
      ],
      confidenceTrend: [
        { date: 'Mon', score: profile?.confidence_score || 45 },
        { date: 'Tue', score: (profile?.confidence_score || 45) + 3 },
        { date: 'Wed', score: (profile?.confidence_score || 45) + 5 },
      ],
      learningVelocity: 'steady',
      masteredTopics: profile?.preferred_topics || ['Travel Basics', 'Ordering Food'],
      totalPracticeMinutes: (profile?.minutes_per_day || 15) * 4,
      streakDays: 5,
      lastSessionDate: new Date().toISOString(),
      pastErrorsMemory: ['Subjuntivo no passado', 'Concordância de género em reuniões'],
      userContextDetails: {
        profession: profile?.profession || 'Profissional Executivo',
        hobbies: profile?.hobbies || ['Tecnologia', 'Viagens', 'Café'],
        favoriteTopics: profile?.preferred_topics || ['Negócios', 'Cultura Internacional'],
        ageGroup: profile?.age ? `${profile.age} anos` : 'Adulto',
        motivationReason: profile?.motivation || 'Liderar apresentações e negociações com total fluência',
      },
      emotionalState: {
        responseTimeMs: 2400,
        recentErrorCount: 1,
        hesitationScore: 18,
        inactivityDays: 0,
        motivationScore: 88,
        consistencyScore: 92,
        detectedMood: 'confident',
        coachAdaptation: 'Acelerar o ritmo com vocabulário mais rico e desafios práticos.',
      },
    };
  }

  /**
   * Updates longitudinal memory based on user practice session results.
   */
  public update(
    existingMemory: LongitudinalMemory,
    sessionData: {
      durationMinutes: number;
      newErrors?: string[];
      correctedWords?: string[];
      confidenceDelta?: number;
    }
  ): LongitudinalMemory {
    const updatedMinutes = existingMemory.totalPracticeMinutes + (sessionData.durationMinutes || 10);
    const updatedConfidence = Math.min(
      100,
      Math.max(10, (existingMemory.confidenceTrend.slice(-1)[0]?.score || 50) + (sessionData.confidenceDelta || 2))
    );

    const updatedTrend = [
      ...existingMemory.confidenceTrend.slice(-6),
      { date: 'Today', score: updatedConfidence },
    ];

    return {
      ...existingMemory,
      totalPracticeMinutes: updatedMinutes,
      confidenceTrend: updatedTrend,
      streakDays: existingMemory.streakDays + 1,
      lastSessionDate: new Date().toISOString(),
      learningVelocity: sessionData.confidenceDelta && sessionData.confidenceDelta > 5 ? 'accelerating' : 'steady',
    };
  }
}

export const longitudinalMemoryService = new LongitudinalMemoryService();
