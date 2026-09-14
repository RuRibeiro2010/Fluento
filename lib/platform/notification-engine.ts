/**
 * Notification Engine Module (Fluento Platform Ecosystem - Phase 17)
 * Intelligent, respectful notification dispatch that adheres to quiet hours,
 * vacations, timezones, and individual cognitive fatigue.
 */

export interface UserNotificationPreferences {
  quietHoursStart: number; // e.g. 22 (10 PM)
  quietHoursEnd: number; // e.g. 8 (8 AM)
  isVacationModeActive: boolean;
  timezoneOffsetHours: number;
  maxNotificationsPerWeek: number;
}

export interface IntelligentNotification {
  id: string;
  type: 'review_reminder' | 'encouragement' | 'milestone_celebration' | 'quiet_nudge';
  title: string;
  body: string;
  shouldDeliver: boolean;
  suppressionReason?: string;
}

export function evaluateNotificationDispatch(
  notification: Omit<IntelligentNotification, 'shouldDeliver' | 'suppressionReason'>,
  prefs: UserNotificationPreferences,
  currentHourLocal: number
): IntelligentNotification {
  if (prefs.isVacationModeActive) {
    return {
      ...notification,
      shouldDeliver: false,
      suppressionReason: 'Modo Férias ativo. Notificação suprimida para proteger o descanso.',
    };
  }

  const isQuietTime =
    prefs.quietHoursStart > prefs.quietHoursEnd
      ? currentHourLocal >= prefs.quietHoursStart || currentHourLocal < prefs.quietHoursEnd
      : currentHourLocal >= prefs.quietHoursStart && currentHourLocal < prefs.quietHoursEnd;

  if (isQuietTime) {
    return {
      ...notification,
      shouldDeliver: false,
      suppressionReason: 'Horário de silêncio/descanso do utilizador.',
    };
  }

  return {
    ...notification,
    shouldDeliver: true,
  };
}
