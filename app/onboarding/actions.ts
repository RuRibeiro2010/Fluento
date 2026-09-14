import { OnboardingData } from '@/types/onboarding';
import { UserProfile } from '@/types/profile';

/**
 * Server Action / API Helper for saving onboarding profile data
 */
export async function saveOnboardingProfile(data: OnboardingData): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const finalLevel = data.placementResult?.assignedLevel || data.currentLevel || 'A1';

    const profile: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      native_language: data.nativeLanguage || 'en',
      target_languages: data.targetLanguages && data.targetLanguages.length > 0 ? data.targetLanguages : ['es'],
      learning_preferences: {
        topics: data.interests || [],
        pace: data.dailyCommitmentMinutes > 20 ? 'intensive' : 'moderate',
        feedback_frequency: 'immediate',
      },
      coach_personality: data.coachStyle || 'encouraging',
      humor_style: 'light',
      weekly_goal: (data.dailyCommitmentMinutes || 15) * 5,
      minutes_per_day: data.dailyCommitmentMinutes || 15,
      confidence_score: data.placementResult?.score || (finalLevel === 'B1' ? 70 : finalLevel === 'A2' ? 50 : 30),
      skill_matrix: {
        grammar: finalLevel === 'B2' ? 75 : finalLevel === 'B1' ? 60 : 45,
        vocabulary: finalLevel === 'B2' ? 70 : finalLevel === 'B1' ? 65 : 40,
        listening: finalLevel === 'B2' ? 80 : finalLevel === 'B1' ? 60 : 50,
        speaking: finalLevel === 'B2' ? 65 : finalLevel === 'B1' ? 50 : 35,
        reading: finalLevel === 'B2' ? 85 : finalLevel === 'B1' ? 70 : 55,
        writing: finalLevel === 'B2' ? 70 : finalLevel === 'B1' ? 55 : 40,
        pronunciation: finalLevel === 'B2' ? 75 : finalLevel === 'B1' ? 60 : 45,
      },
      current_focus: `Core Mastery & Vocabulary for ${data.targetLanguages.join(', ').toUpperCase()}`,
      learning_style: data.learningStyle || 'visual',
      motivation: data.primaryGoal || 'Conversational Fluency',
      difficulty_preference: 'balanced',
      preferred_topics: data.interests || ['travel', 'culture'],
      last_assessment: {
        date: new Date().toISOString(),
        level: finalLevel,
        score: data.placementResult?.score || 75,
        summary: data.placementResult
          ? `Adaptive AI Placement Test completed. Recommended focus: ${data.placementResult.recommendedFocus}`
          : `Self-assessed level: ${finalLevel}`,
        strengths: data.placementResult?.strengths || ['Motivation & Daily Commitment'],
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return { success: true, profile };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save onboarding profile' };
  }
}
