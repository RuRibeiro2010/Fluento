import { LessonEntity } from '../entities/lesson.entity';
import { LessonId } from '../value-objects/lesson-id.vo';
import { LessonObjective } from '../value-objects/lesson-objective.vo';
import { LessonStatus } from '../value-objects/lesson-status.vo';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';

export class LessonFactory {
  public static createSampleNegotiationLesson(id = 'lsn_negotiation_01'): LessonEntity {
    return LessonEntity.create(LessonId.create(id), {
      title: 'Simulação de Negociação Comercial em Espanhol',
      objective: LessonObjective.create({
        title: 'Dominar Expressões de Negociação e Acordos',
        description: 'Aprender conectores formais, condicionais e saudações profissionais para reuniões executivas.',
        keyCompetencies: ['Uso do condicional simples', 'Expressões de persuasão diplomática', 'Vocabulário corporativo'],
        targetSkill: 'Speaking & Business Grammar',
      }),
      cefrLevel: CEFRLevel.create('B2'),
      estimatedMinutes: 20,
      topicTag: 'negócios',
      scenarioRoleplay: 'Reunião de negociação de prazos e valores de um contrato internacional com cliente de Madrid.',
      status: LessonStatus.create('available'),
      createdAt: TimeStamp.now(),
      updatedAt: TimeStamp.now(),
    });
  }
}
