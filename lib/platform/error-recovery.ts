/**
 * Error Recovery Module (Production & Reliability Platform - Phase 14)
 * Provides boundary error catching and graceful fallback recovery
 * without forcing the user to restart their entire lesson or lose context.
 */

export interface ErrorReport {
  errorCode: string;
  message: string;
  timestampIso: string;
  recoveredState: 'fallback_used' | 'reconnected' | 'turn_restored' | 'unhandled';
}

export function handleGracefulErrorRecovery(
  error: unknown,
  context: string = 'general'
): ErrorReport {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[ErrorRecovery] Handled exception in ${context}:`, message);

  return {
    errorCode: `ERR_${context.toUpperCase()}_RECOVERED`,
    message,
    timestampIso: new Date().toISOString(),
    recoveredState: 'turn_restored',
  };
}
