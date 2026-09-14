/**
 * Curiosity Engine Module (Human Teaching Engine)
 * Contextually inserts cultural, linguistic, and etymological facts at opportune moments
 * to enrich learning without breaking conversational flow.
 */

export interface CuriosityNugget {
  id: string;
  category: 'cultural_etiquette' | 'etymology' | 'native_idiom' | 'regional_difference';
  triggerConcept: string; // e.g. 'tapal', 'sobremesa', 'vosotros'
  title: string;
  factText: string;
  sourceContext: string;
}

export interface CuriosityTriggerContext {
  activeConcept: string;
  studentConfidence: number; // Only share curiosity if student is comfortable (e.g. >= 60)
  lessonPace: 'relaxed' | 'brisk';
  timeSpentInSessionMinutes: number;
}

const CURIOSITY_DATABASE: CuriosityNugget[] = [
  {
    id: 'cur-1',
    category: 'cultural_etiquette',
    triggerConcept: 'sobremesa',
    title: 'A Tradição da Sobremesa',
    factText: 'Na Espanha, "la sobremesa" não é apenas o doce final, mas o tempo sagrado de conversa à mesa após a refeição que pode durar horas!',
    sourceContext: 'Cultura de Restauração e Convivência',
  },
  {
    id: 'cur-2',
    category: 'etymology',
    triggerConcept: 'ojalá',
    title: 'Origem Árabe de "Ojalá"',
    factText: 'A palavra "Ojalá" deriva diretamente do árabe "Law sha\'a Allah" (Que Deus queira!), refletindo séculos de herança cultural andaluza.',
    sourceContext: 'Etimologia Histórica',
  },
  {
    id: 'cur-3',
    category: 'native_idiom',
    triggerConcept: 'vale',
    title: 'A Versatilidade do "Vale"',
    factText: 'Em Espanha, "¡Vale!" é repetido milhares de vezes ao dia. Equivale a "de acordo", "está bem", "entendido" e "ok".',
    sourceContext: 'Fluência Prática do Dia a Dia',
  },
];

export function evaluateCuriosityTrigger(
  context: CuriosityTriggerContext,
  alreadySeenIds: string[] = []
): CuriosityNugget | null {
  // Avoid overloading student if confidence is low (< 55)
  if (context.studentConfidence < 55) {
    return null;
  }

  const normalizedActiveConcept = context.activeConcept.toLowerCase();

  const candidate = CURIOSITY_DATABASE.find(
    (nugget) =>
      !alreadySeenIds.includes(nugget.id) &&
      (normalizedActiveConcept.includes(nugget.triggerConcept.toLowerCase()) ||
        nugget.triggerConcept.toLowerCase().includes(normalizedActiveConcept))
  );

  return candidate || null;
}
