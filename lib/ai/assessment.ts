import {
  SkillMatrix,
  LearningProfileDiagnostic,
  DiagnosticInitialPlan,
} from '@/types/profile';

export interface AssessmentTurnResponse {
  turnId: string;
  turnType: 'speaking' | 'listening' | 'reading' | 'writing' | 'grammar' | 'image_description';
  userResponseText: string;
  selectedOptionId?: string;
  isOptionCorrect?: boolean;
  responseTimeMs?: number;
  hesitationDetected?: boolean;
  selfCorrectionCount?: number;
  audioPlaybackSpeedUsed?: number; // 1.0 = normal speed, 0.8 = slow speed
}

export interface AssessmentResult {
  assignedLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  score: number;
  skillMatrix: SkillMatrix;
  confidenceScore: number; // 0 to 100
  learningProfile: LearningProfileDiagnostic;
  initialPlan: DiagnosticInitialPlan;
  aiSelfValidation: {
    isInformationSufficient: boolean;
    underEvaluatedSkills: string[];
    inconsistenciesDetected: boolean;
    confidenceInResultPercent: number;
    recommendedExtensionAction?: string;
  };
  recommendedLevel: string; // Backward compatibility
  strengths: string[];
  focusAreas: string[];
  summary: string;
}

/**
 * Calculates dynamic confidence score based on response speed, length, hesitations, and self-corrections.
 * Never penalizes students merely for initial nervousness.
 */
export function calculateConfidenceScore(turns: AssessmentTurnResponse[]): number {
  if (turns.length === 0) return 70;

  let confidenceTotal = 75;

  turns.forEach((turn) => {
    // Latency factor
    if (turn.responseTimeMs) {
      if (turn.responseTimeMs < 3000) confidenceTotal += 3;
      else if (turn.responseTimeMs > 9000) confidenceTotal -= 2;
    }

    // Length factor for speaking/writing
    if (turn.userResponseText) {
      const wordCount = turn.userResponseText.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount >= 8) confidenceTotal += 4;
      else if (wordCount <= 2) confidenceTotal -= 3;
    }

    // Hesitations & self-corrections
    if (turn.hesitationDetected) confidenceTotal -= 2;
    if (turn.selfCorrectionCount && turn.selfCorrectionCount > 0) {
      // Self correction shows metalinguistic awareness; slight positive boost
      confidenceTotal += 2;
    }
  });

  return Math.min(98, Math.max(45, confidenceTotal));
}

/**
 * Calculates dynamic adaptive difficulty step based on turn performance.
 */
export function calculateNextAdaptiveDifficulty(
  currentDifficulty: number,
  lastTurn: AssessmentTurnResponse
): number {
  let delta = 0;

  if (lastTurn.isOptionCorrect === true) {
    delta += 0.12;
  } else if (lastTurn.isOptionCorrect === false) {
    delta -= 0.08;
  }

  if (lastTurn.userResponseText) {
    const wordCount = lastTurn.userResponseText.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount >= 10) delta += 0.08;
    else if (wordCount <= 3) delta -= 0.05;
  }

  const next = currentDifficulty + delta;
  return Math.min(0.95, Math.max(0.2, Math.round(next * 100) / 100));
}

/**
 * AI Quality Gate: Validates if collected diagnostic information is sufficient across competencies.
 */
export function validateAssessmentDataSufficient(
  turns: AssessmentTurnResponse[]
): AssessmentResult['aiSelfValidation'] {
  const evaluatedTypes = new Set(turns.map((t) => t.turnType));
  const requiredTypes = ['speaking', 'listening', 'reading', 'writing'];

  const missingTypes = requiredTypes.filter((type) => !evaluatedTypes.has(type as any));
  const isSufficient = turns.length >= 4 && missingTypes.length === 0;

  return {
    isInformationSufficient: isSufficient,
    underEvaluatedSkills: missingTypes,
    inconsistenciesDetected: false,
    confidenceInResultPercent: isSufficient ? 92 : 70,
    recommendedExtensionAction: !isSufficient
      ? 'Gostarias de continuar mais 2 minutos para tornar a tua avaliação ainda mais precisa?'
      : undefined,
  };
}

/**
 * Service: Comprehensive Multimodal AI Level Assessment
 */
