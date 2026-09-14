import { StudentEntity } from '../../domain/student/entities/student.entity';
import { TeacherEntity } from '../../domain/teacher/entities/teacher.entity';
import { LessonEntity } from '../../domain/lesson/entities/lesson.entity';
import { SessionEntity } from '../../domain/session/entities/session.entity';
import { StudentAnalyticsEntity } from '../../domain/analytics/entities/student-analytics.entity';
import { LearningAnalyticsService } from '../../domain/analytics/services/learning-analytics.service';
import { StudyPlanEntity } from '../../domain/learning/entities/study-plan.entity';
import { LearningPathService } from '../../domain/learning/services/learning-path.service';
import { SubscriptionEntity } from '../../domain/billing/entities/subscription.entity';
import { TrackedWordEntity } from '../../domain/memory/entities/tracked-word.entity';
import { AiPromptContextEntity } from '../../domain/ai/entities/ai-prompt-context.entity';
import { AiPedagogicalPromptService } from '../../domain/ai/services/ai-pedagogical-prompt.service';
import {
  StudentDTO,
  TeacherDTO,
  LessonDTO,
  SessionDTO,
  AnalyticsDTO,
  StudyPlanDTO,
  SubscriptionDTO,
  ReviewItemDTO,
  PromptDTO,
} from '../dto/application.dtos';

export class StudentMapper {
  public static toDTO(entity: StudentEntity): StudentDTO {
    const scores = entity.skillMatrix.scores;
    const prefs = entity.preferences;
    return {
      id: entity.id,
      email: entity.email,
      nativeLanguage: entity.nativeLanguage.code,
      targetLanguages: entity.targetLanguages.map((l) => l.code),
      currentLevel: entity.currentLevel.value,
      currentFocus: entity.currentFocus,
      motivation: prefs.topics.join(', ') || 'Aprimoramento profissional',
      active: entity.isActive,
      skillMatrix: {
        speaking: scores.speaking,
        listening: scores.listening,
        reading: scores.reading,
        writing: scores.writing,
        grammar: scores.grammar,
        vocabulary: scores.vocabulary,
      },
      preferences: {
        dailyGoalMinutes: prefs.dailyMinutes,
        preferredTeacherPersona: prefs.topics[0] || 'Prof. Sofia',
        correctionStrictness: prefs.correctionStyle,
      },
      createdAt: entity.createdAt.toISO(),
      updatedAt: entity.updatedAt.toISO(),
    };
  }
}

export class TeacherMapper {
  public static toDTO(entity: TeacherEntity): TeacherDTO {
    const persona = entity.persona;
    return {
      id: entity.id,
      name: persona.name,
      bio: persona.bio,
      accentRegion: persona.accent,
      personaStyle: persona.personality,
      isAiPersona: true,
      active: entity.isActive,
      specialities: [persona.specialty],
    };
  }
}

export class LessonMapper {
  public static toDTO(entity: LessonEntity): LessonDTO {
    return {
      id: entity.id,
      title: entity.title,
      targetLevel: entity.cefrLevel.value,
      status: entity.status.state,
      teacherId: 'tch_01',
      estimatedMinutes: entity.estimatedMinutes,
      primaryCompetency: entity.topicTag,
      objectives: [entity.objective.description],
    };
  }
}

export class SessionMapper {
  public static toDTO(entity: SessionEntity): SessionDTO {
    const totalUtterances = entity.turns.reduce(
      (acc, t) => acc + (t.userUtterance ? 1 : 0) + (t.teacherUtterance ? 1 : 0),
      0
    );

    let wordsSpokenCount = 0;
    for (const t of entity.turns) {
      if (t.userUtterance) {
        wordsSpokenCount += t.userUtterance.wordCount;
      }
    }

    return {
      id: entity.id,
      lessonId: entity.lessonId,
      studentId: entity.studentId,
      teacherId: entity.teacherId,
      active: entity.state === 'active',
      startTime: entity.startedAt.toISO(),
      endTime: entity.endedAt?.toISO(),
      turnCount: entity.turns.length,
      totalUtterances,
      metrics: {
        wordsSpokenCount,
        averageFluencyScore: entity.overallScore || 75,
        grammarAccuracyPercent: 88,
        pronunciationScore: 82,
      },
    };
  }
}

