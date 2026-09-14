export type ConversationMode = 'free_conversation' | 'scenario';

export type CorrectionMode = 'relaxed' | 'balanced' | 'strict';

export interface TeacherPersona {
  id: string;
  name: string;
  role: string;
  avatar: string; // Emoji or image URL
  description: string;
  scenarioTitle?: string;
  situationContext?: string;
  suggestedOpening: string;
  personalityTraits: string[];
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  category: 'social' | 'business' | 'daily_life' | 'travel' | 'medical';
  speechTempo?: 'calm' | 'energetic' | 'structured' | 'relaxed';
  encouragingPhrases?: string[];
  pedagogicalFocus?: string;
}

export interface CorrectionItem {
  originalText: string;
  correctedText: string;
  explanation: string;
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'style';
  severity: 'minor' | 'major';
  priority?: 'comprehension_blocking' | 'repeated_pattern' | 'goal_relevant' | 'stylistic_refinement';
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'teacher';
  text: string;
  timestamp: string;
  audioUrl?: string;
  corrections?: CorrectionItem[];
  phoneticTip?: string;
  vocabularyNotes?: { word: string; definition: string; contextExample?: string }[];
  thinkingTimeMs?: number;
  speechTempo?: string;
  adaptationNote?: string;
}

export interface VoiceSettings {
  sttSupported: boolean;
  ttsSupported: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  autoPlayTts: boolean;
  selectedVoiceName?: string;
  speechRate: number; // 0.8 to 1.2
}

export interface ConversationSession {
  id: string;
  userId: string;
  targetLanguage: string;
  mode: ConversationMode;
  character: TeacherPersona;
  correctionMode: CorrectionMode;
  messages: ConversationMessage[];
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  isCompleted: boolean;
  emotionalStateHistory?: ('confident' | 'relaxed' | 'nervous' | 'blocked' | 'short_answers')[];
  studentTalkRatioPercentage?: number;
}

export interface NewWordLearned {
  word: string;
  meaning: string;
  contextSentence: string;
  timesPracticed?: number;
  isConsolidated?: boolean;
}

export interface FrequentError {
  error: string;
  correction: string;
  category: 'grammar' | 'vocabulary' | 'syntax' | 'pronunciation' | 'style';
  timesRepeated: number;
}

export interface TeacherInternalReflection {
  studentTalkRatioPercentage: number; // e.g. 68%
  targetRatioAchieved: boolean; // >= 65% student talking time
  objectiveAchieved: boolean;
  overExplanationDetected: boolean;
  overCorrectionDetected: boolean;
  observedEmotionalTrajectory: string; // e.g. "Started nervous, gained confidence through gentle scaffolding"
  keyPedagogicalTakeaway: string;
  adaptationStrategyForNextSession: string;
}

export interface LongTermStudentInsight {
  studentId: string;
  discoveredAt: string;
  effectiveCorrectionStyle: 'buffered' | 'socratic' | 'minimal_encouragement';
  anxietyTriggers: string[];
  bestScaffoldingStrategy: string;
  consolidatedVocabulary: string[];
  recurringGrammarTraps: string[];
  notes: string;
}

export interface SessionReport {
  sessionId: string;
  characterName: string;
  mode: ConversationMode;
  targetLanguage: string;
  durationMinutes: number;
  totalUserTurns: number;
  studentTalkRatioPercentage?: number;
  
  // Quantitative Metrics (0 to 100)
  fluencyScore: number;
  pronunciationScore: number;
  grammarScore: number;
  vocabularyScore: number;
  overallGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Needs Practice';

  // Qualitative Analysis
  summaryFeedback: string;
  newWordsLearned: NewWordLearned[];
  frequentErrors: FrequentError[];
  coachRecommendations: string[];
  aiReflection?: TeacherInternalReflection;
  longTermInsightsDiscovered?: string[];
  createdAt: string;
}
