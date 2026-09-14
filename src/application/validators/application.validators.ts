import { ValidationError } from '../errors/application-error';
import {
  StartLessonCommand,
  FinishLessonCommand,
  UpdateStudentCommand,
  StartSessionCommand,
  FinishSessionCommand,
  UpgradeSubscriptionCommand,
  ReviewWordCommand,
  CreateStudyPlanCommand,
} from '../commands/application.commands';

export class StudentValidator {
  public static validateUpdateCommand(cmd: UpdateStudentCommand): void {
    if (!cmd.studentId || cmd.studentId.trim() === '') {
      throw new ValidationError('Student ID is required for update.');
    }
    if (cmd.dailyGoalMinutes !== undefined && (cmd.dailyGoalMinutes < 1 || cmd.dailyGoalMinutes > 300)) {
      throw new ValidationError('Daily goal must be between 1 and 300 minutes.');
    }
  }
}

export class LessonValidator {
  public static validateStartCommand(cmd: StartLessonCommand): void {
    if (!cmd.lessonId || cmd.lessonId.trim() === '') {
      throw new ValidationError('Lesson ID is required to start lesson.');
    }
    if (!cmd.studentId || cmd.studentId.trim() === '') {
      throw new ValidationError('Student ID is required to start lesson.');
    }
  }

  public static validateFinishCommand(cmd: FinishLessonCommand): void {
    if (!cmd.lessonId || cmd.lessonId.trim() === '') {
      throw new ValidationError('Lesson ID is required to finish lesson.');
    }
    if (cmd.finalScore < 0 || cmd.finalScore > 100) {
      throw new ValidationError('Final score must be between 0 and 100.');
    }
  }
}

export class SessionValidator {
  public static validateStartCommand(cmd: StartSessionCommand): void {
    if (!cmd.lessonId || !cmd.studentId) {
      throw new ValidationError('Lesson ID and Student ID are required for session startup.');
    }
  }

  public static validateFinishCommand(cmd: FinishSessionCommand): void {
    if (!cmd.sessionId || cmd.sessionId.trim() === '') {
      throw new ValidationError('Session ID is required to finish session.');
    }
  }
}

export class SubscriptionValidator {
  public static validateUpgradeCommand(cmd: UpgradeSubscriptionCommand): void {
    if (!cmd.studentId) {
      throw new ValidationError('Student ID is required for subscription upgrade.');
    }
    if (!['free', 'pro', 'executive'].includes(cmd.targetPlanTier)) {
      throw new ValidationError(`Invalid target plan tier '${cmd.targetPlanTier}'.`);
    }
  }
}

export class MemoryValidator {
  public static validateReviewWordCommand(cmd: ReviewWordCommand): void {
    if (!cmd.studentId || !cmd.wordId) {
      throw new ValidationError('Student ID and Word ID are required for vocabulary review.');
    }
    if (cmd.qualityScore < 0 || cmd.qualityScore > 5) {
      throw new ValidationError('SuperMemo quality score must be between 0 and 5.');
    }
  }
}

export class StudyPlanValidator {
  public static validateCreatePlanCommand(cmd: CreateStudyPlanCommand): void {
    if (!cmd.studentId) {
      throw new ValidationError('Student ID is required to create a study plan.');
    }
    if (!cmd.primaryObjective || cmd.primaryObjective.trim().length < 5) {
      throw new ValidationError('Primary objective must be at least 5 characters long.');
    }
  }
}