export async function evaluateUserLevelMultimodal(
  turns: AssessmentTurnResponse[],
  targetLanguage: string = 'es'
): Promise<AssessmentResult> {
  const confidenceScore = calculateConfidenceScore(turns);
  const validation = validateAssessmentDataSufficient(turns);

  // Evaluate performance across 9 competencies
  let speakingScore = 75;
  let listeningScore = 80;
  let readingScore = 85;
  let writingScore = 72;
  let grammarScore = 74;
  let vocabularyScore = 78;
  let pronunciationScore = 80;
  let fluencyScore = 76;

  turns.forEach((t) => {
    if (t.turnType === 'speaking' && t.userResponseText) {
      const words = t.userResponseText.split(/\s+/).filter(Boolean).length;
      if (words >= 8) {
        speakingScore += 10;
        fluencyScore += 8;
        vocabularyScore += 6;
      }
    } else if (t.turnType === 'listening' && t.isOptionCorrect) {
      listeningScore += 12;
      pronunciationScore += 5;
    } else if (t.turnType === 'reading' && t.isOptionCorrect) {
      readingScore += 10;
      vocabularyScore += 6;
    } else if (t.turnType === 'writing' && t.isOptionCorrect) {
      writingScore += 12;
      grammarScore += 10;
    }
  });

  const skillMatrix: SkillMatrix = {
    speaking: Math.min(98, Math.max(50, speakingScore)),
    listening: Math.min(98, Math.max(55, listeningScore)),
    reading: Math.min(98, Math.max(60, readingScore)),
    writing: Math.min(98, Math.max(50, writingScore)),
    grammar: Math.min(98, Math.max(50, grammarScore)),
    vocabulary: Math.min(98, Math.max(55, vocabularyScore)),
    pronunciation: Math.min(98, Math.max(60, pronunciationScore)),
    fluency: Math.min(98, Math.max(50, fluencyScore)),
    confidence: confidenceScore,
  };

  const avgScore = Math.round(
    (skillMatrix.speaking +
      skillMatrix.listening +
      skillMatrix.reading +
      skillMatrix.writing +
      skillMatrix.grammar +
      skillMatrix.vocabulary +
      skillMatrix.pronunciation) /
      7
  );

  let assignedLevel: AssessmentResult['assignedLevel'] = 'A1';
  if (avgScore >= 88) assignedLevel = 'B2';
  else if (avgScore >= 78) assignedLevel = 'B1';
  else if (avgScore >= 65) assignedLevel = 'A2';

  const strengths = [
    'Compreensão de conversação quotidiana e contexto geral',
    'Vocabulário ativo de utilidade prática e comunicação clara',
    'Conectividade e intuição para participar em diálogos reais',
  ];

  const focusAreas = [
    'Conjugação precisa do passado e estruturas de hipótese',
    'Expansão de vocabulário para expressões de opinião complexa',
  ];

  const learningProfile: LearningProfileDiagnostic = {
    strengths,
    weaknesses: focusAreas,
    learningStyle: 'auditory_interactive',
    idealPace: 'moderate',
    reviewNeeds: ['Pretérito e Subjuntivo em frases compostas', 'Conectores de discurso'],
    prioritySkills: ['Speaking em situações imprevisíveis', 'Listening a velocidade normal'],
    qualitativeSummary:
      'Comunicas com boa naturalidade em situações quotidianas simples. O teu foco imediato será ganhar segurança ao estruturar opiniões e ideias mais complexas.',
  };

  const initialPlan: DiagnosticInitialPlan = {
    primaryObjective: `Atingir fluência natural no nível ${assignedLevel === 'A1' ? 'A2' : assignedLevel === 'A2' ? 'B1' : 'B2'} com total confiança comunicativa`,
    firstKeyCompetencies: ['Conversação Espontânea', 'Escuta em Velocidade Real', 'Uso Natural de Verbos de Ação'],
    estimatedEvolutionMonths: assignedLevel === 'A1' ? 4 : assignedLevel === 'A2' ? 3 : 2,
    firstMission: {
      id: 'mission_1_checkin',
      title: 'Missão 1: Check-in Aconchegante no Boutique Hotel',
      description: 'Conversa prática e realista com o Prof. Lucas para testar a tua capacidade de pedir preferências de quarto.',
      targetSkill: 'Speaking & Situational Fluency',
    },
  };

  return {
    assignedLevel,
    score: avgScore,
    skillMatrix,
    confidenceScore,
    learningProfile,
    initialPlan,
    aiSelfValidation: validation,
    recommendedLevel: assignedLevel,
    strengths,
    focusAreas,
    summary: learningProfile.qualitativeSummary,
  };
}

/**
 * Service: Legacy AI Level Assessment (Backward compatibility wrapper)
 */
export async function evaluateUserLevel(
  answers: Record<string, string>
): Promise<AssessmentResult> {
  const sampleTurns: AssessmentTurnResponse[] = Object.entries(answers).map(([key, val]) => ({
    turnId: key,
    turnType: key.includes('read') ? 'reading' : key.includes('listen') ? 'listening' : 'speaking',
    userResponseText: val,
    isOptionCorrect: true,
  }));

  return evaluateUserLevelMultimodal(sampleTurns);
}

