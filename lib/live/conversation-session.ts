/**
 * Conversation Session Module (Live Experience Engine)
 * Manages the real-time live conversation state, timing, dialogue turns,
 * active mode, mission status, audio parameters, and pause controls.
 */

import { LessonMode } from './lesson-modes';

export interface LiveTranscriptTurn {
  id: string;
  speaker: 'user' | 'teacher';
  text: string;
  timestampMs: number;
  audioUrl?: string; // Optional recorded audio asset
  durationMs?: number;
  detectedHesitations?: boolean;
  annotations?: Array<{
    term: string;
    explanation: string;
    type: 'vocabulary' | 'grammar' | 'pronunciation';
  }>;
}

export interface LiveConversationSessionState {
  sessionId: string;
  userId: string;
  activeMode: LessonMode;
  activeMissionId?: string;
  startTimeMs: number;
  lastActivityMs: number;
  isPaused: boolean;
  turns: LiveTranscriptTurn[];
  userTurnCount: number;
  teacherTurnCount: number;
  totalUserSpeechTimeMs: number;
  totalTeacherSpeechTimeMs: number;
  activeDifficultyLevel: number; // 0.0 to 1.0
}

export function createLiveConversationSession(
  sessionId: string,
  userId: string,
  initialMode: LessonMode = 'real_situations',
  initialDifficulty: number = 0.60,
  activeMissionId?: string
): LiveConversationSessionState {
  const now = Date.now();
  return {
    sessionId,
    userId,
    activeMode: initialMode,
    activeMissionId,
    startTimeMs: now,
    lastActivityMs: now,
    isPaused: false,
    turns: [],
    userTurnCount: 0,
    teacherTurnCount: 0,
    totalUserSpeechTimeMs: 0,
    totalTeacherSpeechTimeMs: 0,
    activeDifficultyLevel: initialDifficulty,
  };
}

export function recordLiveTurn(
  session: LiveConversationSessionState,
  speaker: 'user' | 'teacher',
  text: string,
  durationMs?: number,
  annotations?: LiveTranscriptTurn['annotations']
): LiveConversationSessionState {
  const now = Date.now();
  const newTurn: LiveTranscriptTurn = {
    id: `turn-${now}-${Math.random().toString(36).slice(2, 6)}`,
    speaker,
    text,
    timestampMs: now,
    durationMs,
    annotations,
  };

  const isUser = speaker === 'user';
  const speechTime = durationMs || Math.round((text.split(' ').length / 2.5) * 1000);

  return {
    ...session,
    lastActivityMs: now,
    turns: [...session.turns, newTurn],
    userTurnCount: isUser ? session.userTurnCount + 1 : session.userTurnCount,
    teacherTurnCount: !isUser ? session.teacherTurnCount + 1 : session.teacherTurnCount,
    totalUserSpeechTimeMs: isUser ? session.totalUserSpeechTimeMs + speechTime : session.totalUserSpeechTimeMs,
    totalTeacherSpeechTimeMs: !isUser ? session.totalTeacherSpeechTimeMs + speechTime : session.totalTeacherSpeechTimeMs,
  };
}

export function toggleSessionPause(
  session: LiveConversationSessionState
): LiveConversationSessionState {
  return {
    ...session,
    isPaused: !session.isPaused,
    lastActivityMs: Date.now(),
  };
}
