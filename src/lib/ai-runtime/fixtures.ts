/**
 * FLUENTO AI RUNTIME - FIXTURES
 * 
 * Provides mock data, requests, responses, and simulated providers for testing and validation.
 */

import { ModelRequest, ModelResponse, StreamChunk, TokenUsageRecord, TelemetryEvent } from './types';

export const mockModelRequest: ModelRequest = {
  requestId: 'req_fixture_001',
  prompt: 'Explica o conceito de Present Perfect em Inglês com 2 exemplos práticos.',
  systemInstruction: 'És um tutor especialista na língua inglesa para alunos falantes de Português.',
  temperature: 0.7,
  maxTokens: 300,
  providerPreference: ['gemini', 'openai'],
  sessionId: 'sess_12345',
  studentId: 'student_67890',
  timeoutMs: 5000
};

export const mockModelResponse: ModelResponse = {
  requestId: 'req_fixture_001',
  content: 'O Present Perfect descreve ações que aconteceram no passado mas têm relação com o presente.\nExemplo 1: "I have lived in Lisbon for 5 years."\nExemplo 2: "She has lost her keys."',
  provider: 'gemini',
  modelName: 'gemini-3.6-flash',
  promptTokens: 42,
  completionTokens: 58,
  totalTokens: 100,
  estimatedCostUsd: 0.000021,
  latencyMs: 340,
  fallbackOccurred: false,
  attempts: 1,
  timestampIso: new Date().toISOString()
};

export const mockStreamChunks: StreamChunk[] = [
  { requestId: 'req_fixture_001', delta: 'O ', done: false, provider: 'gemini', modelName: 'gemini-3.6-flash' },
  { requestId: 'req_fixture_001', delta: 'Present Perfect ', done: false, provider: 'gemini', modelName: 'gemini-3.6-flash' },
  { requestId: 'req_fixture_001', delta: 'descreve ações...', done: false, provider: 'gemini', modelName: 'gemini-3.6-flash' },
  { requestId: 'req_fixture_001', delta: '', done: true, provider: 'gemini', modelName: 'gemini-3.6-flash' }
];

export const mockTokenUsageRecord: TokenUsageRecord = {
  recordId: 'tok_001',
  timestampIso: new Date().toISOString(),
  provider: 'gemini',
  modelName: 'gemini-3.6-flash',
  promptTokens: 42,
  completionTokens: 58,
  estimatedCostUsd: 0.000021,
  sessionId: 'sess_12345',
  studentId: 'student_67890'
};

export const mockTelemetryEvent: TelemetryEvent = {
  eventId: 'tel_001',
  timestampIso: new Date().toISOString(),
  eventType: 'request_success',
  provider: 'gemini',
  modelName: 'gemini-3.6-flash',
  latencyMs: 340,
  sessionId: 'sess_12345'
};
