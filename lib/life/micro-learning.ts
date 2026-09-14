/**
 * Micro Learning Module (Living Language Ecosystem - Phase 13)
 * Schedules 2-to-5 minute bite-sized learning cards designed for quick daily breaks
 * (commute, coffee break, elevator wait) maintaining momentum without friction.
 */

export interface MicroLearningCard {
  id: string;
  durationMinutes: number;
  category: 'vocabulary_flash' | 'grammar_spot' | 'listening_sprint' | 'pronunciation_snack';
  title: string;
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
}

export const MICRO_LEARNING_CARDS: MicroLearningCard[] = [
  {
    id: 'micro-1',
    durationMinutes: 2,
    category: 'vocabulary_flash',
    title: 'Vocabulário Expresso: Viagens',
    prompt: 'Qual é a tradução mais precisa para "Reserva de Hotel" em espanhol?',
    options: ['La reservación del hotel', 'El recibo de hospedaje', 'El pasaje del hotel'],
    correctAnswer: 'La reservación del hotel',
    explanation: 'Em espanhol, "reservación" ou "reserva" é o termo padrão em contextos turísticos.',
  },
  {
    id: 'micro-2',
    durationMinutes: 3,
    category: 'grammar_spot',
    title: 'Spot Gramatical: "Por" vs "Para"',
    prompt: 'Escolha a opção correta: "Estudio español ____ trabajar en Madrid."',
    options: ['por', 'para', 'de'],
    correctAnswer: 'para',
    explanation: 'Usa-se "para" para expressar finalidade ou propósito consciente (in order to).',
  },
  {
    id: 'micro-3',
    durationMinutes: 2,
    category: 'pronunciation_snack',
    title: 'Dica de Pronúncia: A Letra "R" Suave',
    prompt: 'Como deve sobrar a letra "R" na palavra "pero" (mas)?',
    options: ['Vibração única na ponta da língua', 'Som forte da garganta (Francês)', 'Vibração dupla e prolongada'],
    correctAnswer: 'Vibração única na ponta da língua',
    explanation: 'O "r" simples em "pero" vibra apenas uma vez suavemente contra o alvéolo superior.',
  },
];

export function getRecommendedMicroCard(availableMinutes: number = 3): MicroLearningCard {
  const matching = MICRO_LEARNING_CARDS.filter((c) => c.durationMinutes <= availableMinutes);
  return matching.length > 0 ? matching[0] : MICRO_LEARNING_CARDS[0];
}
