/**
 * Daily Immersion Module (Living Language Ecosystem - Phase 13)
 * Provides daily bite-sized immersion prompts, authentic media recommendations,
 * short podcasts, and contextual quotes tailored to CEFR level and personal interests.
 */

export interface DailyImmersionItem {
  id: string;
  type: 'podcast_clip' | 'daily_quote' | 'idiomatic_phrase' | 'cultural_snippet';
  title: string;
  targetLanguageText: string;
  nativeLanguageTranslation: string;
  audioDurationSeconds: number;
  recommendedCEFRLevel: string;
  interestCategory: 'general' | 'business' | 'travel' | 'culture' | 'technology';
}

export const DAILY_IMMERSION_CATALOG: DailyImmersionItem[] = [
  {
    id: 'immersion-1',
    type: 'podcast_clip',
    title: 'Minuto de Ouro: O Ritmo do Quotidiano',
    targetLanguageText: 'La perseverancia diaria transforma pequeños esfuerzos en grandes logros comunicativos.',
    nativeLanguageTranslation: 'A perseverança diária transforma pequenos esforços em grandes conquistas comunicativas.',
    audioDurationSeconds: 45,
    recommendedCEFRLevel: 'B1',
    interestCategory: 'general',
  },
  {
    id: 'immersion-2',
    type: 'idiomatic_phrase',
    title: 'Expressão do Dia: "Estar en las nubes"',
    targetLanguageText: 'Estar en las nubes significa estar distraído o pensando en cosas fantásticas.',
    nativeLanguageTranslation: 'Estar nas nuvens significa estar distraído ou a pensar em coisas fantásticas.',
    audioDurationSeconds: 30,
    recommendedCEFRLevel: 'A2',
    interestCategory: 'culture',
  },
  {
    id: 'immersion-3',
    type: 'daily_quote',
    title: 'Pensamento Executivo',
    targetLanguageText: 'Las grandes ideas necesitan una comunicación clara y persuasiva.',
    nativeLanguageTranslation: 'As grandes ideias precisam de uma comunicação clara e persuasiva.',
    audioDurationSeconds: 25,
    recommendedCEFRLevel: 'B2',
    interestCategory: 'business',
  },
];

export function getDailyImmersionFeed(
  cefrLevel: string = 'B1',
  userInterest: string = 'general'
): DailyImmersionItem[] {
  return DAILY_IMMERSION_CATALOG.filter(
    (item) =>
      item.recommendedCEFRLevel === cefrLevel ||
      item.interestCategory === userInterest ||
      item.interestCategory === 'general'
  );
}
