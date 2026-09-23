import { StudentProfileData } from '../dto/student-profile.dto';
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

    const pace: 'slow' | 'moderate' | 'fast' =
      legacy.learning_preferences?.pace === 'intensive'
        ? 'fast'
        : legacy.learning_preferences?.pace === 'relaxed'
        ? 'slow'
        : 'moderate';

    const learningStyleRaw = legacy.learning_style || 'interactive';
    const learningStyle: 'auditory' | 'visual' | 'interactive' | 'reflective' = 
      learningStyleRaw === 'visual' ? 'visual' :
      learningStyleRaw === 'auditory' ? 'auditory' : 'interactive';

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
        learningStyle,
      },
      version: 1,
      createdAtIso: legacy.created_at || nowIso,
      updatedAtIso: legacy.updated_at || nowIso,
      lastSyncedAtIso: nowIso,
    };
  }

  /**
   * Translates a legacy UserProfile into the canonical DigitalTwinDTO.
   */
  public static legacyToTwin(legacy: Partial<UserProfile>): Partial<any> {
    const matrix = legacy.skill_matrix;
    const competencies: any = {};

    if (matrix) {
      Object.assign(competencies, {
        grammar: matrix.grammar ?? 70,
        vocabulary: matrix.vocabulary ?? 70,
        listening: matrix.listening ?? 70,
        speaking: matrix.speaking ?? 70,
        reading: matrix.reading ?? 70,
        writing: matrix.writing ?? 70,
        pronunciation: matrix.pronunciation ?? 70,
        fluency: matrix.fluency ?? 70,
        confidence: matrix.confidence ?? legacy.confidence_score ?? 70,
      });
    } else if (typeof legacy.confidence_score === 'number') {
      competencies.confidence = legacy.confidence_score;
    }

    return {
      currentLevel: (legacy.last_assessment?.level || 'B1') as string,
      competencies: Object.keys(competencies).length > 0 ? competencies : undefined,
      progress: {
        completedSessionsCount: legacy.weekly_statistics?.sessionsCompleted ?? 0,
        totalMinutesPracticed: legacy.weekly_statistics?.totalMinutesPracticed ?? 0,
        wordsLearnedCount: legacy.weekly_statistics?.wordsLearnedCount ?? 0,
        streakDays: (legacy as any).streak_days ?? 0,
        completedMinutesThisWeek: legacy.weekly_statistics?.totalMinutesPracticed ?? 0,
        lastSessionDateIso: legacy.last_activity || new Date().toISOString(),
        lastSessionTopic: legacy.current_focus || '',
      }
    };
  }

  /**
   * Translates a StudentProfileEntity into the Application-layer DTO.
   */
  public static mapToDTO(entity: any): StudentProfileData {
    const data = entity.toData();
    return {
      id: data.id,
      name: data.name || 'Aluno Executivo',
      email: data.email || `${data.id}@fluento.ai`,
      nativeLanguage: data.nativeLanguage || 'pt',
      targetLanguages: data.targetLanguages || ['es'],
      currentLevel: data.currentLevel || 'B1',
      targetLevel: data.targetLevel || 'B2',
      objectives: {
        primaryMotivation: data.objectives?.primaryMotivation || '',
        professionalDomain: data.objectives?.professionalDomain || '',
        currentFocus: data.objectives?.currentFocus || '',
        targetExamOrMilestone: data.objectives?.targetExamOrMilestone || '',
      },
      interests: data.interests || [],
      preferences: {
        dailyGoalMinutes: data.preferences.dailyGoalMinutes,
        weeklyGoalMinutes: data.preferences.weeklyGoalMinutes,
        preferredTeacherPersona: data.preferences.preferredTeacherPersona || 'Prof. Sofia',
        correctionStrictness: data.preferences.correctionStrictness || 'balanced',
        pace: data.preferences.pace || 'moderate',
        learningStyle: (data.preferences.learningStyle as any) || 'interactive',
      },
      version: data.version,
      createdAtIso: data.createdAtIso,
      updatedAtIso: data.updatedAtIso,
      lastSyncedAtIso: data.lastSyncedAtIso,
    };
  }

  /**
   * Translates a DigitalTwinEntity into the Application-layer DTO.
   */
  public static mapTwinToDTO(entity: any): any {
    const data = entity.toData();
    return {
      ...data,
      updatedAtIso: data.updatedAtIso || new Date().toISOString(),
    };
  }

  /**
   * Translates canonical StudentProfileData back into legacy UserProfile for backwards compatibility.
   */
  public static profileToLegacy(profile: StudentProfileData, digitalTwin?: any): UserProfile {
    const competencies = digitalTwin?.competencies || {
      speaking: 70, listening: 70, reading: 70, writing: 70, grammar: 70, vocabulary: 70, pronunciation: 70, fluency: 70, confidence: 70
    };
    const progress = digitalTwin?.progress || {
      completedSessionsCount: 0, totalMinutesPracticed: 0, wordsLearnedCount: 0, streakDays: 0, completedMinutesThisWeek: 0, lastSessionDateIso: new Date().toISOString()
    };

    const legacyPace: 'relaxed' | 'moderate' | 'intensive' = 
      profile.preferences.pace === 'fast' ? 'intensive' :
      profile.preferences.pace === 'slow' ? 'relaxed' : 'moderate';

    return {
      id: profile.id,
      email: profile.email,
      native_language: profile.nativeLanguage,
      target_languages: [...profile.targetLanguages],
      learning_preferences: {
        topics: [...profile.interests],
        pace: legacyPace,
        correction_style: profile.preferences.correctionStrictness,
        feedback_frequency: 'immediate',
      },
      coach_personality: profile.preferences.preferredTeacherPersona,
      humor_style: 'light',
      weekly_goal: Math.max(1, Math.round(profile.preferences.weeklyGoalMinutes / (profile.preferences.dailyGoalMinutes || 15))),
      minutes_per_day: profile.preferences.dailyGoalMinutes,
      confidence_score: competencies.confidence || 75,
      skill_matrix: {
        grammar: competencies.grammar,
        vocabulary: competencies.vocabulary,
        listening: competencies.listening,
        speaking: competencies.speaking,
        reading: competencies.reading,
        writing: competencies.writing,
        pronunciation: competencies.pronunciation,
        fluency: competencies.fluency,
        confidence: competencies.confidence,
      },
      current_focus: profile.objectives.currentFocus,
      learning_style: profile.preferences.learningStyle || 'interactive',
      motivation: profile.objectives.primaryMotivation,
      difficulty_preference: profile.preferences.correctionStrictness === 'strict' ? 'challenging' : 'balanced',
      preferred_topics: [...profile.interests],
      last_assessment: {
        date: progress.lastSessionDateIso || new Date().toISOString(),
        level: profile.currentLevel,
        score: Math.round(
          (competencies.speaking +
            competencies.listening +
            competencies.grammar +
            competencies.vocabulary) / 4
        ),
      },
      created_at: profile.createdAtIso,
      updated_at: profile.updatedAtIso,
      hobbies: [...profile.interests],
      interests: [...profile.interests],
      profession: profile.objectives.professionalDomain,
      last_activity: progress.lastSessionDateIso,
      weekly_statistics: {
        sessionsCompleted: progress.completedSessionsCount,
        totalMinutesPracticed: progress.totalMinutesPracticed,
        wordsLearnedCount: progress.wordsLearnedCount,
        grammarRulesMasteredCount: 12,
        averageAccuracyPercent: 85,
      },
    };
  }
}
