/**
 * Context Engine Module (Living Language Ecosystem - Phase 13)
 * Customizes study materials, technical vocabulary, and role-play scenarios
 * based on the user's specific profession, background, and daily context.
 */

export interface ProfessionalContext {
  profession: 'technology' | 'healthcare' | 'business_finance' | 'hospitality_tourism' | 'general';
  keyVocabularyTerms: { term: string; translation: string; example: string }[];
  tailoredScenarioTitle: string;
}

export const PROFESSIONAL_CONTEXTS: Record<string, ProfessionalContext> = {
  technology: {
    profession: 'technology',
    keyVocabularyTerms: [
      {
        term: 'Despliegue (Deploy)',
        translation: 'Implantação / Lançamento de software',
        example: 'El despliegue en producción está programado para hoy.',
      },
      {
        term: 'Base de datos',
        translation: 'Base de dados',
        example: 'Optimizamos las consultas de la base de datos.',
      },
    ],
    tailoredScenarioTitle: 'Reunião de Alinhamento Técnico (Daily Standup em Espanhol)',
  },
  healthcare: {
    profession: 'healthcare',
    keyVocabularyTerms: [
      {
        term: 'Diagnóstico',
        translation: 'Diagnóstico médico',
        example: 'El médico confirmó el diagnóstico tras los análisis.',
      },
      {
        term: 'Tratamiento',
        translation: 'Tratamento',
        example: 'Seguiremos el tratamiento recomendado durante dos semanas.',
      },
    ],
    tailoredScenarioTitle: 'Atendimento e Anamnese em Clínica Internacional',
  },
  business_finance: {
    profession: 'business_finance',
    keyVocabularyTerms: [
      {
        term: 'Presupuesto',
        translation: 'Orçamento',
        example: 'Aprobamos el presupuesto anual para el nuevo proyecto.',
      },
      {
        term: 'Negociación',
        translation: 'Negociação',
        example: 'La negociación se cerró con un acuerdo favorable.',
      },
    ],
    tailoredScenarioTitle: 'Apresentação de Proposta Comercial a Investidores',
  },
};

export function getProfessionalContext(
  profession: string = 'business_finance'
): ProfessionalContext {
  return PROFESSIONAL_CONTEXTS[profession] || PROFESSIONAL_CONTEXTS.business_finance;
}
