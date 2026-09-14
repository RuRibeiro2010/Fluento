/**
 * Emotion-Safe Learning Module (Human Teaching Engine)
 * Prevents student frustration and anxiety through evidence-based positive reinforcement,
 * effort-focused feedback, and psychological safety design (growth mindset).
 */

export interface EmotionState {
  frustrationIndex: number; // 0 to 100
  perceivedAnxiety: 'relaxed' | 'mild_stress' | 'high_frustration';
  consecutiveFailures: number;
  sessionDurationMinutes: number;
}

export interface GrowthFeedback {
  headline: string;
  effortPraise: string;
  growthMindsetTip: string;
  audioTone: 'warm_calm' | 'encouraging_gentle';
}

export function assessEmotionalSafety(state: EmotionState): {
  isPsychologicallySafe: boolean;
  recommendedPauseOrEase: boolean;
  supportMessage?: string;
} {
  if (state.frustrationIndex > 70 || state.consecutiveFailures >= 3) {
    return {
      isPsychologicallySafe: false,
      recommendedPauseOrEase: true,
      supportMessage: 'Estás a fazer um excelente esforço cognitivo. Vamos fazer uma pausa rápida de 10 segundos ou tentar um exemplo mais simples?',
    };
  }

  return {
    isPsychologicallySafe: true,
    recommendedPauseOrEase: false,
  };
}

export function generateGrowthMindsetFeedback(
  conceptAttempted: string,
  wasSuccessful: boolean
): GrowthFeedback {
  if (wasSuccessful) {
    return {
      headline: 'Excelente progresso demonstrado!',
      effortPraise: `O teu foco ao analisar a estrutura de "${conceptAttempted}" deu resultado direto.`,
      growthMindsetTip: 'A persistência em praticar pontos de dúvida fortalece as tuas conexões neurais.',
      audioTone: 'warm_calm',
    };
  }

  return {
    headline: 'Momento valioso de aprendizagem',
    effortPraise: `Procurar a palavra certa para "${conceptAttempted}" mostra que estás a tentar pensar na língua-alvo sem traduzir.`,
    growthMindsetTip: 'Os erros são o único sinal de que o cérebro está a expandir a sua capacidade de expressão.',
    audioTone: 'encouraging_gentle',
  };
}
