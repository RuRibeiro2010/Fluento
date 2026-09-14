/**
 * Conversation Flow Module (Human Teaching Engine)
 * Manages natural dialogue flow. Buffers non-critical errors during real-time dialogue
 * and provides smooth corrections at appropriate conversational pauses/transitions.
 */

export interface BufferedCorrection {
  id: string;
  originalText: string;
  suggestedCorrection: string;
  explanation: string;
  severity: 'minor_typo' | 'nuance_grammar' | 'critical_misunderstanding';
  timestampMs: number;
}

export interface ConversationTurn {
  speaker: 'user' | 'teacher';
  message: string;
  timestampMs: number;
  audioMetadata?: {
    durationSeconds?: number;
    speechRateWpm?: number;
  };
}

export interface ConversationFlowState {
  dialogueHistory: ConversationTurn[];
  bufferedCorrections: BufferedCorrection[];
  uninterruptedTurnsCount: number;
  maxUninterruptedTurnsBeforeFlush: number;
}

export function createInitialFlowState(): ConversationFlowState {
  return {
    dialogueHistory: [],
    bufferedCorrections: [],
    uninterruptedTurnsCount: 0,
    maxUninterruptedTurnsBeforeFlush: 3,
  };
}

export function processDialogueTurn(
  state: ConversationFlowState,
  userMessage: string,
  detectedCorrections: Omit<BufferedCorrection, 'id' | 'timestampMs'>[]
): {
  updatedState: ConversationFlowState;
  shouldDeliverImmediateCorrection: boolean;
  correctionsToDeliver: BufferedCorrection[];
} {
  const timestamp = Date.now();
  const userTurn: ConversationTurn = {
    speaker: 'user',
    message: userMessage,
    timestampMs: timestamp,
  };

  const newBuffered: BufferedCorrection[] = detectedCorrections.map((c, i) => ({
    ...c,
    id: `corr-${timestamp}-${i}`,
    timestampMs: timestamp,
  }));

  const hasCriticalError = newBuffered.some((c) => c.severity === 'critical_misunderstanding');
  const allBuffered = [...state.bufferedCorrections, ...newBuffered];
  const newTurnCount = state.uninterruptedTurnsCount + 1;

  const shouldFlush =
    hasCriticalError ||
    newTurnCount >= state.maxUninterruptedTurnsBeforeFlush ||
    allBuffered.length >= 4;

  const correctionsToDeliver = shouldFlush ? allBuffered : [];
  const remainingBuffered = shouldFlush ? [] : allBuffered;

  const updatedState: ConversationFlowState = {
    ...state,
    dialogueHistory: [...state.dialogueHistory, userTurn],
    bufferedCorrections: remainingBuffered,
    uninterruptedTurnsCount: shouldFlush ? 0 : newTurnCount,
  };

  return {
    updatedState,
    shouldDeliverImmediateCorrection: shouldFlush,
    correctionsToDeliver,
  };
}

export function formatBufferedCorrectionsSummary(corrections: BufferedCorrection[]): string {
  if (corrections.length === 0) return '';

  const bulletPoints = corrections
    .map((c) => `• Em vez de "${c.originalText}", o mais natural seria "${c.suggestedCorrection}". (${c.explanation})`)
    .join('\n');

  return `Nota rápida de apoio ao teu raciocínio:\n${bulletPoints}`;
}
