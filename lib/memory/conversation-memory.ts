import { ConversationMemory, ConversationSessionLog } from '@/types/memory';

/**
 * Conversation Memory Module
 * Logs Virtual Teacher sessions, key feedback, favorite characters, and frequent topics.
 */
export class ConversationMemoryService {
  private memory: ConversationMemory;

  constructor(userId: string = 'usr_default', targetLanguage: string = 'es') {
    this.memory = {
      userId,
      targetLanguage,
      history: [
        {
          id: 'c1',
          characterName: 'Marco - Café Barista',
          mode: 'scenario',
          date: new Date(Date.now() - 86400000).toISOString(),
          durationMinutes: 6,
          totalUserTurns: 8,
          fluencyScore: 82,
          pronunciationScore: 85,
          topicsDiscussed: ['Ordering coffee', 'Daily routine', 'Pastry preferences'],
          keyFeedbackSummary: 'Handled pastry choices well. Practiced ordering politely with "quisiera".',
        },
      ],
      favoriteCharacters: ['Marco - Café Barista', 'Sofia'],
      frequentTopics: ['Coffee & Gastronomy', 'Workplace', 'Travel Plans'],
      totalConversationTimeMinutes: 6,
    };
  }

  public get(): ConversationMemory {
    return { ...this.memory };
  }

  public logSession(sessionLog: ConversationSessionLog): void {
    this.memory.history.unshift(sessionLog);
    this.memory.totalConversationTimeMinutes += sessionLog.durationMinutes;

    if (!this.memory.favoriteCharacters.includes(sessionLog.characterName)) {
      this.memory.favoriteCharacters.push(sessionLog.characterName);
    }

    sessionLog.topicsDiscussed.forEach((topic) => {
      if (!this.memory.frequentTopics.includes(topic)) {
        this.memory.frequentTopics.push(topic);
      }
    });
  }

  public getRecentSessions(limit: number = 3): ConversationSessionLog[] {
    return this.memory.history.slice(0, limit);
  }
}
