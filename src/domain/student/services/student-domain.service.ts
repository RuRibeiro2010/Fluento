import { StudentEntity } from '../entities/student.entity';
import { SkillMatrix } from '../value-objects/skill-matrix.vo';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';

export class StudentDomainService {
  /**
   * Evaluates whether a student is ready to transition to the next CEFR level based on skill matrix scores.
   */
  public evaluateCEFRLevelTransition(student: StudentEntity): {
    eligible: boolean;
    recommendedLevel?: CEFRLevel;
    weakestSkills: string[];
  } {
    const matrix = student.skillMatrix.scores;
    const avgScore = student.skillMatrix.getAverageScore();
    const current = student.currentLevel.value;

    const weakSkills: string[] = [];
    if (matrix.grammar < 60) weakSkills.push('Gramática');
    if (matrix.vocabulary < 60) weakSkills.push('Vocabulário');
    if (matrix.speaking < 60) weakSkills.push('Fluência Oral');
    if (matrix.listening < 60) weakSkills.push('Compreensão Auditiva');

    let nextLevelStr = current;
    if (avgScore >= 80) {
      if (current === 'A1') nextLevelStr = 'A2';
      else if (current === 'A2') nextLevelStr = 'B1';
      else if (current === 'B1') nextLevelStr = 'B2';
      else if (current === 'B2') nextLevelStr = 'C1';
      else if (current === 'C1') nextLevelStr = 'C2';
    }

    const eligible = nextLevelStr !== current && weakSkills.length === 0;

    return {
      eligible,
      recommendedLevel: eligible ? CEFRLevel.create(nextLevelStr) : undefined,
      weakestSkills: weakSkills,
    };
  }
}
