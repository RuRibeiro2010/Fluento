/**
 * Learning DNA Engine (Student Digital Twin - Sprint 4)
 * Captures deep internal behavioral and cognitive tendencies:
 * - Speech-first vs grammar-first affinity
 * - Grammar review frequency needs
 * - Vocabulary retention ease
 * - Real-world scenario responsiveness
 * Note: These tendencies are strictly internal to customize teaching strategies
 * and are never presented as static labels or limits to the user.
 */

import { LearningDNATendencies } from './digital-twin-types';

export class LearningDnaEngine {
  private dna: LearningDNATendencies;

  constructor(initialDna?: Partial<LearningDNATendencies>) {
    this.dna = {
      primaryChannel: initialDna?.primaryChannel || 'speaking_first',
      grammarReviewNeed: initialDna?.grammarReviewNeed || 'moderate',
      vocabularyRetentionEase: initialDna?.vocabularyRetentionEase || 'easy',
      realWorldExampleAffinity: initialDna?.realWorldExampleAffinity || 'high',
      tendencyDescriptions: initialDna?.tendencyDescriptions || [
        'Aprende rapidamente através da produção oral espontânea',
        'Demonstra elevada absorção em cenários práticos e roleplay',
        'Beneficia de revisões espaçadas periódicas em estruturas de passado',
      ],
    };
  }

  public getDNA(): LearningDNATendencies {
    return { ...this.dna };
  }

  /**
   * Dynamically updates internal learning DNA tendencies based on longitudinal interaction history.
   */
  public updateTendencies(metrics: {
    speakingFluencyScore: number;
    grammarAccuracyScore: number;
    vocabularyRetentionRate: number;
    realScenarioCompletionRate: number;
  }): LearningDNATendencies {
    const descriptions: string[] = [];

    // Evaluate primary channel
    if (metrics.speakingFluencyScore >= metrics.grammarAccuracyScore + 10) {
      this.dna.primaryChannel = 'speaking_first';
      descriptions.push('Demonstra maior fluidez e aprendizagem orgânica via conversação oral');
    } else if (metrics.grammarAccuracyScore > metrics.speakingFluencyScore + 15) {
      this.dna.primaryChannel = 'grammar_structured';
      descriptions.push('Responde melhor a explicitação prévia de regras gramaticais e padrões');
    } else {
      this.dna.primaryChannel = 'listening_first';
      descriptions.push('Absorve vocabulário e estruturas predominantemente via imersão auditiva');
    }

    // Evaluate grammar review need
    if (metrics.grammarAccuracyScore < 65) {
      this.dna.grammarReviewNeed = 'high';
      descriptions.push('Necessita de reforços de gramática aplicada intercalados em diálogos');
    } else {
      this.dna.grammarReviewNeed = 'moderate';
    }

    // Evaluate vocabulary retention
    if (metrics.vocabularyRetentionRate >= 80) {
      this.dna.vocabularyRetentionEase = 'easy';
      descriptions.push('Memoriza novos termos e expressões com facilidade no contexto');
    } else {
      this.dna.vocabularyRetentionEase = 'moderate';
    }

    // Real world example affinity
    if (metrics.realScenarioCompletionRate >= 75) {
      this.dna.realWorldExampleAffinity = 'high';
      descriptions.push('Evolui aceleradamente com simulações situacionais e roleplay do mundo real');
    }

    this.dna.tendencyDescriptions = descriptions;
    return { ...this.dna };
  }
}
