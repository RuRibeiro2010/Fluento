/**
 * Intervention Engine Module (Live Experience Engine)
 * Central decision engine that evaluates student speech in real time to decide:
 * when to intervene immediately, when to wait for a conversational pause,
 * when to guide discovery, or when to let the dialogue flow uninterrupted.
 */

import { LessonMode } from './lesson-modes';
import { canDeliverCorrection, CorrectionBudgetTracker } from './correction-budget';

export type InterventionDecisionType =
  | 'ALLOW_FLOW' // Let student speak without any interruption
  | 'BUFFER_FOR_PAUSE' // Store correction for natural dialogue pause
  | 'INTERVENE_IMMEDIATELY' // Immediate correction (critical error or grammar lab)
  | 'GUIDED_DISCOVERY_QUESTION' // Prompt student to discover answer via question
  | 'OFFER_SCAFFOLDED_HINT'; // Provide hint on hesitation

export interface LiveSpeechAnalysisContext {
  utteranceText: string;
  isGrammaticallyCorrect: boolean;
  detectedErrors: Array<{
    phrase: string;
    correction: string;
    severity: 'minor_nuance' | 'moderate' | 'critical_barrier';
    category: 'grammar' | 'vocabulary' | 'pronunciation';
  }>;
  activeMode: LessonMode;
  budgetTracker: CorrectionBudgetTracker;
  studentConfidenceScore: number; // 0 to 100
  isUserHesitating: boolean;
}

export interface InterventionDecisionResult {
  decision: InterventionDecisionType;
  primaryRationale: string;
  correctionsToApplyImmediately: LiveSpeechAnalysisContext['detectedErrors'];
  correctionsToBuffer: LiveSpeechAnalysisContext['detectedErrors'];
  teacherSpeechPrompt?: string;
}

export function evaluateLiveIntervention(
  context: LiveSpeechAnalysisContext
): InterventionDecisionResult {
  const { detectedErrors, activeMode, budgetTracker, isUserHesitating, studentConfidenceScore } = context;

  // Case 1: No errors detected
  if (detectedErrors.length === 0) {
    if (isUserHesitating) {
      return {
        decision: 'OFFER_SCAFFOLDED_HINT',
        primaryRationale: 'Aluno sem erros mas com hesitação. Oferecer incentivo leve.',
        correctionsToApplyImmediately: [],
        correctionsToBuffer: [],
        teacherSpeechPrompt: 'Estás no bom caminho. Continua o teu raciocínio!',
      };
    }
    return {
      decision: 'ALLOW_FLOW',
      primaryRationale: 'Expressão sem erros significativos. Manter o fluxo natural da conversa.',
      correctionsToApplyImmediately: [],
      correctionsToBuffer: [],
    };
  }

  // Case 2: Errors detected - inspect highest severity error
  const hasCriticalError = detectedErrors.some((e) => e.severity === 'critical_barrier');
  const budgetCheck = canDeliverCorrection(
    budgetTracker,
    hasCriticalError ? 'critical_barrier' : detectedErrors[0].severity
  );

  // If budget forbids correction or mode is Free Conversation with minor error -> Buffer
  if (!budgetCheck.allowed || activeMode === 'free_conversation' || activeMode === 'roleplay') {
    if (hasCriticalError) {
      return {
        decision: 'GUIDED_DISCOVERY_QUESTION',
        primaryRationale: 'Erro crítico de comunicação. Fazer pergunta orientadora sem dar resposta pronta.',
        correctionsToApplyImmediately: [],
        correctionsToBuffer: detectedErrors,
        teacherSpeechPrompt: 'Compreendi a tua ideia! Mas como dirias essa ação de forma mais precisa?',
      };
    }

    return {
      decision: 'BUFFER_FOR_PAUSE',
      primaryRationale: 'Preservar fluência e confiança. Guardar notas para a pausa da conversa.',
      correctionsToApplyImmediately: [],
      correctionsToBuffer: detectedErrors,
    };
  }

  // Case 3: Mode is Grammar Lab or Writing -> Intervene immediately or use Guided Discovery
  if (activeMode === 'grammar_lab' || activeMode === 'writing' || activeMode === 'pronunciation_coach') {
    if (studentConfidenceScore < 50) {
      return {
        decision: 'GUIDED_DISCOVERY_QUESTION',
        primaryRationale: 'Modo de precisão técnica com baixa confiança. Usar descoberta guiada.',
        correctionsToApplyImmediately: [],
        correctionsToBuffer: [],
        teacherSpeechPrompt: `Repara nesta estrutura: em vez de "${detectedErrors[0].phrase}", o que soaria mais natural?`,
      };
    }

    return {
      decision: 'INTERVENE_IMMEDIATELY',
      primaryRationale: 'Modo focado em precisão técnica. Fornecer correção construtiva com enquadramento positivo.',
      correctionsToApplyImmediately: detectedErrors,
      correctionsToBuffer: [],
    };
  }

  // Default: Buffer minor errors, keep conversation moving
  return {
    decision: 'BUFFER_FOR_PAUSE',
    primaryRationale: 'Prioridade à comunicação fluida. Guardar correções secundárias.',
    correctionsToApplyImmediately: [],
    correctionsToBuffer: detectedErrors,
  };
}
