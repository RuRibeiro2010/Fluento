/**
 * Módulo 7: Transfer Learning Engine
 * Validates that learned concepts are applied across multiple distinct contexts
 * (e.g., professional, casual, written, spoken) before being marked consolidated.
 */

export interface ContextApplication {
  contextName: string; // e.g., 'Reunião Executiva', 'Café / Viagem', 'E-mail Formal'
  appliedTimestamp: number;
  successScore: number; // 0 to 100
}

export interface TransferLearningState {
  conceptId: string;
  conceptName: string;
  applications: ContextApplication[];
  isTransferConsolidated: boolean;
}

export function registerContextApplication(
  state: TransferLearningState,
  newApplication: ContextApplication
): TransferLearningState {
  // Check if context already applied
  const existingIdx = state.applications.findIndex(
    (a) => a.contextName.toLowerCase() === newApplication.contextName.toLowerCase()
  );

  let updatedApplications = [...state.applications];
  if (existingIdx !== -1) {
    updatedApplications[existingIdx] = newApplication;
  } else {
    updatedApplications.push(newApplication);
  }

  // Require at least 3 distinct successful contexts (score >= 80)
  const successfulContexts = updatedApplications.filter((a) => a.successScore >= 80);
  const isTransferConsolidated = successfulContexts.length >= 3;

  return {
    ...state,
    applications: updatedApplications,
    isTransferConsolidated,
  };
}
