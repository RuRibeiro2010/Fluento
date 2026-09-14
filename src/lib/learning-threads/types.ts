/**
 * FLUENTO LEARNING THREADS - TYPES & INTERFACES
 * 
 * Defines the strongly-typed memory architecture for long-term pedagogical memory.
 * Strictly manages structured learning memories: successes, persistent difficulties,
 * spaced repetition review items, and ephemeral session notes.
 * 
 * MANDATES:
 * - NO full conversation history or transcripts stored.
 * - ONLY structured, actionable learning insights.
 */

import { CEFRLevel } from '@/types/brain';
import { ReviewItem } from '@/src/lib/learning-engine';

export type MemoryCategory = 
  | 'success_breakthrough'
  | 'persistent_difficulty'
  | 'srs_review_item'
  | 'ephemeral_session_note';

export type MemoryRetentionLevel = 'ephemeral' | 'working' | 'long_term' | 'permanent';

export type DifficultySeverity = 'minor_confusion' | 'moderate_friction' | 'blocking_trauma';

export interface EphemeralNote {
  id: string;
  studentId: string;
  sessionId: string;
  timestampIso: string;
  content: string;
  categoryTag: string;
}

export interface SuccessMemory {
  id: string;
  studentId: string;
  timestampIso: string;
  title: string;
  description: string;
  cefrLevel: CEFRLevel;
  skillCategory: 'speaking' | 'listening' | 'vocabulary' | 'grammar' | 'pronunciation';
  confidenceBoostScore: number; // 1 - 20
  permanenceLevel: MemoryRetentionLevel;
  occurrenceCount: number;
}

export interface DifficultyMemory {
  id: string;
  studentId: string;
  firstObservedIso: string;
  lastObservedIso: string;
  title: string;
  description: string;
  cefrLevel: CEFRLevel;
  severity: DifficultySeverity;
  occurrenceCount: number;
  isResolved: boolean;
  resolutionTimestampIso?: string;
  l1InterferenceTag?: string; // e.g. 'pt_false_friend'
}

export interface ReviewMemoryItem extends ReviewItem {
  studentId: string;
  createdIso: string;
}

export interface ThreadSnapshot {
  studentId: string;
  lastConsolidatedIso: string;
  successes: SuccessMemory[];
  difficulties: DifficultyMemory[];
  reviewItems: ReviewMemoryItem[];
  ephemeralNotes: EphemeralNote[];
  totalPromotionsCount: number;
  revision: number;
}

export interface MemoryClassificationResult {
  classifiedCategory: MemoryCategory;
  importanceScore: number; // 0 - 100
  retentionLevel: MemoryRetentionLevel;
  suggestedTitle: string;
  suggestedDescription: string;
}

export interface DecayCalculationResult {
  itemId: string;
  previousDecayScore: number;
  newDecayScore: number;
  daysElapsed: number;
  isDueForReview: boolean;
}

export interface PromotionRuleResult {
  promoted: boolean;
  promotedItemType?: 'success' | 'difficulty';
  reason?: string;
  newItem?: SuccessMemory | DifficultyMemory;
}

export interface ConsolidationReport {
  timestampIso: string;
  studentId: string;
  duplicateItemsRemoved: number;
  difficultiesResolved: number;
  ephemeralNotesCleaned: number;
  decayUpdatedItemsCount: number;
  summaryNote: string;
}

export interface ThreadSearchFilter {
  keyword?: string;
  category?: MemoryCategory;
  cefrLevel?: CEFRLevel;
  isResolved?: boolean;
  minDecayScore?: number;
  limit?: number;
}

export interface ThreadTelemetryEvent {
  eventId: string;
  studentId: string;
  timestampIso: string;
  action: 'added' | 'promoted' | 'decay_applied' | 'consolidated' | 'deleted';
  itemCategory: MemoryCategory;
  itemId: string;
  details: string;
}

export interface ThreadValidationResult {
  isValid: boolean;
  issues: string[];
}
