/**
 * Lesson Director Module (Live Experience Engine)
 * Automatically decides the session goal, target duration, target skills,
 * and pedagogical strategy before a live conversation session begins.
 */

import { LessonMode } from './lesson-modes';

export interface StudentProfileContext {
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  targetLanguage: string;
  nativeLanguage: string;
  preferredTopics: string[];
  recentWeaknesses: string[];
  optimalSessionMinutes: number;
}

export interface PlannedSessionDirectorConfig {
  sessionId: string;
  primaryGoal: string;
  recommendedMode: LessonMode;
  targetDurationMinutes: number;
  focusedSkills: Array<'speaking' | 'listening' | 'grammar' | 'vocabulary' | 'pronunciation'>;
  pedagogicalStrategyRationale: string;
  suggestedMissions: string[];
  initialDifficultyLevel: number; // 0.0 (easiest) to 1.0 (most challenging)
}

export function planLiveSession(
  student: StudentProfileContext,
  requestedModeOverride?: LessonMode
): PlannedSessionDirectorConfig {
  const sessionId = `live-session-${Date.now()}`;
  const duration = Math.min(30, Math.max(5, student.optimalSessionMinutes || 15));

  // Determine difficulty level baseline from CEFR
  const cefrDifficultyMap: Record<string, number> = {
    A1: 0.30,
    A2: 0.45,
    B1: 0.60,
    B2: 0.75,
    C1: 0.88,
    C2: 0.95,
  };
  const initialDifficultyLevel = cefrDifficultyMap[student.cefrLevel] || 0.60;

  // Determine mode
  let recommendedMode: LessonMode = requestedModeOverride || 'real_situations';
  if (!requestedModeOverride) {
    if (student.recentWeaknesses.includes('pronunciation')) {
      recommendedMode = 'pronunciation_coach';
    } else if (student.recentWeaknesses.includes('grammar')) {
      recommendedMode = 'grammar_lab';
    } else if (student.cefrLevel === 'B2' || student.cefrLevel === 'C1') {
      recommendedMode = 'free_conversation';
    }
  }

  // Determine focused skills
  const focusedSkills: PlannedSessionDirectorConfig['focusedSkills'] = ['speaking', 'listening'];
  if (student.recentWeaknesses.includes('vocabulary')) focusedSkills.push('vocabulary');
  if (student.recentWeaknesses.includes('grammar')) focusedSkills.push('grammar');

  // Rationale based on evidence
  const pedagogicalStrategyRationale = `Sessão personalizada para nível ${student.cefrLevel} com foco prioritário na comunicação fluida e prática de ${focusedSkills.join(', ')}.`;

  return {
    sessionId,
    primaryGoal: `Prática imersiva de comunicação em ${student.targetLanguage} com foco em ${student.recentWeaknesses[0] || 'fluência geral'}.`,
    recommendedMode,
    targetDurationMinutes: duration,
    focusedSkills,
    pedagogicalStrategyRationale,
    suggestedMissions: ['hotel_checkin', 'restaurant_order', 'business_meeting', 'airport_navigation'],
    initialDifficultyLevel,
  };
}
