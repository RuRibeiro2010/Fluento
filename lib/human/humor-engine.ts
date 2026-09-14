/**
 * Humor Engine Module (Fluento Human Experience - Phase 19)
 * Injects subtle, culturally appropriate warmth and lighthearted observations
 * to lower the affective filter without being unprofessional.
 */

export interface CulturalHumorNote {
  shouldIncludeLightHumor: boolean;
  subtleHumorPhrase?: string;
}

export function generateSubtleHumorNote(
  studentFatigue: number,
  topicCategory: string
): CulturalHumorNote {
  if (studentFatigue >= 7) {
    return {
      shouldIncludeLightHumor: false,
    };
  }

  if (topicCategory === 'technology' || topicCategory === 'business') {
    return {
      shouldIncludeLightHumor: true,
      subtleHumorPhrase: 'Mesmo em reuniões de negócios, um pequeno sorriso facilita qualquer negociação em espanhol!',
    };
  }

  return {
    shouldIncludeLightHumor: true,
    subtleHumorPhrase: 'Até os falantes nativos hesitam de vez em quando nesta pronúncia.',
  };
}
