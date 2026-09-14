import { LessonEntity } from '../entities/lesson.entity';
import { CEFRLevel } from '../../shared/value-objects/cefr-level.vo';

export class LessonAdaptationService {
  /**
   * Recommends the next most suitable lesson based on a student's CEFR level and recent weak topics.
   */
  public recommendNextLesson(
    availableLessons: LessonEntity[],
    studentLevel: CEFRLevel,
    weakTopics: string[] = []
  ): LessonEntity | null {
    // 1. Filter by level match
    const matchingLevel = availableLessons.filter((l) => l.cefrLevel.equals(studentLevel));

    if (matchingLevel.length === 0) {
      return availableLessons[0] || null;
    }

    // 2. Prioritize weak topics
    if (weakTopics.length > 0) {
      const targeted = matchingLevel.find((l) =>
        weakTopics.some((w) => l.topicTag.toLowerCase().includes(w.toLowerCase()))
      );
      if (targeted) return targeted;
    }

    return matchingLevel[0];
  }
}
