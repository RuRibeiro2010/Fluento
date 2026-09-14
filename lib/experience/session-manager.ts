import { MicroBreakRecommendation, SessionSummary } from '@/types/experience';
import { StudentModel, WeaknessAnalysis } from '@/types/brain';
import { ImmersionService, defaultImmersionService } from './immersion';
import { LessonFlowService, defaultLessonFlowService } from './lesson-flow';
import { MotivationService, defaultMotivationService } from './motivation';
import { EncouragementService, defaultEncouragementService } from './encouragement';
import { MicroBreakService, defaultMicroBreakService } from './breaks';
import { AchievementService, defaultAchievementService } from './achievements';
import { NotificationService, defaultNotificationService } from './notifications';

export interface ActiveSessionState {
  sessionId: string;
  studentId: string;
  startTimeIso: string;
  durationMinutes: number;
  completedActivitiesCount: number;
  recentErrors: string[];
  newWordsLearned: string[];
  startingConfidence: number;
  currentConfidence: number;
  consecutiveSuccesses: number;
  consecutiveErrors: number;
  currentActivityType: string;
}

/**
 * Session Manager
 * Orchestrates real-time pedagogical flow during a Virtual Teacher session.
 * Decides when to encourage, take micro-breaks, shift difficulty, switch activities,
 * and compiles comprehensive session ending summaries.
 */
export class SessionManager {
  private immersionService: ImmersionService;
  private lessonFlowService: LessonFlowService;
  private motivationService: MotivationService;
  private encouragementService: EncouragementService;
  private microBreakService: MicroBreakService;
  private achievementService: AchievementService;
  private notificationService: NotificationService;

  private activeSession: ActiveSessionState | null = null;

  constructor(
    immersionService: ImmersionService = defaultImmersionService,
    lessonFlowService: LessonFlowService = defaultLessonFlowService,
    motivationService: MotivationService = defaultMotivationService,
    encouragementService: EncouragementService = defaultEncouragementService,
    microBreakService: MicroBreakService = defaultMicroBreakService,
    achievementService: AchievementService = defaultAchievementService,
    notificationService: NotificationService = defaultNotificationService
  ) {
    this.immersionService = immersionService;
    this.lessonFlowService = lessonFlowService;
    this.motivationService = motivationService;
    this.encouragementService = encouragementService;
    this.microBreakService = microBreakService;
    this.achievementService = achievementService;
    this.notificationService = notificationService;
  }

  /**
   * Starts a new active learning session
   */
  public startSession(studentModel: StudentModel): ActiveSessionState {
    const session: ActiveSessionState = {
      sessionId: `sess-${Date.now()}`,
      studentId: studentModel.userId,
      startTimeIso: new Date().toISOString(),
      durationMinutes: 0,
      completedActivitiesCount: 0,
      recentErrors: [],
      newWordsLearned: [],
      startingConfidence: studentModel.confidenceScore || 70,
      currentConfidence: studentModel.confidenceScore || 70,
      consecutiveSuccesses: 0,
      consecutiveErrors: 0,
      currentActivityType: 'conversation',
    };

    this.activeSession = session;
    return { ...session };
  }

  /**
   * Process a real-time event during session (e.g. correct answer, error, time elapsed)
   */
  public processSessionTurn(
    turnData: {
      isCorrect: boolean;
      errorMsg?: string;
      newWordIntroduced?: string;
      timeElapsedSeconds: number;
    },
    studentModel: StudentModel
  ): {
    breakRecommendation: MicroBreakRecommendation;
    encouragementMessage?: string;
    shouldSwitchActivity: boolean;
    recommendedNextActivity?: string;
  } {
    if (!this.activeSession) {
      this.startSession(studentModel);
    }

    const session = this.activeSession!;
    session.durationMinutes += Math.round(turnData.timeElapsedSeconds / 60);

    if (turnData.isCorrect) {
      session.consecutiveSuccesses += 1;
      session.consecutiveErrors = 0;
      session.currentConfidence = Math.min(100, session.currentConfidence + 1);
    } else {
      session.consecutiveErrors += 1;
      session.consecutiveSuccesses = 0;
      session.currentConfidence = Math.max(30, session.currentConfidence - 2);
      if (turnData.errorMsg) {
        session.recentErrors.push(turnData.errorMsg);
      }
    }

    if (turnData.newWordIntroduced) {
      session.newWordsLearned.push(turnData.newWordIntroduced);
    }

    // Evaluate Micro-Break Needs
    const breakRecommendation = this.microBreakService.evaluateBreakNeeds(
      session.durationMinutes,
      turnData.timeElapsedSeconds,
      session.consecutiveErrors
    );

    // Contextual Encouragement
    let encouragementMessage: string | undefined = undefined;
    if (session.consecutiveSuccesses >= 3 || session.consecutiveErrors >= 2) {
      const enc = this.encouragementService.generateEncouragement(
        studentModel,
        session.currentActivityType,
        session.currentConfidence - session.startingConfidence
      );
      encouragementMessage = enc.message;
    }

    // Activity Switch logic
    let shouldSwitchActivity = false;
    let recommendedNextActivity: string | undefined = undefined;

    if (session.consecutiveSuccesses >= 5) {
      shouldSwitchActivity = true;
      recommendedNextActivity = 'unscripted_roleplay_challenge';
    } else if (session.consecutiveErrors >= 3) {
      shouldSwitchActivity = true;
      recommendedNextActivity = 'guided_scaffolding_drill';
    }

    return {
      breakRecommendation,
      encouragementMessage,
      shouldSwitchActivity,
      recommendedNextActivity,
    };
  }

  /**
   * Finalizes session and compiles full comprehensive summary
   */
  public endSession(
    studentModel: StudentModel,
    weaknessAnalysis: WeaknessAnalysis
  ): SessionSummary {
    if (!this.activeSession) {
      this.startSession(studentModel);
    }

    const session = this.activeSession!;
    const duration = Math.max(5, session.durationMinutes || 15);
    const xpEarned = Math.round(duration * 12 + session.newWordsLearned.length * 15);

    const langUpper = (studentModel.targetLanguage || 'ES').toUpperCase();

    const summary: SessionSummary = {
      sessionId: session.sessionId,
      sessionDurationMinutes: duration,
      totalXpEarned: xpEarned,
      newVocabularyMastered: [...new Set(session.newWordsLearned)],
      keyErrorsObserved: [...new Set(session.recentErrors)].slice(0, 3),
      startingConfidence: session.startingConfidence,
      endingConfidence: session.currentConfidence,
      flowStateRatio: 0.95,
      coachRecommendation: `Solid 15-minute immersion in ${langUpper}. Your confidence evolved from ${session.startingConfidence}% to ${session.currentConfidence}%. Focus on active usage of newly acquired terms in our next roleplay.`,
      nextSessionObjective: `Deepen fluency in ${studentModel.currentFocusArea || 'unscripted dialogue'} and solidify ${session.newWordsLearned.length} newly mastered vocabulary terms.`,
      completedAt: new Date().toISOString(),
    };

    // Reset active session
    this.activeSession = null;

    return summary;
  }
}

export const defaultSessionManager = new SessionManager();
