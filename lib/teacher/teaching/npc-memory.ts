/**
 * NPC Memory Module (Human Teaching Engine)
 * Enables roleplay NPCs to recall past student interactions, personal details,
 * hobbies, and previous mistakes to build realistic long-term rapport.
 */

export interface NPCProfile {
  npcId: string;
  name: string;
  role: string; // e.g. 'Garçom em Sevilha', 'Gerente de Contratação', 'Taxista'
  personalityTraits: string[];
  preferredCEFRLevel: string;
  avatarImageName?: string;
}

export interface NPCMemoryItem {
  memoryId: string;
  npcId: string;
  studentFact: string; // e.g., 'Gosta de café cortado sem açúcar', 'Trabalha em Tecnologia'
  emotionalSentiment: 'positive' | 'neutral' | 'empathetic_support';
  recordedTimestampMs: number;
}

export interface NPCRelationshipState {
  npcId: string;
  relationshipLevel: 'stranger' | 'acquaintance' | 'trusted_friend' | 'colleague';
  memories: NPCMemoryItem[];
}

export function createInitialNPCRelationship(npcId: string): NPCRelationshipState {
  return {
    npcId,
    relationshipLevel: 'stranger',
    memories: [],
  };
}

export function addNPCMemory(
  state: NPCRelationshipState,
  fact: string,
  sentiment: NPCMemoryItem['emotionalSentiment'] = 'positive'
): NPCRelationshipState {
  const newMemory: NPCMemoryItem = {
    memoryId: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    npcId: state.npcId,
    studentFact: fact,
    emotionalSentiment: sentiment,
    recordedTimestampMs: Date.now(),
  };

  const updatedMemories = [newMemory, ...state.memories].slice(0, 20); // Keep top 20 memories

  let newLevel = state.relationshipLevel;
  if (updatedMemories.length >= 8) newLevel = 'trusted_friend';
  else if (updatedMemories.length >= 3) newLevel = 'acquaintance';

  return {
    ...state,
    relationshipLevel: newLevel,
    memories: updatedMemories,
  };
}

export function formatNPCContextForPrompt(
  npc: NPCProfile,
  relationship: NPCRelationshipState
): string {
  const memoryBullets = relationship.memories
    .slice(0, 5)
    .map((m) => `- ${m.studentFact}`)
    .join('\n');

  return `Instruções da Personagem NPC:
Nome: ${npc.name} (${npc.role}).
Nível de Relação com o Aluno: ${relationship.relationshipLevel}.
Fatos Lembrados sobre o Aluno:
${memoryBullets || '- Nenhuma conversa anterior registrada.'}
Instrução: Faz uma referência natural e subtil a pelo menos um destes fatos durante o início da conversa.`;
}
