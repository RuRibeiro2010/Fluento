/**
 * FLUENTO LESSON COMPOSER - REFLECTION BUILDER
 * 
 * Builds the Metacognitive Reflection block.
 * Encourages self-assessment, identifies the "Day's Victory", and reinforces
 * self-efficacy and student learning autonomy.
 */

import { BaseBlockBuilder } from './block-builder';
import { LessonBlock, BlockBuilderContext, BlockType } from './types';

export class ReflectionBuilder extends BaseBlockBuilder {
  readonly blockType: BlockType = 'reflection';

  public buildBlock(context: BlockBuilderContext): LessonBlock {
    const { blueprint, allocatedMinutes } = context;

    const title = 'Reflexão Metacognitiva & Vitória do Dia';
    const objective = 'Ancorar o sentimento de progresso, reforçar a autoeficácia e identificar a vitória comunicativa da sessão.';

    const activities = [
      this.createActivity(
        'refl_days_victory',
        'reflection_prompt',
        'Ancoragem da Vitória da Sessão',
        allocatedMinutes,
        'Convidar o aluno a identificar o que correu melhor na sessão.',
        'Autoeficácia e Metacognição',
        'Elogiar um progresso específico observado na sessão e perguntar como o aluno se sente relativamente ao seu desempenho.'
      )
    ];

    const guidelines = [
      'Garantir que a sessão termina com uma nota positiva e encorajadora.',
      'Destacar o esforço e a coragem comunicativa em vez de resultados perfeitos.'
    ];

    return this.createBlock(
      'block_reflection',
      title,
      allocatedMinutes,
      objective,
      'metacognitive_reflection',
      activities,
      guidelines
    );
  }
}

export const reflectionBuilder = new ReflectionBuilder();
