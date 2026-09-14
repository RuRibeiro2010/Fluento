/**
 * FLUENTO LESSON COMPOSER - CORRECTION BUILDER
 * 
 * Builds the Recasting & Correction block.
 * Implements Fluento's Recasting strategy: subtle, natural reformulations
 * that model correct usage without breaking conversational flow or lowering confidence.
 */

import { BaseBlockBuilder } from './block-builder';
import { LessonBlock, BlockBuilderContext, BlockType } from './types';

export class CorrectionBuilder extends BaseBlockBuilder {
  readonly blockType: BlockType = 'correction';

  public buildBlock(context: BlockBuilderContext): LessonBlock {
    const { blueprint, allocatedMinutes } = context;
    const { decision } = blueprint;

    const title = 'Modelagem Natural & Recasting Reformulativo';
    const objective = `Aprimorar a exatidão estrutural através de recasting ${decision.strategy.recastingMode} sem desconstruir a fluência.`;

    const activities = [
      this.createActivity(
        'corr_recasting',
        'recasting_exercise',
        'Consolidação por Re-modelagem Conversacional',
        allocatedMinutes,
        `Modo Recasting: ${decision.strategy.recastingMode}. Tolerância a erro: ${decision.strategy.errorTolerance}.`,
        'Consciência Linguística Implicita',
        'Demonstrar a forma nativa natural refraseando a ideia do aluno com validação antes de avançar.'
      )
    ];

    const guidelines = [
      'NUNCA interromper o aluno abruptamente para sinalizar "erro".',
      'Usar a técnica de "Echoing Correction": validar o conteúdo da mensagem e repetir a frase corrigida naturalmente.',
      'Se o nível de ansiedade for elevado, priorizar a mensagem e omitir correções secundárias.'
    ];

    return this.createBlock(
      'block_correction',
      title,
      allocatedMinutes,
      objective,
      'recasting_feedback',
      activities,
      guidelines
    );
  }
}

export const correctionBuilder = new CorrectionBuilder();