export class AnalyticsMapper {
  private static analyticsService = new LearningAnalyticsService();

  public static toDTO(entity: StudentAnalyticsEntity): AnalyticsDTO {
    const velocity = this.analyticsService.evaluateLearningVelocity(entity);
    return {
      studentId: entity.studentId,
      weeklySessions: entity.weeklyStats.sessionsCompleted,
      weeklyMinutes: entity.weeklyStats.totalMinutesPracticed,
      monthlySessions: entity.monthlyStats.sessionsCompleted,
      monthlyMinutes: entity.monthlyStats.totalMinutesPracticed,
      wordsLearnedCount: entity.monthlyStats.wordsLearnedCount,
      grammarRulesMastered: entity.monthlyStats.grammarRulesMasteredCount,
      averageAccuracyPercent: entity.monthlyStats.averageAccuracyPercent,
      fluencyIndex: {
        overallScore: entity.fluencyIndex.overallScore.value,
        confidenceScore: entity.fluencyIndex.confidenceScore.value,
        spontaneityScore: entity.fluencyIndex.spontaneityScore.value,
      },
      learningVelocity: velocity,
    };
  }
}

export class StudyPlanMapper {
  private static learningPathService = new LearningPathService();

  public static toDTO(entity: StudyPlanEntity): StudyPlanDTO {
    return {
      id: entity.id,
      studentId: entity.studentId,
      primaryObjective: entity.primaryObjective,
      estimatedEvolutionMonths: entity.estimatedEvolutionMonths,
      progressPercentage: this.learningPathService.calculateProgressPercentage(entity),
      keyCompetencies: entity.keyCompetencies,
      missions: entity.missions.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        isCompleted: m.isCompleted,
        competencyId: m.targetCompetency.value,
      })),
    };
  }
}

export class SubscriptionMapper {
  public static toDTO(entity: SubscriptionEntity): SubscriptionDTO {
    return {
      studentId: entity.studentId,
      planTier: entity.plan.tier,
      monthlyPriceEur: entity.plan.monthlyPriceEur,
      status: entity.status,
      sessionsUsedThisMonth: entity.quota.sessionsUsedThisMonth,
      monthlyLimit: entity.quota.monthlyLimit,
      remainingSessions: Math.max(0, entity.quota.monthlyLimit - entity.quota.sessionsUsedThisMonth),
      cycleInterval: entity.cycle.interval,
      periodEnd: entity.currentPeriodEnd.toISO(),
    };
  }
}

export class ReviewItemMapper {
  public static toDTO(entity: TrackedWordEntity): ReviewItemDTO {
    return {
      id: entity.id,
      word: entity.word,
      translation: entity.translation,
      state: entity.state.state,
      intervalDays: entity.srsData.intervalDays,
      repetitions: entity.srsData.repetitions,
      easeFactor: entity.srsData.easeFactor,
      nextReviewDate: entity.srsData.nextReviewDate.toISOString(),
      timesUsedCorrectly: entity.timesUsedCorrectly,
      errorCount: entity.errorCount,
    };
  }
}

export class PromptMapper {
  private static promptService = new AiPedagogicalPromptService();

  public static toDTO(entity: AiPromptContextEntity): PromptDTO {
    return {
      contextId: entity.id,
      teacherName: entity.teacherPersonaName,
      studentLevel: entity.studentLevel,
      fullSystemPrompt: this.promptService.buildFullSystemPrompt(entity),
      modelAlias: entity.modelAlias.alias,
      temperature: entity.temperature,
    };
  }
}
