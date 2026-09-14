import { TeacherEntity } from '../entities/teacher.entity';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';
import { PersonalityStyle } from '../value-objects/teacher-persona.vo';

export class TeacherSelectionService {
  /**
   * Selects the optimal AI Teacher for a student based on CEFR level and preferred personality.
   */
  public selectOptimalTeacher(
    availableTeachers: TeacherEntity[],
    studentLevel: CEFRLevel,
    preferredPersonality?: PersonalityStyle
  ): TeacherEntity | null {
    const level = studentLevel.value;
    const compatible = availableTeachers.filter((t) => t.isActive && t.supportsLevel(level));

    if (compatible.length === 0) {
      return availableTeachers.find((t) => t.isActive) || null;
    }

    if (preferredPersonality) {
      const match = compatible.find((t) => t.persona.personality === preferredPersonality);
      if (match) return match;
    }

    return compatible[0];
  }
}
