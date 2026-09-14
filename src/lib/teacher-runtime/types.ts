/**
 * FLUENTO TEACHER RUNTIME - TYPES & INTERFACES
 * 
 * Defines data structures for the Virtual Teacher's invariant DNA, profile,
 * personality traits, tone, language scaffolding, presence, empathy, feedback style,
 * guardrails, and structured directives.
 */

import { StudentLearningState } from '@/src/lib/learning-engine';
import { OrchestratorActionDirective } from '@/src/lib/conversation-orchestrator';

export type SpeechPace = 'slow_deliberate' | 'balanced' | 'natural_conversational';

export type TeacherToneType = 
  | 'warm_supportive' 
  | 'celebratory' 
  | 'gentle_guiding' 
  | 'calm_reassuring' 
  | 'curious_inquiring';

export type PortugueseScaffoldingLevel = 'none' | 'minimal' | 'moderate' | 'high';

export type VocabularyComplexity = 'A1_simple' | 'A2_accessible' | 'B1_conversational' | 'B2_expressive';

export type CorrectionStyle = 'implicit_recast' | 'positive_sandwich' | 'delayed_review' | 'ignore';

export type EndingPattern = 'open_question' | 'gentle_prompt' | 'reassuring_pause';

export interface TeacherProfile {
  teacherId: string;
  name: string;
  roleTitle: string;
  nativeLanguage: string; // 'pt-PT'
  targetLanguage: string; // 'en-US'
  corePhilosophy: string;
  avatarPersonaSummary: string;
}

export interface PersonalityTraits {
  empathyScore: number; // 0 - 100
  enthusiasmScore: number; // 0 - 100
  patienceScore: number; // 0 - 100
  formalityScore: number; // 0 - 100 (kept low e.g. 10-30 for warm approachability)
  humorFrequency: 'none' | 'subtle_light' | 'playful';
}

export interface ToneDirective {
  primaryTone: TeacherToneType;
  warmthIndex: number; // 0 - 100
  energyLevel: number; // 0 - 100
  toneGuidanceNote: string;
}

export interface LanguageDirective {
  targetLanguageRatio: number; // e.g., 80% English, 20% Portuguese
  portugueseScaffoldingLevel: PortugueseScaffoldingLevel;
  vocabularyComplexity: VocabularyComplexity;
  maxWordsPerSentence: number; // e.g. 12
  allowPortugueseClarification: boolean;
}

export interface PresenceDirective {
  conversationalRole: 'light_scaffold' | 'balanced' | 'active_guide';
  validationPrefixRequired: boolean; // e.g., always validate student effort first
  activeListeningMarkers: string[];
  speechPace: SpeechPace;
}

export interface EmpathyDirective {
  affectiveFilterAction: 'deescalate' | 'encourage' | 'celebrate' | 'steady';
  normalizerMessagePattern?: string; // e.g., "É perfeitamente normal ter dúvidas nesta estrutura..."
  warmthBoost: boolean;
  validationFocus: string;
}

export interface FeedbackDirective {
  correctionStyle: CorrectionStyle;
  maxCorrectionsPerTurn: number; // strictly 0 or 1
  praiseType: 'effort_focused' | 'fluency_focused' | 'brief_acknowledgement';
  recastingTarget?: string;
}

export interface ResponseStyleDirective {
  maxSentenceCount: number; // 1-3 sentences
  targetWordCountLimit: number; // 15-40 words
  endingPattern: EndingPattern;
  preventMonologue: boolean;
}

export interface TeacherGuardrailDirective {
  forbiddenBehaviors: string[];
  mandatoryRules: string[];
  safetyOverride: boolean;
}

export interface TeacherDirectives {
  profile: TeacherProfile;
  personality: PersonalityTraits;
  tone: ToneDirective;
  language: LanguageDirective;
  presence: PresenceDirective;
  empathy: EmpathyDirective;
  feedback: FeedbackDirective;
  responseStyle: ResponseStyleDirective;
  guardrails: TeacherGuardrailDirective;
  generatedTimestampIso: string;
}

export interface TeacherEvaluationInput {
  studentState: StudentLearningState;
  orchestratorDirective?: OrchestratorActionDirective;
  affectiveFilterState?: 'optimal' | 'moderate' | 'panic';
  studentAnxietyLevel?: number; // 0-100
  currentBlockType?: string;
  recentErrorDetected?: boolean;
}

export interface TeacherValidationResult {
  isValid: boolean;
  issues: string[];
}
