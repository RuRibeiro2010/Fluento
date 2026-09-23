import { UserProfile } from '@/types/profile';
import { 
  LongitudinalMemory, 
  DailyCoachMessage, 
  SundayWeeklyReview,
  MonthlyEvolutionData
} from '@/types/coach';
import { StudyPlan } from '@/types/study-plan';
import { Lesson } from '@/types/lesson';
import { 
  StudentMinimalContextDTO, 
  LessonSessionContextDTO 
} from '../dto/conversation.dtos';

import { 
  AssessmentTurnResponse, 
  AssessmentResult,
  AssessmentAiSelfValidation
} from '../../domain/assessment/types';

/**
 * ASSESSMENT TYPES (Migrated to Domain)
 */
export type { AssessmentTurnResponse, AssessmentResult, AssessmentAiSelfValidation };

/**
 * COACH AI SERVICE PORT
 */
export interface ICoachAiService {
  createInitialLongitudinalMemory(userId: string, targetLanguage: string, profile?: Partial<UserProfile>): LongitudinalMemory;
  generateDailyCoachMessage(profile: Partial<UserProfile>, memory?: LongitudinalMemory): Promise<DailyCoachMessage>;
  generateSundayWeeklyReview(profile: Partial<UserProfile>, memory?: LongitudinalMemory): Promise<SundayWeeklyReview>;
  generateStudyPlan(profile: Partial<UserProfile>, targetLanguage: string, nativeLanguage: string): Promise<StudyPlan>;
  generateMonthlyEvolutionData(profile: Partial<UserProfile>, memory?: LongitudinalMemory): MonthlyEvolutionData;
}

/**
 * LESSON GENERATOR AI SERVICE PORT
 */
export interface ILessonGeneratorAiService {
  generateLesson(
    targetLanguage: string,
    nativeLanguage: string,
    topic: string,
    difficulty: string,
    profile?: Partial<UserProfile>,
    memory?: LongitudinalMemory
  ): Promise<Lesson>;
}

/**
 * ASSESSMENT AI SERVICE PORT
 */
export interface IAssessmentAiService {
  evaluateUserLevelMultimodal(turns: AssessmentTurnResponse[], targetLanguage: string): Promise<AssessmentResult>;
  calculateNextAdaptiveDifficulty(currentDifficulty: number, lastTurn: AssessmentTurnResponse): number;
}

/**
 * CONVERSATION AI SERVICE PORT
 * 
 * Represents ONLY the AI responsibility of Lesson Conversation.
 */
export interface IConversationAiService {
  generateGreeting(
    student: StudentMinimalContextDTO,
    lesson: LessonSessionContextDTO,
    sessionId: string
  ): Promise<string>;

  generateResponse(
    student: StudentMinimalContextDTO,
    lesson: LessonSessionContextDTO,
    studentUtterance: string,
    sessionId: string,
    onStreamChunk?: (delta: string) => void
  ): Promise<string>;
}
