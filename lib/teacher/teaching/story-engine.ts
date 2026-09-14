/**
 * Story Engine Module (Human Teaching Engine)
 * Structures learning sessions into continuous narrative arcs where each lesson
 * builds upon previous choices, characters, and scenarios.
 */

export interface StoryEpisode {
  episodeId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  settingLocation: string; // e.g., 'Aeroporto de Madrid', 'Café Central', 'Escritório Executivo'
  synopsis: string;
  prerequisiteConcepts: string[];
  targetLearningObjectives: string[];
  characterRoleplayList: string[];
}

export interface StoryProgress {
  userId: string;
  currentSeason: number;
  currentEpisode: number;
  unlockedEpisodeIds: string[];
  userChoicesHistory: Array<{
    episodeId: string;
    decisionPoint: string;
    chosenOutcome: string;
    timestampMs: number;
  }>;
}

export interface NarrativeArc {
  arcId: string;
  arcTitle: string;
  targetCEFRLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  episodes: StoryEpisode[];
}

export function initializeStoryProgress(userId: string): StoryProgress {
  return {
    userId,
    currentSeason: 1,
    currentEpisode: 1,
    unlockedEpisodeIds: ['ep-1-1'],
    userChoicesHistory: [],
  };
}

export function getNextStoryEpisode(
  progress: StoryProgress,
  narrativeArc: NarrativeArc
): StoryEpisode | null {
  return (
    narrativeArc.episodes.find(
      (ep) => ep.seasonNumber === progress.currentSeason && ep.episodeNumber === progress.currentEpisode
    ) || null
  );
}

export function recordStoryChoice(
  progress: StoryProgress,
  episodeId: string,
  decisionPoint: string,
  chosenOutcome: string
): StoryProgress {
  return {
    ...progress,
    userChoicesHistory: [
      ...progress.userChoicesHistory,
      {
        episodeId,
        decisionPoint,
        chosenOutcome,
        timestampMs: Date.now(),
      },
    ],
  };
}

export function buildStoryPromptContext(
  progress: StoryProgress,
  currentEpisode: StoryEpisode
): string {
  const previousChoices = progress.userChoicesHistory
    .slice(-3)
    .map((c) => `Em ${c.episodeId}: escolheu "${c.chosenOutcome}"`)
    .join('; ');

  return `Contexto da História Contínua:
Episódio Ativo: "${currentEpisode.title}" (${currentEpisode.settingLocation}).
Sinopse: ${currentEpisode.synopsis}.
Histórico de Escolhas do Aluno: ${previousChoices || 'Início da narrativa'}.
A tua personagem deve saudar o aluno fazendo referência a este contexto vivo.`;
}
