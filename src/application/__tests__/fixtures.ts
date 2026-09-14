import { StudentEntity } from '../../domain/student/entities/student.entity';
import { StudentId } from '../../domain/student/value-objects/student-id.vo';
import { CEFRLevel } from '../../domain/shared/value-objects/cefr-level.vo';
import { LanguageCode } from '../../domain/shared/value-objects/language-code.vo';
import { SkillMatrix } from '../../domain/student/value-objects/skill-matrix.vo';
import { LearningPreferences } from '../../domain/student/value-objects/learning-preferences.vo';
import { TimeStamp } from '../../domain/shared/value-objects/time-stamp.vo';

import { LessonEntity } from '../../domain/lesson/entities/lesson.entity';
import { LessonId } from '../../domain/lesson/value-objects/lesson-id.vo';
import { LessonStatus } from '../../domain/lesson/value-objects/lesson-status.vo';
import { LessonObjective } from '../../domain/lesson/value-objects/lesson-objective.vo';

import { IAiProviderPort } from '../../domain/ai/repositories/ai-provider-port.interface';

/**
 * TEST FIXTURES
 *
 * Sprint 16A.4.1 (Architecture Hardening): this file previously also
 * held the `InMemory*Repository` classes and the `Fake` infrastructure
 * adapters (`FakeEventPublisher`, `FakeLogger`, `FakeClockProvider`,
 * `FakeUuidGenerator`) that `application-container.ts` used to wire up
 * production. That was a layering violation - production code should
 * never import from a `__tests__` directory.
 *
 * Those implementations have been moved to:
 *   - src/application/adapters/storage/in-memory/   (repositories)
 *   - src/application/adapters/infrastructure/       (event publisher, logger, clock, uuid generator)
 *
 * Production now imports from those locations. Tests that need those
 * same in-memory adapters import them from there too - that is
 * allowed (tests may depend on production code; production may not
 * depend on tests). See the updated imports in `application.test.ts`,
 * `student-profile-sync.test.ts`, `lesson-room-conversation.test.ts`
 * and `adapters/__tests__/adapters.test.ts`.
 *
 * What remains in this file are genuine test-only helpers that are
 * never referenced by production code: a canned/fake AI provider port
 * and sample entity factories for building test fixtures quickly.
 */

export class FakeAiProviderPort implements IAiProviderPort {
  public async generateTextResponse(): Promise<{
    responseText: string;
    suggestedCorrections?: string[];
    grammarScore?: number;
    latencyMs: number;
  }> {
    return {
      responseText: '¡Excelente observación! ¿Podrías explicármelo con un ejemplo corporativo?',
      suggestedCorrections: ['Asegúrate de usar la entonación correcta al hacer preguntas.'],
      grammarScore: 92,
      latencyMs: 140,
    };
  }
}

export function createSampleStudent(id = 'std_test_01'): StudentEntity {
  return StudentEntity.create(StudentId.create(id), {
    email: 'estudante@fluento.app',
    nativeLanguage: LanguageCode.create('pt'),
    targetLanguages: [LanguageCode.create('es')],
    currentLevel: CEFRLevel.create('B1'),
    skillMatrix: SkillMatrix.defaultInitial(),
    preferences: LearningPreferences.create({}),
    currentFocus: 'Fluência Corporativa',
    motivation: 'Apresentações de trabalho',
    active: true,
    createdAt: TimeStamp.now(),
    updatedAt: TimeStamp.now(),
  });
}

export function createSampleLesson(id = 'lsn_test_01', teacherId = 'tch_test_01'): LessonEntity {
  return LessonEntity.create(LessonId.create(id), {
    title: 'Negociação Executiva em Espanhol',
    cefrLevel: CEFRLevel.create('B2'),
    status: LessonStatus.create('available'),
    estimatedMinutes: 20,
    topicTag: 'Negociação Verbal',
    objective: LessonObjective.create({
      title: 'Vocabulário Comercial',
      description: 'Domínio de vocabulário comercial para reuniões',
      keyCompetencies: ['negociacao'],
      targetSkill: 'speaking',
    }),
    createdAt: TimeStamp.now(),
    updatedAt: TimeStamp.now(),
  });
}
