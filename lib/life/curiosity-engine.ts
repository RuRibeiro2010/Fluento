/**
 * Curiosity Engine Module (Living Language Ecosystem - Phase 13)
 * Generates cultural trivia, etymological insights, slang evolutions,
 * and fascinating linguistic curiosities to fuel intrinsic motivation.
 */

export interface CuriosityFact {
  id: string;
  topic: 'etymology' | 'culture' | 'slang' | 'idiom' | 'false_friends';
  title: string;
  factText: string;
  linguisticInsight: string;
  funFactorRating: number; // 1 to 5
}

export const CURIOSITY_FACTS: CuriosityFact[] = [
  {
    id: 'curiosity-1',
    topic: 'etymology',
    title: 'A Origem Fascinante da Palavra "Ojalá"',
    factText: 'Em espanhol, a palavra "Ojalá" (Oxalá / Quem me dera) vem diretamente do árabe "aw sha\' Allah" (que Deus queira).',
    linguisticInsight: 'Isto reflete mais de 700 anos de presença e influência linguística árabe na Península Ibérica.',
    funFactorRating: 5,
  },
  {
    id: 'curiosity-2',
    topic: 'false_friends',
    title: 'Cuidado com "Embarazada"',
    factText: 'Em espanhol, "embarazada" não significa envergonhada (embarrassed em inglês), mas sim "grávida"!',
    linguisticInsight: 'Para dizer envergonhado(a) em espanhol, utiliza-se "avergonzado/a" ou "con vergüenza".',
    funFactorRating: 5,
  },
  {
    id: 'curiosity-3',
    topic: 'slang',
    title: 'Onde Surgiu "Vale"?',
    factText: 'Em Espanha, a palavra "Vale" é usada constantemente para dizer "ok", "de acordo" ou "está bem".',
    linguisticInsight: 'Vem do verbo "valer" (valer/ter valor) no sentido de "é válido" ou "serve".',
    funFactorRating: 4,
  },
];

export function getRandomCuriosityFact(): CuriosityFact {
  const index = Math.floor(Math.random() * CURIOSITY_FACTS.length);
  return CURIOSITY_FACTS[index];
}
