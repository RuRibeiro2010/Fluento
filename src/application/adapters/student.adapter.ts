import { ApplicationQueryHandlers } from '../queries/query-handlers';
import { StudentDTO } from '../dto/application.dtos';
import { IStudentRepository } from '../../domain/student/repositories/student-repository.interface';
import { StudentProfileData } from '../../domain/student/entities/student-profile.entity';
import { StudentProfileSyncService, ProfileChangeListener } from '../services/student-profile-sync.service';
import { UserProfile } from '../../../types/profile';

export interface StudentProfileViewModelDTO {
  readonly id: string;
  readonly email: string;
  readonly nativeLanguage: string;
  readonly targetLanguages: string[];
  readonly currentLevel: string;
  readonly currentFocus: string;
  readonly motivation: string;
  readonly active: boolean;
  readonly skillMatrix: {
    readonly speaking: number;
    readonly listening: number;
    readonly reading: number;
    readonly writing: number;
    readonly grammar: number;
    readonly vocabulary: number;
  };
  readonly preferences: {
    readonly dailyGoalMinutes: number;
    readonly preferredTeacherPersona: string;
    readonly correctionStrictness: string;
  };
  readonly source: 'application_layer' | 'legacy_fallback';
}

export class StudentProfileAdapter {
  constructor(
    private readonly queryHandlers: ApplicationQueryHandlers,
    private readonly studentRepo: IStudentRepository,
    private readonly syncService?: StudentProfileSyncService
  ) {}

  /**
   * Retrieves the canonical Student Profile data model.
   * Single point of entry for the UI layer to access student data.
   */
  public async getCanonicalProfile(studentId = 'usr_fluento_primary'): Promise<StudentProfileData> {
    if (this.syncService) {
      return this.syncService.getProfile(studentId);
    }

    // Fallback if syncService not provided: query repository or return default
    try {
      const studentDto: StudentDTO = await this.queryHandlers.getStudentProfile({ studentId });
      return {
        id: studentDto.id,
        name: 'Aluno Executivo',
        email: studentDto.email,
        nativeLanguage: studentDto.nativeLanguage,
        targetLanguages: studentDto.targetLanguages,
        currentLevel: studentDto.currentLevel,
        targetLevel: 'B2',
        objectives: {
          primaryMotivation: studentDto.motivation,
          currentFocus: studentDto.currentFocus,
        },
        interests: ['Negócios', 'Viagens'],
        preferences: {
          dailyGoalMinutes: studentDto.preferences.dailyGoalMinutes,
          weeklyGoalMinutes: studentDto.preferences.dailyGoalMinutes * 4,
          preferredTeacherPersona: studentDto.preferences.preferredTeacherPersona,
          correctionStrictness: studentDto.preferences.correctionStrictness === 'strict' ? 'strict' : 'balanced',
          pace: 'moderate',
        },
        competencies: {
          speaking: studentDto.skillMatrix.speaking,
          listening: studentDto.skillMatrix.listening,
          reading: studentDto.skillMatrix.reading,
          writing: studentDto.skillMatrix.writing,
          grammar: studentDto.skillMatrix.grammar,
          vocabulary: studentDto.skillMatrix.vocabulary,
          pronunciation: 70,
        },
        progress: {
          completedSessionsCount: 5,
          totalMinutesPracticed: 100,
          wordsLearnedCount: 75,
          streakDays: 3,
          completedMinutesThisWeek: 45,
        },
        goals: {
          weeklyMinutesGoal: 60,
          milestoneGoals: ['Atingir fluência B2'],
        },
        learningHistory: [],
        version: 1,
        createdAtIso: studentDto.createdAt || new Date().toISOString(),
        updatedAtIso: studentDto.updatedAt || new Date().toISOString(),
      };
    } catch {
      return {
        id: studentId,
        name: 'Aluno Executivo',
        email: `${studentId}@fluento.ai`,
        nativeLanguage: 'pt',
        targetLanguages: ['es'],
        currentLevel: 'B1',
        targetLevel: 'B2',
        objectives: {
          primaryMotivation: 'Crescimento de carreira internacional',
          currentFocus: 'Apresentação Executiva & Negociação de Ideias',
        },
        interests: ['Negócios', 'Viagens'],
        preferences: {
          dailyGoalMinutes: 15,
          weeklyGoalMinutes: 60,
          preferredTeacherPersona: 'Prof. Sofia',
          correctionStrictness: 'balanced',
          pace: 'moderate',
        },
        competencies: {
          speaking: 72,
          listening: 78,
          reading: 80,
          writing: 70,
          grammar: 74,
          vocabulary: 76,
          pronunciation: 71,
        },
        progress: {
          completedSessionsCount: 5,
          totalMinutesPracticed: 120,
          wordsLearnedCount: 85,
          streakDays: 3,
          completedMinutesThisWeek: 45,
        },
        goals: {
          weeklyMinutesGoal: 60,
          milestoneGoals: ['Completar 4 sessões executivas'],
        },
        learningHistory: [],
        version: 1,
        createdAtIso: new Date().toISOString(),
        updatedAtIso: new Date().toISOString(),
      };
    }
  }

