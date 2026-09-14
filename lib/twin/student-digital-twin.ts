/**
 * Master Student Digital Twin Engine (Sprint 4)
 * The primary digital twin system representing the student's complete linguistic knowledge,
 * cognitive profile, emotional mindset, evolving preferences, learning habits, context,
 * memory graph, prediction model, confidence recovery, and teacher adaptation rules.
 */

import {
  StudentDigitalTwinState,
  LinguisticProfile,
  CognitiveProfile,
  EmotionalProfile,
  EvolvingPreferences,
  LearningHabits,
  PersonalContext,
  TeacherAdaptationParams,
  TwinExplainabilityEntry,
  TwinPredictionResult,
  CEFRLevel,
} from './digital-twin-types';
import { MemoryGraphEngine } from './memory-graph';
import { ConfidenceRecoveryEngine } from './confidence-recovery';
import { LearningDnaEngine } from './learning-dna';
import { TwinPredictionEngine } from './prediction-engine';

export interface PostSessionTelemetry {
  sessionId: string;
  durationMinutes: number;
  overallScore: number; // 0-100
  speakingScore?: number;
  listeningScore?: number;
  grammarScore?: number;
  vocabularyScore?: number;
  pronunciationScore?: number;
  fluencyScore?: number;
  confidenceSelfRating?: number; // 1-10
  perceivedFrustration?: number; // 0-100
  perceivedFatigue?: number; // 0-10
  wordsLearnedCount?: number;
  grammarErrorsCount?: number;
  modalityUsed?: 'conversation' | 'examples' | 'analogies' | 'guided_discovery' | 'challenge';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export class StudentDigitalTwinEngine {
  private state: StudentDigitalTwinState;
  private memoryGraphEngine: MemoryGraphEngine;
  private recoveryEngine: ConfidenceRecoveryEngine;
  private dnaEngine: LearningDnaEngine;

  constructor(initialState?: Partial<StudentDigitalTwinState>) {
    this.memoryGraphEngine = new MemoryGraphEngine(initialState?.memoryGraph);
    this.recoveryEngine = new ConfidenceRecoveryEngine(initialState?.recoveryState);
    this.dnaEngine = new LearningDnaEngine(initialState?.learningDna);

    this.state = {
      userId: initialState?.userId || 'usr_guest',
      version: '4.0.0-alpha',
      lastUpdatedIso: new Date().toISOString(),

      linguistic: initialState?.linguistic || this.defaultLinguisticProfile(),
      cognitive: initialState?.cognitive || this.defaultCognitiveProfile(),
      emotional: initialState?.emotional || this.defaultEmotionalProfile(),
      preferences: initialState?.preferences || this.defaultEvolvingPreferences(),
      habits: initialState?.habits || this.defaultLearningHabits(),
      context: initialState?.context || this.defaultPersonalContext(),
      learningDna: this.dnaEngine.getDNA(),
      recoveryState: this.recoveryEngine.getState(),
      memoryGraph: this.memoryGraphEngine.getGraph(),
      adaptationParams: initialState?.adaptationParams || this.defaultAdaptationParams(),
      explainabilityLog: initialState?.explainabilityLog || [
        {
          id: 'exp_init',
          timestampIso: new Date().toISOString(),
          triggerEvent: 'Digital Twin Initialization',
          observation: 'Perfil inicial de aprendiz criado com base em diagnóstico e preferências de onboarding',
          systemAction: 'Configurados parâmetros adaptativos de partida (CEFR A2-B1)',
          impactAssessment: 'Digital Twin pronto para orquestração contínua',
        },
      ],
    };
  }

  // --- Default Profile Generators ---
  private defaultLinguisticProfile(): LinguisticProfile {
    return {
      overallCEFR: 'A2',
      skillCEFR: {
        speaking: 'A2',
        listening: 'B1',
        reading: 'B1',
        writing: 'A2',
        grammar: 'A2',
        vocabulary: 'B1',
        pronunciation: 'A2',
        fluency: 'A2',
        confidence: 'A2',
      },
      skillScores: {
        speaking: 58,
        listening: 68,
        reading: 78,
        writing: 62,
        grammar: 65,
        vocabulary: 72,
        pronunciation: 64,
        fluency: 60,
        confidence: 60,
      },
      activeVocabularyCount: 240,
      passiveVocabularyCount: 650,
      masteredGrammarConceptsCount: 14,
      strugglingGrammarConcepts: ['Pretérito Indefinido vs Imperfecto', 'Subjuntivo em Frases de Dúvida'],
      phoneticFlaws: ['Som do R dobrado em Espanhol', 'Vogais Abertas'],
    };
  }

  private defaultCognitiveProfile(): CognitiveProfile {
    return {
      learningSpeed: 'steady',
      forgettingRate: 'moderate',
      concentrationSpanMinutes: 15,
      idealCognitiveLoad: 'balanced',
      idealSessionDurationMinutes: 15,
      idealPacing: 'standard',
      averageResponseTimeSeconds: 4.2,
    };
  }

  private defaultEmotionalProfile(): EmotionalProfile {
    return {
      confidenceScore: 65,
      anxietyScore: 25,
      motivationScore: 85,
      persistenceScore: 80,
      frustrationIndex: 15,
    };
  }

  private defaultEvolvingPreferences(): EvolvingPreferences {
    return {
      examplesWeight: 0.8,
      analogiesWeight: 0.7,
      visualsWeight: 0.6,
      guidedDiscoveryWeight: 0.75,
      repetitionWeight: 0.5,
      conversationWeight: 0.9,
      challengesWeight: 0.65,
      lastUpdatedIso: new Date().toISOString(),
    };
  }

  private defaultLearningHabits(): LearningHabits {
    return {
      preferredTimeOfDay: 'evening',
      sessionLengthPreference: 'medium',
      consecutiveDaysActive: 4,
      spacedReviewAdherenceScore: 82,
      frequentStudyDays: ['Segunda', 'Quarta', 'Sexta', 'Sábado'],
    };
  }

  private defaultPersonalContext(): PersonalContext {
    return {
      profession: 'Engenheiro de Software',
      hobbies: ['Fotografia', 'Café Especial', 'Tecnologia', 'Caminhadas'],
      goals: ['Aumentar autonomia em reuniões internacionais', 'Viagem para Espanha'],
      upcomingEvents: ['Apresentação de Projeto no próximo mês'],
      specificInterests: ['Inteligência Artificial', 'Gastronomia', 'Cultura Ibero-Americana'],
      nativeLanguage: 'pt',
    };
  }

  private defaultAdaptationParams(): TeacherAdaptationParams {
    return {
      tone: 'encouraging',
      speechSpeedRatio: 0.95,
      exampleCategory: 'corporate',
      correctionDensity: 'selective',
      pauseDurationSeconds: 1.5,
      reviewPromptFrequency: 'balanced',
      challengeScale: 0.6,
    };
  }

  /**
   * Retrieves full state of the Digital Twin.
   */
  public getTwinState(): StudentDigitalTwinState {
    return {
      ...this.state,
      memoryGraph: this.memoryGraphEngine.getGraph(),
      recoveryState: this.recoveryEngine.getState(),
      learningDna: this.dnaEngine.getDNA(),
    };
  }

  /**
   * Predicts future forgetting, readiness for advancement, and cognitive blockers.
   */
  public generatePredictions(): TwinPredictionResult {
    return TwinPredictionEngine.predict({
      userId: this.state.userId,
      daysSinceLastSession: 1,
      averageAccuracyRate: this.state.linguistic.skillScores.grammar,
      recentStreakDays: this.state.habits.consecutiveDaysActive,
      confidenceScore: this.state.emotional.confidenceScore,
      memoryGraphEngine: this.memoryGraphEngine,
    });
  }

  /**
   * Post-Session Twin Evolution Engine:
   * Dynamically updates linguistic skills, cognitive load, emotional scores,
   * modality preferences, confidence recovery, teacher adaptation parameters,
   * and logs internal explainability entries.
   */
  public updateTwinAfterSession(telemetry: PostSessionTelemetry): StudentDigitalTwinState {
    const prevConfidence = this.state.emotional.confidenceScore;
    const isGoodSession = telemetry.overallScore >= 75;

    // 1. Update Linguistic Competencies
    if (telemetry.speakingScore !== undefined) {
      this.state.linguistic.skillScores.speaking = Math.round(
        this.state.linguistic.skillScores.speaking * 0.8 + telemetry.speakingScore * 0.2
      );
    }
    if (telemetry.grammarScore !== undefined) {
      this.state.linguistic.skillScores.grammar = Math.round(
        this.state.linguistic.skillScores.grammar * 0.8 + telemetry.grammarScore * 0.2
      );
    }
    if (telemetry.listeningScore !== undefined) {
      this.state.linguistic.skillScores.listening = Math.round(
        this.state.linguistic.skillScores.listening * 0.8 + telemetry.listeningScore * 0.2
      );
    }

    if (telemetry.wordsLearnedCount) {
      this.state.linguistic.activeVocabularyCount += Math.round(telemetry.wordsLearnedCount * 0.6);
      this.state.linguistic.passiveVocabularyCount += Math.round(telemetry.wordsLearnedCount * 0.4);
    }

    // Recalculate CEFR estimate
    const avgScore = Math.round(
      (this.state.linguistic.skillScores.speaking +
        this.state.linguistic.skillScores.listening +
        this.state.linguistic.skillScores.grammar +
        this.state.linguistic.skillScores.reading) / 4
    );

    if (avgScore >= 88) this.state.linguistic.overallCEFR = 'C1';
    else if (avgScore >= 78) this.state.linguistic.overallCEFR = 'B2';
    else if (avgScore >= 65) this.state.linguistic.overallCEFR = 'B1';
    else if (avgScore >= 50) this.state.linguistic.overallCEFR = 'A2';
    else this.state.linguistic.overallCEFR = 'A1';

    // 2. Update Emotional Profile
    const confidenceDelta = isGoodSession ? 3 : -2;
    this.state.emotional.confidenceScore = Math.min(100, Math.max(10, this.state.emotional.confidenceScore + confidenceDelta));
    this.state.emotional.frustrationIndex = telemetry.perceivedFrustration !== undefined
      ? Math.round(this.state.emotional.frustrationIndex * 0.7 + telemetry.perceivedFrustration * 0.3)
      : Math.max(0, this.state.emotional.frustrationIndex - 5);

    // 3. Evaluate Confidence Recovery Model
    this.state.recoveryState = this.recoveryEngine.evaluateAndTrigger({
      currentConfidenceScore: this.state.emotional.confidenceScore,
      recentSessionScores: [telemetry.overallScore],
      frustrationIndex: this.state.emotional.frustrationIndex,
      perceivedFatigue: telemetry.perceivedFatigue || 3,
    });

    // 4. Update Evolving Preferences based on modality feedback
    if (telemetry.modalityUsed === 'analogies' && isGoodSession) {
      this.state.preferences.analogiesWeight = Math.min(1.0, this.state.preferences.analogiesWeight + 0.05);
    } else if (telemetry.modalityUsed === 'examples' && isGoodSession) {
      this.state.preferences.examplesWeight = Math.min(1.0, this.state.preferences.examplesWeight + 0.05);
    } else if (telemetry.modalityUsed === 'conversation' && isGoodSession) {
      this.state.preferences.conversationWeight = Math.min(1.0, this.state.preferences.conversationWeight + 0.05);
    }
    this.state.preferences.lastUpdatedIso = new Date().toISOString();

    // 5. Update Teacher Adaptation Parameters
    if (this.state.recoveryState.isInRecoveryMode) {
      this.state.adaptationParams = {
        tone: 'empathetic',
        speechSpeedRatio: 0.85,
        exampleCategory: 'conversational',
        correctionDensity: 'minimal',
        pauseDurationSeconds: 2.0,
        reviewPromptFrequency: 'high',
        challengeScale: 0.35,
      };
    } else if (this.state.emotional.confidenceScore >= 80 && isGoodSession) {
      this.state.adaptationParams = {
        tone: 'energetic',
        speechSpeedRatio: 1.05,
        exampleCategory: 'corporate',
        correctionDensity: 'thorough',
        pauseDurationSeconds: 1.2,
        reviewPromptFrequency: 'balanced',
        challengeScale: 0.85,
      };
    } else {
      this.state.adaptationParams = this.defaultAdaptationParams();
    }

    // 6. Record Internal Explainability Entry
    const explainEntry: TwinExplainabilityEntry = {
      id: `exp_${Date.now()}`,
      timestampIso: new Date().toISOString(),
      triggerEvent: `Conclusão da Sessão ${telemetry.sessionId}`,
      observation: `Pontuação global de ${telemetry.overallScore}%. Variação de confiança: ${prevConfidence}% -> ${this.state.emotional.confidenceScore}%.`,
      systemAction: this.state.recoveryState.isInRecoveryMode
        ? 'Ativado Modo de Recuperação de Confiança com redução de dificuldade'
        : `Ajustado tom do professor para "${this.state.adaptationParams.tone}" e escala de desafio para ${this.state.adaptationParams.challengeScale}`,
      impactAssessment: 'Evolução do Digital Twin registada e sincronizada para a próxima orquestração',
    };

    this.state.explainabilityLog.unshift(explainEntry);
    if (this.state.explainabilityLog.length > 50) {
      this.state.explainabilityLog.pop();
    }

    this.state.lastUpdatedIso = new Date().toISOString();
    return this.getTwinState();
  }

  /**
   * Retrieves internal audit explainability log.
   */
  public getExplainabilityLog(): TwinExplainabilityEntry[] {
    return [...this.state.explainabilityLog];
  }
}
