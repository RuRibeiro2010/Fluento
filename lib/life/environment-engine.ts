/**
 * Environment Engine Module (Living Language Ecosystem - Phase 13)
 * Helps students optimize their physical and digital environments
 * to create a constant, effortless language immersion ecosystem.
 */

export interface ImmersionTip {
  id: string;
  category: 'physical' | 'digital' | 'auditory' | 'visual';
  title: string;
  actionableStep: string;
  impactScore: 'medium' | 'high' | 'transformative';
}

export const IMMERSION_TIPS: ImmersionTip[] = [
  {
    id: 'env-1',
    category: 'digital',
    title: 'Pesquisas no Google em Língua-Alvo',
    actionableStep: 'Faz as tuas pesquisas diárias de dúvidas ou notícias diretamente na língua que estás a aprender.',
    impactScore: 'high',
  },
  {
    id: 'env-2',
    category: 'auditory',
    title: 'Playlist de Fundo para o Caminho',
    actionableStep: 'Substitui a rádio habitual por um podcast em velocidade 0.9x durante os trajetos de carro ou transportes.',
    impactScore: 'transformative',
  },
  {
    id: 'env-3',
    category: 'physical',
    title: 'Etiquetas em Objetos de Casa',
    actionableStep: 'Coloca pequenos lembretes com nomes de utensílios na cozinha e secretária de trabalho.',
    impactScore: 'medium',
  },
];

export function getEnvironmentImmersionGuide(): ImmersionTip[] {
  return IMMERSION_TIPS;
}