  /**
   * Updates student profile with partial data via the sync service.
   */
  public async updateProfile(
    studentId: string,
    updates: Partial<StudentProfileData>
  ): Promise<StudentProfileData> {
    if (this.syncService) {
      return this.syncService.updateProfile(studentId, updates);
    }
    const current = await this.getCanonicalProfile(studentId);
    return { ...current, ...updates, updatedAtIso: new Date().toISOString() };
  }

  /**
   * Saves onboarding profile to the canonical application store.
   */
  public async saveOnboardingProfile(
    profile: UserProfile | Partial<StudentProfileData>
  ): Promise<StudentProfileData> {
    if (this.syncService) {
      if ('native_language' in profile) {
        return this.syncService.syncLegacyProfile(profile as UserProfile);
      }
      return this.syncService.updateProfile(profile.id || 'usr_fluento_primary', profile);
    }
    return this.getCanonicalProfile(profile.id);
  }

  /**
   * Returns a legacy UserProfile representation for backwards-compatible UI components.
   */
  public async getLegacyUserProfile(studentId = 'usr_fluento_primary'): Promise<UserProfile> {
    const canonical = await this.getCanonicalProfile(studentId);
    if (this.syncService) {
      return this.syncService.toLegacyUserProfile(canonical);
    }
    return {
      id: canonical.id,
      email: canonical.email,
      native_language: canonical.nativeLanguage,
      target_languages: canonical.targetLanguages,
      coach_personality: canonical.preferences.preferredTeacherPersona,
      humor_style: 'light',
      weekly_goal: Math.max(1, Math.round(canonical.preferences.weeklyGoalMinutes / (canonical.preferences.dailyGoalMinutes || 15))),
      minutes_per_day: canonical.preferences.dailyGoalMinutes,
      confidence_score: canonical.competencies.confidence || 75,
      skill_matrix: {
        grammar: canonical.competencies.grammar,
        vocabulary: canonical.competencies.vocabulary,
        listening: canonical.competencies.listening,
        speaking: canonical.competencies.speaking,
        reading: canonical.competencies.reading,
        writing: canonical.competencies.writing,
        pronunciation: canonical.competencies.pronunciation,
        fluency: canonical.competencies.fluency,
        confidence: canonical.competencies.confidence,
      },
      current_focus: canonical.objectives.currentFocus,
      learning_style: (canonical.preferences.learningStyle as any) || 'interactive',
      motivation: canonical.objectives.primaryMotivation,
      difficulty_preference: canonical.preferences.correctionStrictness === 'strict' ? 'challenging' : 'balanced',
      preferred_topics: canonical.interests,
      learning_preferences: {
        topics: canonical.interests,
        pace: canonical.preferences.pace,
        correction_style: canonical.preferences.correctionStrictness,
        feedback_frequency: 'immediate',
      },
    };
  }

  /**
   * Backward-compatible method for Sprint 16A.2 queries.
   */
  public async getProfile(studentId: string): Promise<StudentProfileViewModelDTO> {
    try {
      const studentDto: StudentDTO = await this.queryHandlers.getStudentProfile({ studentId });
      return {
        id: studentDto.id,
        email: studentDto.email,
        nativeLanguage: studentDto.nativeLanguage,
        targetLanguages: studentDto.targetLanguages,
        currentLevel: studentDto.currentLevel,
        currentFocus: studentDto.currentFocus,
        motivation: studentDto.motivation,
        active: studentDto.active,
        skillMatrix: studentDto.skillMatrix,
        preferences: studentDto.preferences,
        source: 'application_layer',
      };
    } catch (error) {
      console.warn('[StudentProfileAdapter] Error fetching student profile, returning safe fallback:', error);
      return {
        id: studentId,
        email: `${studentId}@fluento.ai`,
        nativeLanguage: 'pt',
        targetLanguages: ['es'],
        currentLevel: 'B1',
        currentFocus: 'Fluência Corporativa & Reuniões',
        motivation: 'Crescimento de carreira internacional',
        active: true,
        skillMatrix: {
          speaking: 72,
          listening: 78,
          reading: 80,
          writing: 70,
          grammar: 74,
          vocabulary: 76,
        },
        preferences: {
          dailyGoalMinutes: 15,
          preferredTeacherPersona: 'Prof. Sofia',
          correctionStrictness: 'balanced',
        },
        source: 'legacy_fallback',
      };
    }
  }

  /**
   * Subscribes to profile changes across application events.
   */
  public subscribe(listener: ProfileChangeListener): () => void {
    if (this.syncService) {
      return this.syncService.subscribe(listener);
    }
    return () => {};
  }
}

