/**
 * FLUENTO AI RUNTIME - TYPES & INTERFACES
 * 
 * Defines core execution types, request/response models, telemetry contracts,
 * cost tracking specs, and provider interfaces for multi-LLM orchestration.
 */

export type SupportedProvider = 'gemini' | 'openai' | 'anthropic' | 'mock';

export interface ModelRequest {
  requestId?: string;
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  providerPreference?: SupportedProvider[];
  modelName?: string;
  sessionId?: string;
  studentId?: string;
  timeoutMs?: number;
}

export interface ModelResponse {
  requestId: string;
  content: string;
  provider: SupportedProvider;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  fallbackOccurred: boolean;
  attempts: number;
  timestampIso: string;
}

export interface StreamChunk {
  requestId: string;
  delta: string;
  done: boolean;
  provider: SupportedProvider;
  modelName: string;
}

export interface ProviderHealth {
  provider: SupportedProvider;
  isHealthy: boolean;
  consecutiveFailures: number;
  lastFailureTimeIso?: string;
  cooldownUntilIso?: string;
}

export interface TokenUsageRecord {
  recordId: string;
  timestampIso: string;
  provider: SupportedProvider;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  sessionId?: string;
  studentId?: string;
}

export interface TelemetryEvent {
  eventId: string;
  timestampIso: string;
  eventType: 
    | 'request_started' 
    | 'request_success' 
    | 'request_failed' 
    | 'retry_attempted' 
    | 'fallback_triggered' 
    | 'rate_limit_exceeded'
    | 'timeout_triggered';
  provider: SupportedProvider;
  modelName: string;
  latencyMs?: number;
  errorDetails?: string;
  attemptNumber?: number;
  sessionId?: string;
}

export interface RetryConfig {
  maxRetries: number; // Default e.g. 3
  initialDelayMs: number; // Default e.g. 500
  backoffFactor: number; // Default e.g. 2.0
}

export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  tokensPerMinuteLimit: number;
}
