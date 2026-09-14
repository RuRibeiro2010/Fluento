import { ExperienceNotification } from '@/types/experience';
import { StudentModel } from '@/types/brain';

/**
 * Notification Service
 * Manages smart contextual notifications for student engagement, spaced repetition, and coach tips.
 */
export class NotificationService {
  private notifications: ExperienceNotification[] = [];

  /**
   * Generates smart notifications based on student state and retention needs
   */
  public generateSmartNotifications(
    studentModel: StudentModel,
    decayItemsCount: number,
    streakDays: number
  ): ExperienceNotification[] {
    const lang = studentModel.targetLanguage?.toUpperCase() || 'SPANISH';
    const now = new Date().toISOString();

    const generated: ExperienceNotification[] = [];

    if (decayItemsCount > 0) {
      generated.push({
        id: `notif-decay-${Date.now()}`,
        title: `Smart Review Ready: ${decayItemsCount} items`,
        body: `Your memory retention curve indicates ${decayItemsCount} vocabulary or grammar items in ${lang} are approaching the decay threshold (<70%). A 5-minute review session will lock them back in.`,
        category: 'review_due',
        timestamp: now,
        isRead: false,
      });
    }

    if (streakDays > 0) {
      generated.push({
        id: `notif-streak-${Date.now()}`,
        title: `Active Streak: ${streakDays} Days`,
        body: `Maintain your daily momentum in ${lang}. Today's recommended 15-minute session is tailored for your ${studentModel.currentCefr} goals.`,
        category: 'streak_reminder',
        timestamp: now,
        isRead: false,
      });
    }

    generated.push({
      id: `notif-coach-${Date.now()}`,
      title: `AI Coach Insight`,
      body: `Your confidence score in ${lang} is at ${studentModel.confidenceScore}%. Focus on speaking unscripted sentences today to boost spontaneous recall.`,
      category: 'coach_tip',
      timestamp: now,
      isRead: false,
    });

    this.notifications = [...generated, ...this.notifications];
    return [...this.notifications];
  }

  public getNotifications(): ExperienceNotification[] {
    return [...this.notifications];
  }

  public markAsRead(notificationId: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
  }
}

export const defaultNotificationService = new NotificationService();
