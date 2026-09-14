/**
 * Learning Moments Module (Human Teaching Engine)
 * Transforms mistakes and errors into positive cognitive discovery moments,
 * reducing student anxiety and creating strong memory anchors.
 */

export interface ErrorReframing {
  originalError: string;
  underlyingMisconception: string;
  positiveReframingText: string;
  discoveryInsight: string;
  memoryAnchor: string;
  audioToneHint: 'warm_encouraging' | 'curious_friendly' | 'thoughtful';
}

export function reframeErrorAsDiscovery(
  studentUtterance: string,
  targetCorrection: string,
  conceptCategory: string
): ErrorReframing {
  const reframings: Record<string, { reframing: string; insight: string; anchor: string }> = {
    grammar: {
      reframing: 'Esse raciocínio é super lógico! Estás a aplicar a regra geral com grande intuição.',
      insight: 'Aqui temos uma pequena exceção idiomática que os falantes nativos usam por elegância.',
      anchor: 'Lembra-te: quando for uma situação formal, troca este detalhe para soares 100% natural.',
    },
    vocabulary: {
      reframing: 'A palavra que usaste faz todo o sentido no contexto direto.',
      insight: 'Na cultura local, existe uma nuance mais específica que traz muito mais expressividade.',
      anchor: 'Associa esta nova palavra ao cenário de conversa do dia a dia.',
    },
    pronunciation: {
      reframing: 'Pronunciaaste com excelente clareza fonética.',
      insight: 'Apenas a entoação da sílaba tónica muda o ritmo da frase.',
      anchor: 'Suplica suavemente na penúltima sílaba para dar cadence fluida.',
    },
  };

  const matched = reframings[conceptCategory] || {
    reframing: 'Boa tentativa! Identificaste a estrutura principal com clareza.',
    insight: 'Existe apenas um pequeno ajuste de detalhe para aperfeiçoar.',
    anchor: 'Guarda este ajuste como um ponto de evolução rápida.',
  };

  return {
    originalError: studentUtterance,
    underlyingMisconception: `Ajuste em ${conceptCategory}: de "${studentUtterance}" para "${targetCorrection}".`,
    positiveReframingText: matched.reframing,
    discoveryInsight: matched.insight,
    memoryAnchor: matched.anchor,
    audioToneHint: 'curious_friendly',
  };
}

export function formatLearningMomentPrompt(reframing: ErrorReframing): string {
  return `${reframing.positiveReframingText} ${reframing.discoveryInsight} ${reframing.memoryAnchor}`;
}
