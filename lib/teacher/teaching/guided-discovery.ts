/**
 * Guided Discovery Module (Human Teaching Engine)
 * Replaces direct answer reveals with Socratic questions, scaffolded reasoning,
 * and guided discovery steps to build deep conceptual understanding.
 */

export interface GuidedDiscoveryStep {
  stepIndex: number;
  socraticQuestion: string;
  hintConcept: string;
  expectedKeywords: string[];
  nativeBridgeHint?: string;
  audioPromptText?: string; // Prepared for Gemini Live / Realtime voice
}

export interface DiscoveryState {
  conceptId: string;
  conceptName: string;
  targetAnswer: string;
  currentStepIndex: number;
  totalSteps: number;
  isResolved: boolean;
  historySteps: Array<{
    stepIndex: number;
    studentAttempt: string;
    wasHelpful: boolean;
  }>;
}

export function initializeDiscoveryState(
  conceptId: string,
  conceptName: string,
  targetAnswer: string,
  discoverySteps: GuidedDiscoveryStep[]
): DiscoveryState {
  return {
    conceptId,
    conceptName,
    targetAnswer,
    currentStepIndex: 0,
    totalSteps: discoverySteps.length,
    isResolved: false,
    historySteps: [],
  };
}

export function getNextSocraticStep(
  state: DiscoveryState,
  steps: GuidedDiscoveryStep[]
): GuidedDiscoveryStep | null {
  if (state.isResolved || state.currentStepIndex >= steps.length) {
    return null;
  }
  return steps[state.currentStepIndex];
}

export function evaluateDiscoveryAttempt(
  state: DiscoveryState,
  studentAttempt: string,
  currentStep: GuidedDiscoveryStep
): {
  updatedState: DiscoveryState;
  isConceptUnderstood: boolean;
  feedbackQuestion: string;
  audioResponsePrompt?: string;
} {
  const normalizedAttempt = studentAttempt.toLowerCase().trim();
  const matchedKeywords = currentStep.expectedKeywords.filter((kw) =>
    normalizedAttempt.includes(kw.toLowerCase())
  );

  const isStepSuccessful = matchedKeywords.length > 0;
  const isFinalStep = state.currentStepIndex >= state.totalSteps - 1;
  const isConceptUnderstood = isStepSuccessful && isFinalStep;

  const nextIndex = isStepSuccessful ? state.currentStepIndex + 1 : state.currentStepIndex;
  const isResolved = isConceptUnderstood;

  const updatedState: DiscoveryState = {
    ...state,
    currentStepIndex: nextIndex,
    isResolved,
    historySteps: [
      ...state.historySteps,
      {
        stepIndex: state.currentStepIndex,
        studentAttempt,
        wasHelpful: isStepSuccessful,
      },
    ],
  };

  let feedbackQuestion = '';
  if (isConceptUnderstood) {
    feedbackQuestion = `Exatamente! Viste como a resposta natural é "${state.targetAnswer}"? Consegues perceber o motivo?`;
  } else if (isStepSuccessful) {
    feedbackQuestion = `Boa dedução! Sabendo disso, como completarias a frase com mais clareza?`;
  } else {
    feedbackQuestion = `Olha com atenção: ${currentStep.socraticQuestion}`;
  }

  return {
    updatedState,
    isConceptUnderstood,
    feedbackQuestion,
    audioResponsePrompt: currentStep.audioPromptText || feedbackQuestion,
  };
}
