import { StudyPlanEntity } from '../entities/study-plan.entity';
import { MissionEntity } from '../entities/mission.entity';
import { CompetencyId } from '../value-objects/competency-id.vo';
import { TimeStamp } from '../../shared/value-objects/time-stamp.vo';

export class StudyPlanFactory {
  public static createDefaultPlanForStudent(studentId: string, objective: string): StudyPlanEntity {
    const mission1 = MissionEntity.create('msn_01', {
      title: 'Apresentação Profissional Fluente',
      description: 'Aprender a fazer uma introdução executiva de 2 minutos em espanhol sem hesitações.',
      targetCompetency: CompetencyId.create('cmp_speaking_intro'),
      completed: false,
    });

    const mission2 = MissionEntity.create('msn_02', {
      title: 'Domínio de Conectores Discursivos',
      description: 'Usar sin embargo, por lo tanto, e no obstante em simulações corporativas.',
      targetCompetency: CompetencyId.create('cmp_grammar_connectors'),
      completed: false,
    });

    return StudyPlanEntity.create(`plan_${Date.now()}`, {
      studentId,
      primaryObjective: objective || 'Fluência em conversação e negócios',
      keyCompetencies: ['Fluência Verbal', 'Vocabulário Corporativo', 'Gramática Prática'],
      estimatedEvolutionMonths: 3,
      missions: [mission1, mission2],
      createdAt: TimeStamp.now(),
      updatedAt: TimeStamp.now(),
    });
  }
}
