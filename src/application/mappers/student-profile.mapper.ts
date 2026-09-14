import { StudentProfileData } from '../../domain/student/entities/student-profile.entity';
import { UserProfile } from '../../../types/profile';
import { StudentDigitalTwinState } from '../../lib/student-digital-twin/types';
import { CEFRLevel } from '../../../types/brain';

export class StudentProfileMapper {
  /**
   * Translates a legacy UserProfile into the canonical StudentProfileData.
   */
  public static legacyToProfile(legacy: Partial<UserProfile>): StudentProfileData {
    const id = legacy.id || 'usr_fluento_primary';
    const nowIso = new Date().toISOString();

    const cefr = (legacy.last_assessment?.level || 'B1') as string;
    const targetLang = (legacy.target_languages && legacy.target_languages.length > 0)
      ? legacy.target_languages[0]
      : 'es';

    const matrix = legacy.skill_matrix || {
      grammar: 70,
      vocabulary: 75,
      listening: 78,
      speaking: 72,
      reading: 80,
      writing: 68,
      pronunciation: 70,
      fluency: 72,
      confidence: legacy.confidence_score || 75,
    };

    const correctionStrictness: 'gentle' | 'balanced' | 'strict' =
      legacy.learning_preferences?.correction_style === 'strict'
        ? 'strict'
        : legacy.learning_preferences?.correction_style === 'gentle'
        ? 'gentle'
        : 'balanced';

    const pace: 'relaxed' | 'moderate' | 'intensive' =
      legacy.learning_preferences?.pace === 'intensive'
        ? 'intensive'
        : legacy.learning_preferences?.pace === 'relaxed'
        ? 'relaxed'
        : 'moderate';

    const dailyMinutes = legacy.minutes_per_day || 15;
    const weeklyGoalMinutes = legacy.weekly_goal ? legacy.weekly_goal * dailyMinutes : 60;

    return {
      id,
      name: legacy.email ? legacy.email.split('@')[0] : 'Aluno Executivo',
      email: legacy.email || `${id}@fluento.ai`,
      nativeLanguage: legacy.native_language || 'pt',
      targetLanguages: legacy.target_languages || [targetLang],
      currentLevel: cefr,
      targetLevel: 'B2',
      objectives: {
        primaryMotivation: legacy.motivation || 'Crescimento de carreira internacional',
        professionalDomain: legacy.profession || 'Negócios & Gestão',
        currentFocus: legacy.current_focus || 'Apresentação Executiva & Negociação de Ideias',
        targetExamOrMilestone: 'Nível B2 Profissional',
      },
      interests: legacy.preferred_topics || legacy.hobbies || legacy.interests || ['Negócios', 'Viagens', 'Tecnologia'],
      preferences: {
        dailyGoalMinutes: dailyMinutes,
        weeklyGoalMinutes,
        preferredTeacherPersona: legacy.coach_personality || 'Prof. Sofia',
        correctionStrictness,
        pace,
        learningStyle: (legacy.learning_style as any) || 'interactive',
      },
      competencies: {
        speaking: matrix.speaking ?? 70,
        listening: matrix.listening ?? 75,
        reading: matrix.reading ?? 80,
        writing: matrix.writing ?? 68,
        grammar: matrix.grammar ?? 72,
        vocabulary: matrix.vocabulary ?? 75,
        pronunciation: matrix.pronunciation ?? 70,
        fluency: matrix.fluency ?? 72,
        confidence: matrix.confidence ?? legacy.confidence_score ?? 75,
      },
      progress: {
        completedSessionsCount: legacy.weekly_statistics?.sessionsCompleted ?? 5,
        totalMinutesPracticed: legacy.weekly_statistics?.totalMinutesPracticed ?? 120,
        wordsLearnedCount: legacy.weekly_statistics?.wordsLearnedCount ?? 85,
        streakDays: 3,
        completedMinutesThisWeek: (legacy.weekly_statistics?.sessionsCompleted ?? 2) * dailyMinutes,
        lastSessionDateIso: legacy.last_activity || nowIso,
      },
      goals: {
        weeklyMinutesGoal: weeklyGoalMinutes,
        milestoneGoals: [
          'Concluir simulação de negociação com precisão B2',
          'Alcançar 80% no vocabulário corporativo',
        ],
      },
      learningHistory: [],
      version: 1,
      createdAtIso: legacy.created_at || nowIso,
      updatedAtIso: legacy.updated_at || nowIso,
      lastSyncedAtIso: nowIso,
    };
  }

