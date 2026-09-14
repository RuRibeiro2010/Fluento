/**
 * Adaptive Lesson Structure Engine
 * Automatically adapts block ordering, exercise mix, example types,
 * and review depth based on the student's Personal Learning Profile.
 */

import { PersonalLearningProfile } from './personal-learning-profile';
import { SelectedLessonStrategy } from './teaching-strategy-engine';

export interface LessonBlockConfig {
  blockType: 'active_recall' | 'retrieval' | 'core_content' | 'interactive_practice' | 'metacognitive_wrap';
  durationMinutes: number;
  emphasis: string;
}

export interface AdaptiveLessonPlan {
  totalTargetMinutes: number;
  strategy: SelectedLessonStrategy;
  blocks: LessonBlockConfig[];
  recommendedExerciseMix: {
    speakingPercent: number;
    listeningPercent: number;
    grammarPercent: number;
    vocabularyPercent: number;
  };
}

export function buildAdaptiveLessonStructure(
  profile: PersonalLearningProfile,
  strategy: SelectedLessonStrategy
): AdaptiveLessonPlan {
  const totalMinutes = profile.optimalSessionLengthMinutes;

  // Block distribution based on strategy order
  const blocks: LessonBlockConfig[] = [];

  if (strategy.order === 'examples_first') {
    blocks.push({ blockType: 'core_content', durationMinutes: Math.round(totalMinutes * 0.35), emphasis: 'Exemplo prático contextual antes de abstrações teóricas' });
    blocks.push({ blockType: 'interactive_practice', durationMinutes: Math.round(totalMinutes * 0.40), emphasis: 'Prática guiada ativa' });
    blocks.push({ blockType: 'active_recall', durationMinutes: Math.round(totalMinutes * 0.15), emphasis: 'Recuperação sem pistas' });
    blocks.push({ blockType: 'metacognitive_wrap', durationMinutes: Math.round(totalMinutes * 0.10), emphasis: 'Autorreflexão e consolidação' });
  } else if (strategy.order === 'guided_discovery') {
    blocks.push({ blockType: 'retrieval', durationMinutes: Math.round(totalMinutes * 0.20), emphasis: 'Ancoragem em conhecimentos anteriores' });
    blocks.push({ blockType: 'interactive_practice', durationMinutes: Math.round(totalMinutes * 0.45), emphasis: 'Descoberta guiada por perguntas Socráticas' });
    blocks.push({ blockType: 'core_content', durationMinutes: Math.round(totalMinutes * 0.25), emphasis: 'Sintetização e confirmação do conceito' });
    blocks.push({ blockType: 'metacognitive_wrap', durationMinutes: Math.round(totalMinutes * 0.10), emphasis: 'Metacognição de fecho' });
  } else {
    // Theory first
    blocks.push({ blockType: 'core_content', durationMinutes: Math.round(totalMinutes * 0.30), emphasis: 'Explicação clara da regra ou vocabulário' });
    blocks.push({ blockType: 'interactive_practice', durationMinutes: Math.round(totalMinutes * 0.45), emphasis: 'Aplicação direta em exercícios' });
    blocks.push({ blockType: 'active_recall', durationMinutes: Math.round(totalMinutes * 0.15), emphasis: 'Verificação da retenção' });
    blocks.push({ blockType: 'metacognitive_wrap', durationMinutes: Math.round(totalMinutes * 0.10), emphasis: 'Síntese final' });
  }

  // Modality mix based on profile and strategy
  let mix = { speakingPercent: 35, listeningPercent: 25, grammarPercent: 20, vocabularyPercent: 20 };
  if (strategy.modality === 'speaking_heavy') {
    mix = { speakingPercent: 50, listeningPercent: 20, grammarPercent: 15, vocabularyPercent: 15 };
  } else if (strategy.modality === 'listening_heavy') {
    mix = { speakingPercent: 20, listeningPercent: 50, grammarPercent: 15, vocabularyPercent: 15 };
  } else if (strategy.modality === 'interactive_roleplay') {
    mix = { speakingPercent: 40, listeningPercent: 30, grammarPercent: 15, vocabularyPercent: 15 };
  }

  return {
    totalTargetMinutes: totalMinutes,
    strategy,
    blocks,
    recommendedExerciseMix: mix,
  };
}
