/**
 * FLUENTO LESSON COMPOSER - PRACTICE BUILDER
 * 
 * Builds the Target Practice block.
 * Incorporates review items scheduled by the Spaced Repetition Engine (SRS)
 * and targeted exercises aligned with the session goals.
 */

import { BaseBlockBuilder } from './block-builder';
import { LessonBlock, BlockBuilderContext, BlockType } from './types';

export class PracticeBuilder extends BaseBlockBuilder {
  readonly blockType: BlockType = 'practice';

  public buildBlock(context: BlockBuilderContext): LessonBlock {
    const { blueprint, allocatedMinutes } = context;
    const { decision } = blueprint;

    const reviewItems = decision.scheduledReviewItems || [];
    const hasReviews = reviewItems.length > 0;

    const title = hasReviews
      ? 'Prática Dirigida & Consolidação de Memória (SRS)'
      : 'Prática Dirigida de Competências';

    const objective = hasReviews
      ? `Revisitar e consolidar ${reviewItems.length} conceito(s) da curva de esquecimento.`
      : 'Aplicar estruturas linguísticas e vocabulário chave em contexto prático.';

    const activities = [];

    if (hasReviews) {
      const perItemTime = Math.max(1, Math.floor(allocatedMinutes / reviewItems.length));
      reviewItems.forEach((item, index) => {
        activities.push(
          this.createActivity(
            `prac_srs_${index}`,
            'guided_question',
            `Revisão SRS: ${item.conceptOrWord}`,
            perItemTime,
            `Categoria: ${item.category} | Nível: ${item.cefrLevel}`,
            'Retenção de Longo Prazo',
            `Estimular o uso natural do termo ou estrutura '${item.conceptOrWord}' numa frase completa.`
          )
        );
      });
    } else {
      activities.push(
        this.createActivity(
          'prac_targeted_exercise',
          'guided_question',
          `Aplicação Prática: ${decision.whatToTeach}`,
          allocatedMinutes,
          `Densidade lexical ajustada: ${decision.difficulty.lexicalDensity}%`,
          'Precisão Contextual',
          `Apresentar um cenário prático onde o aluno deve aplicar o conceito '${decision.whatToTeach}'.`
        )
      );
    }

    const guidelines = [
      'Garantir que a prática é contextual e significativa, evitando exercícios descontextualizados.',
      'Fornecer dicas de apoio (scaffolding) se o aluno demonstrar hesitação prolongada.'
    ];

    return this.createBlock(
      'block_practice',
      title,
      allocatedMinutes,
      objective,
      'scenario_roleplay',
      activities,
      guidelines
    );
  }
}

export const practiceBuilder = new PracticeBuilder();