  /**
   * Translates canonical StudentProfileData back into legacy UserProfile for backwards compatibility.
   */
  public static profileToLegacy(profile: StudentProfileData): UserProfile {
    return {
      id: profile.id,
      email: profile.email,
      native_language: profile.nativeLanguage,
      target_languages: [...profile.targetLanguages],
      learning_preferences: {
        topics: [...profile.interests],
        pace: profile.preferences.pace,
        correction_style: profile.preferences.correctionStrictness,
        feedback_frequency: 'immediate',
      },
      coach_personality: profile.preferences.preferredTeacherPersona,
      humor_style: 'light',
      weekly_goal: Math.max(1, Math.round(profile.preferences.weeklyGoalMinutes / (profile.preferences.dailyGoalMinutes || 15))),
      minutes_per_day: profile.preferences.dailyGoalMinutes,
      confidence_score: profile.competencies.confidence || 75,
      skill_matrix: {
        grammar: profile.competencies.grammar,
        vocabulary: profile.competencies.vocabulary,
        listening: profile.competencies.listening,
        speaking: profile.competencies.speaking,
        reading: profile.competencies.reading,
        writing: profile.competencies.writing,
        pronunciation: profile.competencies.pronunciation,
        fluency: profile.competencies.fluency,
        confidence: profile.competencies.confidence,
      },
      current_focus: profile.objectives.currentFocus,
      learning_style: (profile.preferences.learningStyle as any) || 'interactive',
      motivation: profile.objectives.primaryMotivation,
      difficulty_preference: profile.preferences.correctionStrictness === 'strict' ? 'challenging' : 'balanced',
      preferred_topics: [...profile.interests],
      last_assessment: {
        date: profile.progress.lastSessionDateIso || new Date().toISOString(),
        level: profile.currentLevel,
        score: Math.round(
          (profile.competencies.speaking +
            profile.competencies.listening +
            profile.competencies.grammar +
            profile.competencies.vocabulary) / 4
        ),
      },
      created_at: profile.createdAtIso,
      updated_at: profile.updatedAtIso,
      hobbies: [...profile.interests],
      interests: [...profile.interests],
      profession: profile.objectives.professionalDomain,
      last_activity: profile.progress.lastSessionDateIso,
      weekly_statistics: {
        sessionsCompleted: profile.progress.completedSessionsCount,
        totalMinutesPracticed: profile.progress.totalMinutesPracticed,
        wordsLearnedCount: profile.progress.wordsLearnedCount,
        grammarRulesMasteredCount: 12,
        averageAccuracyPercent: 85,
      },
    };
  }

  /**
   * Translates StudentDigitalTwinState to canonical StudentProfileData.
   */
  public static twinToProfile(twin: StudentDigitalTwinState): StudentProfileData {
    return {
      id: twin.identity.studentId,
      name: twin.identity.name,
      email: twin.identity.email,
      nativeLanguage: twin.identity.nativeLanguage,
      targetLanguages: [twin.identity.targetLanguage],
      currentLevel: twin.language.currentCefr,
      targetLevel: twin.goal.targetCefrGoal,
      objectives: {
        primaryMotivation: twin.goal.primaryMotivation,
        professionalDomain: twin.goal.professionalDomain,
        currentFocus: twin.recommendation.nextFocusSkills.join(', ') || 'Fluência Conversacional',
        targetExamOrMilestone: `Nível ${twin.goal.targetCefrGoal}`,
      },
      interests: twin.learning.focusAreas,
      preferences: {
        dailyGoalMinutes: twin.recommendation.recommendedSessionDurationMinutes,
        weeklyGoalMinutes: twin.goal.weeklyMinutesGoal,
        preferredTeacherPersona: 'Prof. Sofia',
        correctionStrictness: twin.recommendation.suggestedScaffoldingLevel === 'high' ? 'gentle' : 'balanced',
        pace: twin.learning.preferredPace === 'accelerated' ? 'intensive' : twin.learning.preferredPace === 'slow' ? 'relaxed' : 'moderate',
        learningStyle: twin.learning.learningStyle,
      },
      competencies: {
        speaking: twin.emotional.confidenceScores.speaking,
        listening: twin.language.listeningComprehensionScore,
        reading: 75,
        writing: 70,
        grammar: twin.language.grammarMasteryScore,
        vocabulary: Math.min(100, Math.round((twin.language.estimatedVocabularySize / 3000) * 100)),
        pronunciation: twin.language.pronunciationScore,
        fluency: twin.language.fluencyScore,
        confidence: twin.emotional.confidenceScores.overall,
      },
      progress: {
        completedSessionsCount: twin.behaviour.completedSessionsCount,
        totalMinutesPracticed: Math.round((twin.behaviour.totalSpeakingTimeSeconds || 0) / 60),
        wordsLearnedCount: Math.round(twin.language.estimatedVocabularySize * 0.3),
        streakDays: 3,
        completedMinutesThisWeek: twin.goal.completedMinutesThisWeek,
        lastSessionDateIso: twin.lastUpdatedIso,
      },
      goals: {
        weeklyMinutesGoal: twin.goal.weeklyMinutesGoal,
        targetDeadlineIso: twin.goal.deadlineIso,
        milestoneGoals: [
          `Atingir Nível ${twin.goal.targetCefrGoal}`,
          ...twin.recommendation.nextFocusSkills,
        ],
      },
      learningHistory: twin.memory.ephemeralSessionNotes.map((note, idx) => ({
        sessionId: `twin_sess_${idx}`,
        dateIso: twin.lastUpdatedIso,
        topicTitle: note,
        cefrLevel: twin.language.currentCefr,
        accuracyPercent: 85,
      })),
      version: twin.revision,
      createdAtIso: twin.identity.createdAtIso,
      updatedAtIso: twin.lastUpdatedIso,
      lastSyncedAtIso: twin.lastUpdatedIso,
    };
  }

