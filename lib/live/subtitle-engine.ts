/**
 * Subtitle Engine Module (Live Experience Engine)
 * Manages live subtitle display modes and features:
 * - off (No subtitles for max listening immersion)
 * - target_only (Subtitles only in the target language being learned)
 * - difficult_words_only (Only highlights and annotates C1/B2 difficult terms)
 * - full (Full dual/single subtitles)
 * - translation_on_demand (Reveals native translation only when requested by student)
 */

export type SubtitleMode =
  | 'off'
  | 'target_only'
  | 'difficult_words_only'
  | 'full'
  | 'translation_on_demand';

export interface DifficultWordAnnotation {
  word: string;
  cefrLevel: 'B2' | 'C1' | 'C2';
  definitionNative: string;
  phoneticSpelling?: string;
}

export interface SubtitleFrame {
  id: string;
  speaker: 'teacher' | 'user';
  targetLanguageText: string;
  nativeLanguageTranslation?: string;
  annotations: DifficultWordAnnotation[];
  mode: SubtitleMode;
  isTranslationRevealed: boolean;
}

export interface SubtitleDisplayConfig {
  mode: SubtitleMode;
  fontSizePx: number; // e.g. 16
  highlightColorHex: string; // e.g. '#3B82F6'
  showAnnotationsOnHover: boolean;
}

export function createSubtitleFrame(
  speaker: 'teacher' | 'user',
  targetText: string,
  nativeTranslation: string,
  annotations: DifficultWordAnnotation[],
  mode: SubtitleMode = 'target_only'
): SubtitleFrame {
  return {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    speaker,
    targetLanguageText: targetText,
    nativeLanguageTranslation: nativeTranslation,
    annotations,
    mode,
    isTranslationRevealed: mode === 'full',
  };
}

export function revealOnDemandTranslation(
  frame: SubtitleFrame
): SubtitleFrame {
  return {
    ...frame,
    isTranslationRevealed: true,
  };
}

export function getRenderableSubtitleContent(frame: SubtitleFrame): {
  visibleTargetText: string;
  visibleNativeText: string | null;
  highlightedWords: DifficultWordAnnotation[];
} {
  if (frame.mode === 'off') {
    return {
      visibleTargetText: '',
      visibleNativeText: null,
      highlightedWords: [],
    };
  }

  if (frame.mode === 'difficult_words_only') {
    // Return target text with highlighted terms
    return {
      visibleTargetText: frame.targetLanguageText,
      visibleNativeText: null,
      highlightedWords: frame.annotations,
    };
  }

  if (frame.mode === 'target_only') {
    return {
      visibleTargetText: frame.targetLanguageText,
      visibleNativeText: null,
      highlightedWords: frame.annotations,
    };
  }

  if (frame.mode === 'translation_on_demand') {
    return {
      visibleTargetText: frame.targetLanguageText,
      visibleNativeText: frame.isTranslationRevealed ? frame.nativeLanguageTranslation || null : null,
      highlightedWords: frame.annotations,
    };
  }

  // mode === 'full'
  return {
    visibleTargetText: frame.targetLanguageText,
    visibleNativeText: frame.nativeLanguageTranslation || null,
    highlightedWords: frame.annotations,
  };
}
