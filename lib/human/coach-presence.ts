/**
 * Coach Presence Module (Fluento Human Experience - Phase 19)
 * Provides warm, humanlike greetings, active presence indicators,
 * natural speech pauses, and non-robotic session closings.
 */

export interface CoachPresenceState {
  teacherName: string;
  isOnlineAndAttentive: boolean;
  openingGreeting: string;
  closingStatement: string;
}

export function generateCoachPresenceState(
  teacherName: string = 'Prof. Sofia',
  studentName: string = 'Aluno',
  timeOfDay: 'morning' | 'afternoon' | 'evening' = 'afternoon'
): CoachPresenceState {
  let timeGreeting = 'Boa tarde';
  if (timeOfDay === 'morning') timeGreeting = 'Bom dia';
  if (timeOfDay === 'evening') timeGreeting = 'Boa noite';

  return {
    teacherName,
    isOnlineAndAttentive: true,
    openingGreeting: `${timeGreeting}, ${studentName}! Estou pronta para a nossa sessão de hoje. Como te sentes para começar?`,
    closingStatement: `Excelente trabalho hoje, ${studentName}. Vemo-nos na nossa próxima conversa para continuar a consolidar a tua fluência!`,
  };
}
