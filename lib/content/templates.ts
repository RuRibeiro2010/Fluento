import { LessonBlockType } from '@/types/content';

export interface LessonTemplate {
  id: string;
  name: string;
  archetype: 'conversation' | 'grammar_mastery' | 'vocab_expansion' | 'pronunciation_drill' | 'balanced';
  description: string;
  recommendedDurationMinutes: number;
  blockSequence: LessonBlockType[];
  targetAudienceCefr: string[];
}

/**
 * Lesson Templates Registry
 * Standardized pedagogical blueprints defining modular block sequences and flow logic.
 */
export const LESSON_TEMPLATES: LessonTemplate[] = [
  {
    id: 'tmpl-conversational-roleplay',
    name: 'Conversational Roleplay & Real Scenario',
    archetype: 'conversation',
    description: 'Immersive dialogue simulation focused on unscripted speaking and listening fluency.',
    recommendedDurationMinutes: 12,
    blockSequence: [
      'introduction',
      'vocabulary',
      'conversation',
      'speaking',
      'mini_challenge',
      'summary',
    ],
    targetAudienceCefr: ['A2', 'B1', 'B2', 'C1'],
  },
  {
    id: 'tmpl-grammar-mastery',
    name: 'Targeted Grammar & Error Correction',
    archetype: 'grammar_mastery',
    description: 'Socratic breakdown of specific syntax rules, tenses, or troublesome prepositions.',
    recommendedDurationMinutes: 15,
    blockSequence: [
      'introduction',
      'grammar',
      'mini_challenge',
      'speaking',
      'quiz',
      'summary',
    ],
    targetAudienceCefr: ['A1', 'A2', 'B1', 'B2'],
  },
  {
    id: 'tmpl-vocab-expansion',
    name: 'Vocabulary Escalation & Contextual Usage',
    archetype: 'vocab_expansion',
    description: 'Escalates passive word recognition into active natural conversational deployment.',
    recommendedDurationMinutes: 10,
    blockSequence: [
      'introduction',
      'vocabulary',
      'conversation',
      'quiz',
      'summary',
    ],
    targetAudienceCefr: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  },
  {
    id: 'tmpl-pronunciation-listening',
    name: 'Phonetic Accuracy & Listening Ear',
    archetype: 'pronunciation_drill',
    description: 'Focuses on native speed audio discrimination, mouth movements, and accent clarity.',
    recommendedDurationMinutes: 10,
    blockSequence: [
      'introduction',
      'listening',
      'speaking',
      'mini_challenge',
      'summary',
    ],
    targetAudienceCefr: ['A1', 'A2', 'B1', 'B2'],
  },
  {
    id: 'tmpl-balanced-master',
    name: 'Comprehensive 360° Balanced Lesson',
    archetype: 'balanced',
    description: 'Full multi-dimensional workout covering reading, grammar, speaking, listening, and quiz.',
    recommendedDurationMinutes: 20,
    blockSequence: [
      'introduction',
      'vocabulary',
      'grammar',
      'conversation',
      'listening',
      'speaking',
      'mini_challenge',
      'quiz',
      'summary',
    ],
    targetAudienceCefr: ['A2', 'B1', 'B2', 'C1'],
  },
];

export class LessonTemplateEngine {
  public selectBestTemplate(
    archetypePreference?: string,
    targetDurationMinutes: number = 15
  ): LessonTemplate {
    if (archetypePreference) {
      const match = LESSON_TEMPLATES.find((t) => t.archetype === archetypePreference);
      if (match) return match;
    }

    if (targetDurationMinutes <= 10) {
      return LESSON_TEMPLATES.find((t) => t.id === 'tmpl-vocab-expansion') || LESSON_TEMPLATES[0];
    } else if (targetDurationMinutes >= 18) {
      return LESSON_TEMPLATES.find((t) => t.id === 'tmpl-balanced-master') || LESSON_TEMPLATES[0];
    }

    return LESSON_TEMPLATES.find((t) => t.id === 'tmpl-conversational-roleplay') || LESSON_TEMPLATES[0];
  }
}

export const defaultLessonTemplateEngine = new LessonTemplateEngine();
