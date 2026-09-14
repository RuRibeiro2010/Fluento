/**
 * Real-World Transfer Module (Living Language Ecosystem - Phase 13)
 * Measures how effectively app learning translates to real-world autonomy,
 * spontaneous confidence, and practical conversational execution.
 */

export interface RealWorldTransferMetric {
  category: 'spontaneous_speech' | 'listening_autonomy' | 'reading_speed' | 'anxiety_reduction';
  scorePercentage: number;
  unlockedRealCapabilities: string[];
}

export function evaluateRealWorldTransfer(
  completedLessonsCount: number = 5,
  activeStreakDays: number = 7
): RealWorldTransferMetric[] {
  const baseScore = Math.min(95, 50 + completedLessonsCount * 5 + activeStreakDays * 2);

  return [
    {
      category: 'spontaneous_speech',
      scorePercentage: baseScore,
      unlockedRealCapabilities: [
        'Responder sem hesitação longa em saudações',
        'Pedir esclarecimentos sem mudar para o idioma nativo',
      ],
    },
    {
      category: 'listening_autonomy',
      scorePercentage: Math.min(98, baseScore + 6),
      unlockedRealCapabilities: [
        'Compreender frases em ritmo nativo com sotaque madrileno',
        'Captar a ideia principal de anúncios públicos',
      ],
    },
    {
      category: 'anxiety_reduction',
      scorePercentage: Math.min(96, baseScore + 10),
      unlockedRealCapabilities: [
        'Segurança total para falar mesmo cometendo pequenos erros gramaticais',
        'Iniciativa para começar conversas simples com nativos',
      ],
    },
  ];
}
