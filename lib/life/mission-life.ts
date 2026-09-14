/**
 * Mission Life Module (Living Language Ecosystem - Phase 13)
 * Generates real-world actionable tasks outside the digital classroom
 * to build practical autonomy and real environment immersion.
 */

export interface RealWorldLifeMission {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: 'easy' | 'medium' | 'challenging';
  rewardXp: number;
  category: 'digital_environment' | 'social_action' | 'creative_writing' | 'media_consumption';
}

export const LIFE_MISSIONS: RealWorldLifeMission[] = [
  {
    id: 'mission-life-1',
    title: 'Mudar Idioma do Telemóvel por 24 Horas',
    description: 'Altera o idioma do teu smartphone para o idioma que estás a aprender durante um dia inteiro.',
    estimatedMinutes: 5,
    difficulty: 'easy',
    rewardXp: 150,
    category: 'digital_environment',
  },
  {
    id: 'mission-life-2',
    title: 'Lista de Compras na Língua-Alvo',
    description: 'Escreve a tua próxima lista de supermercado inteiramente na língua que estás a estudar.',
    estimatedMinutes: 10,
    difficulty: 'easy',
    rewardXp: 100,
    category: 'creative_writing',
  },
  {
    id: 'mission-life-3',
    title: 'Ouvir Música com Legendas na Língua-Alvo',
    description: 'Escolhe uma música popular no idioma que estudas, ouve-a enquanto acompanhas a letra original e identifica 3 palavras novas.',
    estimatedMinutes: 12,
    difficulty: 'medium',
    rewardXp: 180,
    category: 'media_consumption',
  },
  {
    id: 'mission-life-4',
    title: 'Comprar um Café Usando Apenas a Língua-Alvo',
    description: 'Num estabelecimento local ou simulação ao vivo, faz um pedido completo utilizando saudações e fórmulas de cortesia nativas.',
    estimatedMinutes: 15,
    difficulty: 'challenging',
    rewardXp: 250,
    category: 'social_action',
  },
];

export function getActiveLifeMissions(): RealWorldLifeMission[] {
  return LIFE_MISSIONS;
}
