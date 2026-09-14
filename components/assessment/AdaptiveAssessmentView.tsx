import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Volume2,
  CheckCircle2,
  Award,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  BookOpen,
  PenTool,
  Headphones,
  Target,
  Clock,
  Loader2,
  Smile,
  Mic,
  Gauge,
  HelpCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { SkillMatrix, LearningProfileDiagnostic, DiagnosticInitialPlan } from '@/types/profile';
import {
  evaluateUserLevelMultimodal,
  calculateNextAdaptiveDifficulty,
  AssessmentTurnResponse,
} from '@/lib/ai/assessment';

export interface AssessmentResultData {
  assignedLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  score: number;
  skillMatrix: SkillMatrix;
  confidenceScore: number;
  learningProfile?: LearningProfileDiagnostic;
  initialPlan?: DiagnosticInitialPlan;
  strengths: string[];
  weaknesses: string[];
  recommendedFocus: string;
  estimatedMonthsToGoal: number;
}

interface AdaptiveAssessmentViewProps {
  userName?: string;
  targetLanguage?: string;
  uiLanguage?: string;
  onComplete: (result: AssessmentResultData) => void;
  onSkip?: () => void;
}

export function AdaptiveAssessmentView({
  userName = 'Aluno',
  targetLanguage = 'es',
  uiLanguage = 'pt',
  onComplete,
  onSkip,
}: AdaptiveAssessmentViewProps) {
  // Assessment mode: 'intro' | 'interactive' | 'extension_prompt' | 'results'
  const [stage, setStage] = useState<'intro' | 'interactive' | 'extension_prompt' | 'results'>('intro');

  // Interactive step index
  const [stepIndex, setStepIndex] = useState(0);

  // Real-time AI Difficulty rating (0.2 = A1, 0.45 = A2, 0.65 = B1, 0.85 = B2)
  const [currentAiDifficulty, setCurrentAiDifficulty] = useState(0.45);

  // Audio playback speed for listening tasks (1.0 = Normal, 0.8 = Slow)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Recorded turns data
  const [turnResponses, setTurnResponses] = useState<AssessmentTurnResponse[]>([]);

  // User current inputs
  const [userSpeechInput, setUserSpeechInput] = useState('');
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  // Turn timing & hesitation tracking
  const [turnStartTime] = useState<number>(Date.now());

  // Evaluation & Processing states
  const [isEvaluatingTurn, setIsEvaluatingTurn] = useState(false);

  // Final Generated Result
  const [finalResult, setFinalResult] = useState<AssessmentResultData | null>(null);

  // Multimodal Assessment Questions/Scenarios Sequence
  const assessmentTurns: {
    title: string;
    type: 'speaking' | 'listening' | 'reading' | 'writing' | 'image_description';
    teacherPrompt: string;
    translation: string;
    quizQuestion?: string;
    options?: { id: string; text: string; isCorrect: boolean }[];
    hintText?: string;
    imageUrl?: string;
  }[] = [
    {
      title: 'Conversação Natural & Speaking (Apresentação)',
      type: 'speaking',
      teacherPrompt: `¡Hola ${userName}! Encantado de conocerte. ¿De dónde eres y qué te motiva a aprender español hoy?`,
      translation: `Olá ${userName}! Prazer em conhecer-te. De onde és e o que te motiva a aprender espanhol hoje?`,
      hintText: 'Responde livremente falando ou digitando algumas palavras.',
    },
    {
      title: 'Listening Multimodal & Situação Real (Hotel Check-in)',
      type: 'listening',
      teacherPrompt:
        'Escucha con atención: "Buenas tardes, señor. Su habitación 304 está lista en la tercera planta con vista al parque. El desayuno es de 7 a 10 en la terraza."',
      translation:
        'Ouve com atenção: "Boa tarde, senhor. O seu quarto 304 está pronto no terceiro andar com vista para o parque. O pequeno-almoço é das 7 às 10 no terraço."',
      quizQuestion: '¿En qué lugar y horario se sirve el desayuno?',
      options: [
        { id: 'a', text: 'En la cafetería de 6:00 a 9:00', isCorrect: false },
        { id: 'b', text: 'En la terraza de 7:00 a 10:00', isCorrect: true },
        { id: 'c', text: 'En la habitación a las 8:30', isCorrect: false },
      ],
    },
    {
      title: 'Reading & Inferência de Contexto (Restaurante)',
      type: 'reading',
      teacherPrompt:
        'Lee el mensaje: "Quisiera reservar una mesa cerca de la ventana para celebrar nuestro aniversario esta noche, si es posible."',
      translation:
        'Lê a mensagem: "Gostaria de reservar uma mesa perto da janela para celebrar o nosso aniversário esta noite, se for possível."',
      quizQuestion: '¿Cuál es el propósito principal de la reserva?',
      options: [
        { id: 'a', text: 'Una reunión rápida de trabajo', isCorrect: false },
        { id: 'b', text: 'Celebrar una ocasión especial de aniversario', isCorrect: true },
        { id: 'c', text: 'Cancelar un almuerzo previo', isCorrect: false },
      ],
    },
    {
      title: 'Writing & Raciocínio Gramatical Adaptativo',
      type: 'writing',
      teacherPrompt:
        'Completa la frase en tu mente o escríbela: "Si tuviera más tiempo libre este fin de semana, yo ________ (viajar) a la playa con mis amigos."',
      translation:
        'Completa a frase: "Se eu tivesse mais tempo livre este fim de semana, eu ________ (viajar) para a praia com os meus amigos."',
      quizQuestion: '¿Cuál es la forma verbal correcta para expresar hipótesis?',
      options: [
        { id: 'a', text: 'viajaría', isCorrect: true },
        { id: 'b', text: 'viajé', isCorrect: false },
        { id: 'c', text: 'viajando', isCorrect: false },
      ],
    },
    {
      title: 'Descrição de Cenário Prático (Interação Urbana)',
      type: 'image_description',
      teacherPrompt:
        'Imagínate en una cafetería en Barcelona. Quieres pedir un café con leche y preguntar por la clave del Wi-Fi. ¿Cómo lo dirías?',
      translation:
        'Imagina-te numa cafeteria em Barcelona. Queres pedir um café com leite e perguntar a senha do Wi-Fi. Como o dirias?',
      hintText: 'Usa a tua forma mais natural de pedir cortêsmente.',
    },
  ];

  const currentTurn = assessmentTurns[stepIndex];

  const handleStartFullAssessment = () => {
    setStage('interactive');
    setStepIndex(0);
    setTurnResponses([]);
  };

  const processAssessmentCompletion = async (responses: AssessmentTurnResponse[]) => {
    setIsEvaluatingTurn(true);
    const result = await evaluateUserLevelMultimodal(responses, targetLanguage);

    const fullResultData: AssessmentResultData = {
      assignedLevel: result.assignedLevel,
      score: result.score,
      skillMatrix: result.skillMatrix,
      confidenceScore: result.confidenceScore,
      learningProfile: result.learningProfile,
      initialPlan: result.initialPlan,
      strengths: result.strengths,
      weaknesses: result.focusAreas,
      recommendedFocus: result.learningProfile.qualitativeSummary,
      estimatedMonthsToGoal: result.initialPlan.estimatedEvolutionMonths,
    };

    setFinalResult(fullResultData);
    setIsEvaluatingTurn(false);
    setStage('results');
  };

  const handleNextStep = () => {
    setIsEvaluatingTurn(true);

    const durationMs = Date.now() - turnStartTime;
    const isCorrect = currentTurn.quizQuestion
      ? currentTurn.options?.find((o) => o.id === selectedQuizOption)?.isCorrect
      : undefined;

    const turnData: AssessmentTurnResponse = {
      turnId: `turn_${stepIndex + 1}`,
      turnType: currentTurn.type,
      userResponseText: userSpeechInput,
      selectedOptionId: selectedQuizOption || undefined,
      isOptionCorrect: isCorrect,
      responseTimeMs: durationMs,
      audioPlaybackSpeedUsed: playbackSpeed,
    };

    const updatedResponses = [...turnResponses, turnData];
    setTurnResponses(updatedResponses);

    // Calculate dynamic adaptive difficulty update
    const nextDiff = calculateNextAdaptiveDifficulty(currentAiDifficulty, turnData);
    setCurrentAiDifficulty(nextDiff);

    setTimeout(() => {
      setIsEvaluatingTurn(false);
      setUserSpeechInput('');
      setSelectedQuizOption(null);

      if (stepIndex < assessmentTurns.length - 1) {
        setStepIndex((prev) => prev + 1);
      } else {
        // AI Quality Gate check before finalizing: Offer extension if user wants higher precision
        setStage('extension_prompt');
      }
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden font-sans text-white">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              Adaptive Assessment 2.0
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              {uiLanguage === 'pt'
                ? 'Diagnóstico pedagógico multimodal e adaptativo'
                : 'Multimodal adaptive pedagogical diagnostic'}
            </p>
          </div>
        </div>

        {stage === 'interactive' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {stepIndex + 1} / {assessmentTurns.length}
            </span>
          </div>
        )}
      </div>

      {/* STAGE 1: INTRO */}
      {stage === 'intro' && (
        <div className="space-y-6 py-6 text-center">
          <div className="inline-flex p-4 rounded-3xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 shadow-xl">
            <MessageSquare className="w-12 h-12" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {uiLanguage === 'pt' ? 'Conversa Diagnóstica de Nível' : 'Diagnostic Level Conversation'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {uiLanguage === 'pt'
                ? 'Sem questionários cansativos ou exames rígidos. Uma breve conversa natural para conhecer as tuas competências em 9 áreas distintas.'
                : 'No tiring questionnaires or rigid exams. A quick, natural conversation to map your skills across 9 distinct domains.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 max-w-md mx-auto text-xs">
            <div className="flex items-center gap-2 font-bold text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>9 Competências Avaliadas Separadamente:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-300">
              <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5 text-indigo-400" /> Speaking</span>
              <span className="flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5 text-indigo-400" /> Listening</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Reading</span>
              <span className="flex items-center gap-1.5"><PenTool className="w-3.5 h-3.5 text-indigo-400" /> Writing</span>
              <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-indigo-400" /> Grammar</span>
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Vocabulary</span>
              <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Pronúncia</span>
              <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-indigo-400" /> Fluidez</span>
              <span className="flex items-center gap-1.5"><Smile className="w-3.5 h-3.5 text-indigo-400" /> Confiança</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleStartFullAssessment}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition hover:scale-[1.02]"
            >
              <span>{uiLanguage === 'pt' ? 'Iniciar Conversa Diagnóstica' : 'Start Diagnostic Conversation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: INTERACTIVE ADAPTIVE TURN */}
      {stage === 'interactive' && (
        <div className="space-y-6 pt-4">
          {/* Dynamic AI Level Bar */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Nível Adaptativo em Tempo Real:</span>
            </span>
            <span className="font-extrabold text-amber-400">
              Dificuldade {Math.round(currentAiDifficulty * 100)}% ({currentAiDifficulty >= 0.7 ? 'CEFR B2' : currentAiDifficulty >= 0.5 ? 'CEFR B1' : 'CEFR A2'})
            </span>
          </div>

          {/* Turn Prompt */}
          <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-indigo-900/80 text-indigo-200 text-[10px] font-bold uppercase tracking-wider">
                {currentTurn.title}
              </span>

              {/* Listening Speed Toggle */}
              {currentTurn.type === 'listening' && (
                <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
                  <span className="text-slate-400">Velocidade:</span>
                  <button
                    type="button"
                    onClick={() => setPlaybackSpeed(1.0)}
                    className={`px-1.5 py-0.5 rounded font-bold ${playbackSpeed === 1.0 ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    1.0x
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaybackSpeed(0.8)}
                    className={`px-1.5 py-0.5 rounded font-bold ${playbackSpeed === 0.8 ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    0.8x (Lento)
                  </button>
                </div>
              )}
            </div>

            <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentTurn.teacherPrompt}
            </h4>
            <p className="text-xs text-slate-400 italic">Tradução: "{currentTurn.translation}"</p>
          </div>

          {/* Interactive Response Input or Micro Quiz */}
          {currentTurn.quizQuestion ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">{currentTurn.quizQuestion}</label>
              <div className="grid grid-cols-1 gap-2">
                {currentTurn.options?.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedQuizOption(opt.id)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                      selectedQuizOption === opt.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {selectedQuizOption === opt.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">A tua resposta expressa em espanhol:</label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={userSpeechInput}
                  onChange={(e) => setUserSpeechInput(e.target.value)}
                  placeholder="Digita ou fala a tua resposta com calma..."
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>
              {currentTurn.hintText && (
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{currentTurn.hintText}</span>
                </p>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isEvaluatingTurn}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isEvaluatingTurn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A analisar competências com IA...</span>
                </>
              ) : (
                <>
                  <span>
                    {stepIndex === assessmentTurns.length - 1
                      ? 'Concluir Diagnóstico'
                      : 'Próxima Atividade'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STAGE: OPTIONAL EXTENSION PROMPT (AI Self Validation) */}
      {stage === 'extension_prompt' && (
        <div className="space-y-6 py-6 text-center animate-in fade-in">
          <div className="inline-flex p-4 rounded-3xl bg-indigo-950/80 border border-indigo-700 text-indigo-300 shadow-xl">
            <Brain className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-xl font-extrabold text-white">
              Temos informação suficiente para o teu plano inicial!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gostarias de continuar mais alguns minutos para tornar a estimativa ainda mais precisa, ou queres ver os teus resultados agora?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => processAssessmentCompletion(turnResponses)}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition"
            >
              <span>Ver Resultados & Plano Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: RESULTS & 9 COMPETENCIES BREAKDOWN */}
      {stage === 'results' && finalResult && (
        <div className="space-y-6 py-2 text-center animate-in fade-in duration-300">
          <div className="inline-flex p-4 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-amber-400">
            <Award className="w-12 h-12" />
          </div>

          <div className="space-y-1 max-w-lg mx-auto">
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Diagnóstico Pedagógico Multimodal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Nível Atribuído: <span className="text-amber-400">{finalResult.assignedLevel}</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed italic pt-1">
              "{finalResult.recommendedFocus}"
            </p>
          </div>

          {/* 9 Competencies Grid */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                Matriz de 9 Competências Avaliadas
              </span>
              <span className="text-slate-400">Confiança Diagnóstica: {finalResult.confidenceScore}%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {[
                { label: 'Speaking', val: finalResult.skillMatrix.speaking },
                { label: 'Listening', val: finalResult.skillMatrix.listening },
                { label: 'Reading', val: finalResult.skillMatrix.reading },
                { label: 'Writing', val: finalResult.skillMatrix.writing },
                { label: 'Grammar', val: finalResult.skillMatrix.grammar },
                { label: 'Vocabulary', val: finalResult.skillMatrix.vocabulary },
                { label: 'Pronúncia', val: finalResult.skillMatrix.pronunciation },
                { label: 'Fluidez', val: finalResult.skillMatrix.fluency || 75 },
                { label: 'Confiança', val: finalResult.skillMatrix.confidence || finalResult.confidenceScore },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                    <span>{item.label}</span>
                    <span className="text-indigo-400 font-bold">{item.val}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50 space-y-1">
                <span className="font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pontos Fortes
                </span>
                <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
                  {finalResult.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/50 space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Foco de Evolução
                </span>
                <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
                  {finalResult.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onComplete(finalResult)}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition hover:scale-[1.01]"
          >
            <span>Ver Plano Personalizado & Avançar</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

