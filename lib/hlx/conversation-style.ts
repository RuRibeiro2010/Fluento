/**
 * Conversation Style Module (Human Learning Experience - HLX)
 * Prevents repetitive AI dialogue by introducing natural linguistic variation,
 * varied praise structures, subtle humor, and diverse pedagogical explanations.
 */

export interface LinguisticStyleConfig {
  praiseVariationIndex: number;
  formalityLevel: 'friendly_casual' | 'warm_professional' | 'academic_polished';
  humorFrequency: 'never' | 'subtle_gentle' | 'playful';
  recentlyUsedPhrases: string[];
}

export const PRAISE_VARIATIONS: Record<string, string[]> = {
  high_performance: [
    'Articulação impressionante! A cadência soou 100% natural.',
    'Excelente escolha de vocabulário, exatamente a nuance de um falante nativo.',
    'Sem hesitação, fluidez impecável!',
    'Que raciocínio rápido e preciso. Dominaste este ponto.',
    'A tua confiança hoje está visivelmente noutro patamar.',
  ],
  steady_effort: [
    'Avanço sólido! É assim mesmo que se constrói a fluência.',
    'Boa persistência ao procurar a palavra certa.',
    'Passo a passo, estás a automatizar estas estruturas.',
    'Ótima tentativa, a intenção comunicativa ficou cristalina.',
    'Gosto de ver o teu raciocínio a conectar as ideias.',
  ],
  supportive_rebound: [
    'Perfeito para praticar! Os erros são os melhores marcadores de evolução.',
    'Boa tentativa. Vamos ajustar apenas a ligação destas duas palavras.',
    'Faz todo o sentido pensar assim. Deixa-me mostrar uma nuance típica.',
    'Completamente normal hesitar aqui. É uma estrutura muito rica.',
  ],
};

export function createInitialStyleConfig(): LinguisticStyleConfig {
  return {
    praiseVariationIndex: 0,
    formalityLevel: 'warm_professional',
    humorFrequency: 'subtle_gentle',
    recentlyUsedPhrases: [],
  };
}

export function generateVariedPraise(
  config: LinguisticStyleConfig,
  category: 'high_performance' | 'steady_effort' | 'supportive_rebound'
): { phrase: string; updatedConfig: LinguisticStyleConfig } {
  const pool = PRAISE_VARIATIONS[category] || PRAISE_VARIATIONS.steady_effort;
  const recent = new Set(config.recentlyUsedPhrases);

  let chosen = pool.find((p) => !recent.has(p));
  if (!chosen) {
    chosen = pool[config.praiseVariationIndex % pool.length];
  }

  const updatedRecent = [chosen, ...config.recentlyUsedPhrases].slice(0, 15);

  return {
    phrase: chosen,
    updatedConfig: {
      ...config,
      praiseVariationIndex: config.praiseVariationIndex + 1,
      recentlyUsedPhrases: updatedRecent,
    },
  };
}