  /**
   * Synchronizes changes from StudentProfileData into a StudentDigitalTwinState.
   */
  public static profileToTwin(
    profile: StudentProfileData,
    existingTwin?: StudentDigitalTwinState
  ): Partial<StudentDigitalTwinState> {
    const targetCefr = (profile.targetLevel || 'B2') as CEFRLevel;
    const currentCefr = (profile.currentLevel || 'B1') as CEFRLevel;

    return {
      identity: {
        studentId: profile.id,
        name: profile.name || existingTwin?.identity.name || 'Aluno Executivo',
        email: profile.email || existingTwin?.identity.email || `${profile.id}@fluento.ai`,
        nativeLanguage: profile.nativeLanguage,
        targetLanguage: profile.targetLanguages[0] || 'es',
        timezone: existingTwin?.identity.timezone || 'Europe/Lisbon',
        createdAtIso: existingTwin?.identity.createdAtIso || profile.createdAtIso,
        lastActiveIso: new Date().toISOString(),
      },
      learning: {
        learningStyle: (profile.preferences.learningStyle as any) || existingTwin?.learning.learningStyle || 'interactive',
        preferredPace: profile.preferences.pace === 'intensive' ? 'accelerated' : profile.preferences.pace === 'relaxed' ? 'slow' : 'moderate',
        sessionFrequency: 'daily',
        focusAreas: ['speaking_fluency', 'business_vocabulary'],
        cognitiveLoadTolerance: 'medium',
      },
      language: {
        currentCefr,
        targetCefr,
        estimatedVocabularySize: existingTwin?.language.estimatedVocabularySize || 1600,
        grammarMasteryScore: profile.competencies.grammar,
        pronunciationScore: profile.competencies.pronunciation,
        listeningComprehensionScore: profile.competencies.listening,
        fluencyScore: profile.competencies.fluency || profile.competencies.speaking,
        knownL1InterferencePatterns: existingTwin?.language.knownL1InterferencePatterns || [],
      },
      goal: {
        targetCefrGoal: targetCefr,
        deadlineIso: profile.goals.targetDeadlineIso,
        primaryMotivation: profile.objectives.primaryMotivation,
        professionalDomain: profile.objectives.professionalDomain,
        weeklyMinutesGoal: profile.goals.weeklyMinutesGoal,
        completedMinutesThisWeek: profile.progress.completedMinutesThisWeek,
      },
      recommendation: {
        recommendedSessionDurationMinutes: profile.preferences.dailyGoalMinutes,
        suggestedScaffoldingLevel: profile.preferences.correctionStrictness === 'strict' ? 'minimal' : 'moderate',
        nextFocusSkills: [profile.objectives.currentFocus],
        optimalPracticeTimeOfDay: 'morning',
      },
    };
  }
}
