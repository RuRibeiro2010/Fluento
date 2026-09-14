/**
 * Teaching Strategy Engine
 * Discreetly selects and evaluates evidence-based pedagogical strategies using a safe,
 * reversible multi-armed bandit approach (Epsilon-Greedy with safety floor).
 */

import {
  ExplanationType,
  ModalityFocus,
  PedagogicalOrder,
  ReviewStyle,
} from './strategy-types';
import { PersonalLearningProfile } from './personal-learning-profile';
import { getExperimentationConfig } from './config';

export interface SelectedLessonStrategy {
  order: PedagogicalOrder;
  modality: ModalityFocus;
  reviewStyle: ReviewStyle;
  explanationType: ExplanationType;
  isExploration: boolean;
  strategyRationale: string;
}

export function selectOptimalStrategy(
  profile: PersonalLearningProfile
): SelectedLessonStrategy {
  const config = getExperimentationConfig().safety;
  const rand = Math.random();
  const isExploration = rand < config.maxExplorationRate;

  // Available evidence-based pedagogical orders
  const orders: PedagogicalOrder[] = ['examples_first', 'theory_first', 'guided_discovery'];
  const modalities: ModalityFocus[] = ['balanced', 'speaking_heavy', 'listening_heavy', 'interactive_roleplay', 'story_context'];
  const reviewStyles: ReviewStyle[] = ['micro_burst', 'deep_spaced_review', 'active_recall_retrieval'];
  const explanations: ExplanationType[] = ['real_world_scenario', 'analogy', 'direct_breakdown', 'native_contrast'];

  if (isExploration) {
    // Pick candidate safely from evidence-based options
    const order = orders[Math.floor(Math.random() * orders.length)];
    const modality = modalities[Math.floor(Math.random() * modalities.length)];
    const reviewStyle = reviewStyles[Math.floor(Math.random() * reviewStyles.length)];
    const explanationType = explanations[Math.floor(Math.random() * explanations.length)];

    return {
      order,
      modality,
      reviewStyle,
      explanationType,
      isExploration: true,
      strategyRationale: 'Exploração segura e pontual de alternativa pedagógica com evidência científica.',
    };
  }

  // Exploitation: Pick top performing weighted strategy for user
  const bestOrder = getBestStrategyForCategory(profile, 'order', orders, 'examples_first');
  const bestModality = getBestStrategyForCategory(profile, 'modality', modalities, 'balanced');
  const bestReview = getBestStrategyForCategory(profile, 'review', reviewStyles, 'active_recall_retrieval');
  const bestExpl = getBestStrategyForCategory(profile, 'explanation', explanations, 'real_world_scenario');

  return {
    order: bestOrder,
    modality: bestModality,
    reviewStyle: bestReview,
    explanationType: bestExpl,
    isExploration: false,
    strategyRationale: 'Estratégia otimizada com base no histórico de maior eficiência do aluno.',
  };
}

function getBestStrategyForCategory<T extends string>(
  profile: PersonalLearningProfile,
  category: string,
  candidates: T[],
  defaultChoice: T
): T {
  let bestCandidate = defaultChoice;
  let highestScore = -1;

  candidates.forEach((cand) => {
    const key = `${category}:${cand}`;
    const weightObj = profile.strategyWeights[key];
    if (weightObj) {
      if (weightObj.avgEfficiencyScore > highestScore) {
        highestScore = weightObj.avgEfficiencyScore;
        bestCandidate = cand;
      }
    }
  });

  return bestCandidate;
}
