/**
 * Cultural Engine Module (Human Learning Experience - HLX)
 * Integrates cultural context, etiquette, regional linguistic nuances,
 * and social customs into live lessons naturally and contextually.
 */

export interface CulturalContextItem {
  id: string;
  targetRegion: string; // e.g. 'Espanha', 'México', 'Argentina', 'Colômbia'
  topic: string;
  culturalInsight: string;
  linguisticDifferenceNote?: string;
  recommendedCEFR: 'A2' | 'B1' | 'B2' | 'C1';
}

export const CULTURAL_INSIGHTS_DATABASE: CulturalContextItem[] = [
  {
    id: 'cult-es-1',
    targetRegion: 'Espanha',
    topic: 'Cortesia Comercial',
    culturalInsight: 'Em Espanha, o uso do "Tú" é extremamente comum em restaurantes e lojas, ao contrário da América Latina onde o "Usted" prevalece como sinal de respeito.',
    linguisticDifferenceNote: '"¿Qué te pongo?" é uma saudação habitual e calorosa dos empregados de mesa.',
    recommendedCEFR: 'A2',
  },
  {
    id: 'cult-mx-1',
    targetRegion: 'México',
    topic: 'Diplomacia Social',
    culturalInsight: 'No México, o uso de "Mande" ou "Con gusto" demonstra uma grande preocupação com a gentileza interpessoal.',
    linguisticDifferenceNote: '"¿Mande?" é a forma extremamente cortês de pedir para repetir uma frase.',
    recommendedCEFR: 'B1',
  },
  {
    id: 'cult-arg-1',
    targetRegion: 'Argentina',
    topic: 'Voseo e Expressividade',
    culturalInsight: 'O "Voseo" argentino traz uma musicalidade e proximidade únicas nas conversas diárias e nos negócios.',
    linguisticDifferenceNote: '"Vos tenés" substitui "Tú tienes" em todas as interações do quotidiano.',
    recommendedCEFR: 'B2',
  },
];

export function selectRelevantCulturalInsight(
  targetRegion: string,
  cefrLevel: string,
  alreadySharedIds: string[] = []
): CulturalContextItem | null {
  const normalizedRegion = targetRegion.toLowerCase();

  const matched = CULTURAL_INSIGHTS_DATABASE.find(
    (item) =>
      !alreadySharedIds.includes(item.id) &&
      (item.targetRegion.toLowerCase().includes(normalizedRegion) ||
        normalizedRegion.includes(item.targetRegion.toLowerCase()))
  );

  return matched || CULTURAL_INSIGHTS_DATABASE.find((item) => !alreadySharedIds.includes(item.id)) || null;
}
