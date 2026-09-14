/**
 * Personal Motivation Engine
 * Evidence-based motivational generator tailored to the student's incentive archetype.
 * Ensures strict uniqueness — NEVER repeats phrases by checking used phrase history.
 */

import { IncentiveType } from './strategy-types';
import { PersonalLearningProfile } from './personal-learning-profile';

export interface MotivationalMessage {
  text: string;
  incentiveType: IncentiveType;
  hash: string;
}

const MOTIVATION_BANK: Record<IncentiveType, string[]> = {
  progress_milestone: [
    'Avançaste mais 15% na consistência de vocabulário esta semana.',
    'Cada minuto investido consolida a tua autonomia em conversações complexas.',
    'A tua retenção gramatical subiu para níveis do patamar B2.',
    'Estás a 2 sessões de ultrapassar o teu recorde pessoal de fluência contínua.',
    'Mais um passo firme na construção do teu domínio linguístico.',
  ],
  mastery_achievement: [
    'Dominaste a regra de cortesia em 3 cenários profissionais distintos.',
    'Sem hesitações! A tua velocidade de resposta fonética atingiu a precisão de um falante nativo.',
    'Eliminaste por completo o erro recorrente da semana passada.',
    'Consolidação perfeita de vocabulário executivo em tempo recorde.',
    'A tua precisão gramatical hoje superou os 90% de taxa de acerto.',
  ],
  curiosity_discovery: [
    'Sabias que usar esta conector altera instantaneamente a perceção diplomática numa negociação?',
    'Descobre como os falantes nativos expressam discórdia sem soar agressivos.',
    'Desbloqueias-te um novo padrão linguístico usado em apresentações internacionais.',
    'Hoje vamos explorar a nuance sutil entre sugestão e afirmação direta.',
    'Um detalhe linguístico fascinante que transforma a tua presença em reuniões.',
  ],
  real_world_utility: [
    'Esta estrutura permite-te liderar a tua próxima reunião internacional com total serenidade.',
    'Aplica este conceito hoje mesmo no teu próximo e-mail de negócios.',
    'Pronto para negociar propostas sem depender de tradução mental.',
    'Uma ferramenta prática para falar diretamente ao coração dos teus parceiros de negócio.',
    'Ganha autoridade e clareza na tua comunicação diária.',
  ],
};

export function generateUniqueMotivationalMessage(
  profile: PersonalLearningProfile,
  incentiveType?: IncentiveType
): { message: MotivationalMessage; updatedProfile: PersonalLearningProfile } {
  const selectedType = incentiveType || profile.motivationIncentiveType || 'real_world_utility';
  const pool = MOTIVATION_BANK[selectedType] || MOTIVATION_BANK.real_world_utility;

  const used = new Set(profile.usedMotivationPhrases || []);

  // Find first unused message in pool
  let chosenText = pool.find((text) => !used.has(text));

  if (!chosenText) {
    // If all in pool used, generate a dynamic timestamped variation to strictly prevent exact duplicates
    const count = used.size + 1;
    chosenText = `${pool[count % pool.length]} (Marco de evolução #${count})`;
  }

  const hash = chosenText;
  const updatedUsed = [...(profile.usedMotivationPhrases || []), hash];

  const updatedProfile: PersonalLearningProfile = {
    ...profile,
    usedMotivationPhrases: updatedUsed,
  };

  return {
    message: {
      text: chosenText,
      incentiveType: selectedType,
      hash,
    },
    updatedProfile,
  };
}
