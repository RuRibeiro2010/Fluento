import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Loader2,
  BookOpen,
  Target,
} from 'lucide-react';
import { lessonRoomAdapter } from '@/src/application/adapters';
import {
  ConversationSessionDTO,
  LessonSessionSummaryDTO,
} from '@/src/application/dto/conversation.dtos';
import {
  ConversationMessage,
  ConversationSessionState,
} from '@/src/domain/session/entities/conversation-session.entity';

interface VirtualTeacherLessonRoomProps {
  lessonId?: string;
  studentId?: string;
  onBackToDashboard?: () => void;
}

export const VirtualTeacherLessonRoom: React.FC<VirtualTeacherLessonRoomProps> = ({
  lessonId = 'lesson-exec-1',
  studentId = 'usr_fluento_primary',
  onBackToDashboard,
}) => {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [studentInput, setStudentInput] = useState('');
  const [sessionState, setSessionState] = useState<ConversationSessionState>('idle');
  const [currentSession, setCurrentSession] = useState<ConversationSessionDTO | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<LessonSessionSummaryDTO | null>(null);
  const [isRetryingHealth, setIsRetryingHealth] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  // Session Timer
  useEffect(() => {
    if (sessionState === 'completed' || sessionState === 'idle') return;
    const interval = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionState]);

  // Initialize Conversation Session via Application Layer
  const initLessonRoom = async () => {
    setSessionState('loading');
    setErrorMessage(null);

    try {
      const session = await lessonRoomAdapter.startSession({
        lessonId,
        studentId,
      });

      setCurrentSession(session);
      setMessages([...session.messages]);
      setSessionState(session.state);
      setTurnCount(session.turnsCount);
    } catch (err: any) {
      setSessionState('error');
      setErrorMessage(err?.message || 'Falha ao contactar a Application Layer do Fluento.');
    }
  };

  useEffect(() => {
    let isMounted = true;
    initLessonRoom();
    return () => {
      isMounted = false;
    };
  }, [lessonId, studentId]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dispatch student utterance to AI Runtime
  const handleSendUtterance = async () => {
    if (!studentInput.trim() || !currentSession || isSubmitting) return;
    if (sessionState === 'AI_NOT_CONFIGURED' || sessionState === 'completed') return;

    const userInput = studentInput.trim();
    setStudentInput('');
    setIsSubmitting(true);
    setErrorMessage(null);

    // Optimistic student message preview
    const tempStudentMsg: ConversationMessage = {
      id: `std_temp_${Date.now()}`,
      sender: 'student',
      text: userInput,
      timestampIso: new Date().toISOString(),
      type: 'utterance',
    };
    setMessages((prev) => [...prev, tempStudentMsg]);
    setTurnCount((prev) => prev + 1);

    try {
      const result = await lessonRoomAdapter.sendStudentMessage(
        currentSession.sessionId,
        userInput
      );

      setCurrentSession(result.session);
      setMessages([...result.session.messages]);
      setSessionState(result.session.state);
      setTurnCount(result.session.turnsCount);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Falha ao processar resposta com o motor de IA.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete lesson session through Application Layer
  const handleFinishLesson = async () => {
    if (!currentSession) {
      onBackToDashboard?.();
      return;
    }

    setIsSubmitting(true);
    try {
      const summaryResult = await lessonRoomAdapter.completeSession(
        currentSession.sessionId,
        sessionSeconds
      );
      setSummary(summaryResult);
      setSessionState('completed');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro ao finalizar sessão da lição.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check AI health on server
  const handleCheckAiHealth = async () => {
    setIsRetryingHealth(true);
    setErrorMessage(null);
    try {
      const health = await lessonRoomAdapter.checkAiHealth();
      if (health.configured) {
        await initLessonRoom();
      } else {
        setErrorMessage('Servidor reporta que GEMINI_API_KEY continua ausente.');
      }
    } catch {
      setErrorMessage('Falha ao verificar estado da IA no servidor.');
    } finally {
      setIsRetryingHealth(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <header className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <button
            onClick={onBackToDashboard}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Voltar ao Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar ao Dashboard</span>
            <span className="sm:hidden">Voltar</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-extrabold min-h-[44px]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTimer(sessionSeconds)}</span>
            </div>

            {sessionState !== 'completed' && (
              <button
                onClick={handleFinishLesson}
                disabled={isSubmitting}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-extrabold text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50"
                aria-label="Terminar aula atual"
              >
                Terminar Aula
              </button>
            )}
          </div>
        </header>

        {/* Subtle Real-Time Indicators Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Nível & Tópico:</span>
            <span className="font-extrabold text-indigo-300 truncate max-w-[170px]">
              {currentSession ? `${currentSession.cefrLevel} • ${currentSession.topic}` : 'B1 • Negociação'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Estado da Sessão:</span>
            <span
              className={`font-extrabold uppercase text-[10px] px-2 py-0.5 rounded-md ${
                sessionState === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : sessionState === 'AI_NOT_CONFIGURED'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : sessionState === 'loading'
                  ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                  : sessionState === 'completed'
                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
              }`}
            >
              {sessionState === 'AI_NOT_CONFIGURED'
                ? 'AI Não Configurada'
                : sessionState === 'active'
                ? 'Sessão Ativa'
                : sessionState === 'loading'
                ? 'A Processar...'
                : sessionState === 'completed'
                ? 'Concluída'
                : sessionState}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Turnos Efetuados:</span>
            <span className="font-extrabold text-amber-400">{turnCount} Turnos</span>
          </div>
        </div>

        {/* Virtual Teacher Visualizer Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/80 shadow-2xl text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center font-black text-white text-3xl shadow-xl shadow-indigo-500/40 mx-auto">
              {currentSession?.teacherPersona ? currentSession.teacherPersona.charAt(0) : 'F'}
            </div>
            {sessionState === 'active' && (
              <div className="absolute -inset-2 rounded-full border-2 border-indigo-500/40 animate-ping pointer-events-none" />
            )}
          </div>

          <div>
            <h3 className="font-extrabold text-white text-base">
              {currentSession?.teacherPersona || 'Professor Fluento AI'}
            </h3>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block mt-0.5">
              {sessionState === 'active'
                ? `A escutar em tempo real • Língua Alvo: ${currentSession?.targetLanguage.toUpperCase()}`
                : sessionState === 'AI_NOT_CONFIGURED'
                ? 'Motor de IA Desligado • Modo de Preparação Seguro'
                : sessionState === 'loading'
                ? 'A inicializar ligação ao AI Runtime...'
                : 'Sessão Pedagógica'}
            </span>
          </div>
        </div>

        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              Fechar
            </button>
          </div>
        )}

        {/* State: AI_NOT_CONFIGURED */}
        {sessionState === 'AI_NOT_CONFIGURED' && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-6 shadow-xl text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-amber-300 text-base">
                  Motor de Inteligência Artificial Não Configurado
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O servidor do Fluento não detetou a variável <code>GEMINI_API_KEY</code>.
                  Em rigoroso cumprimento com a arquitetura de integridade (Sprint 16A.4), as respostas simuladas
                  por temporizador foram desativadas e nenhum diálogo artificial está a ser falsificado.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                  Contexto Pedagógico Preparado:
                </span>
                <p className="text-slate-200">
                  <strong>Tópico:</strong> {currentSession?.topic || 'Apresentação Executiva'}
                </p>
                <p className="text-slate-200">
                  <strong>Nível CEFR:</strong> {currentSession?.cefrLevel || 'B1'} •{' '}
                  <strong>Língua:</strong> {currentSession?.targetLanguage.toUpperCase() || 'ES'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                  Garantia de Segurança & Arquitetura:
                </span>
                <p className="text-slate-300">
                  A Lesson Room comunica exclusivamente através da <code>Application Layer</code> e da rota protegida{' '}
                  <code>/api/ai/*</code>. Nenhuma chave é exposta ao browser.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleCheckAiHealth}
                disabled={isRetryingHealth}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 disabled:opacity-50"
              >
                {isRetryingHealth ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>Verificar Estado do Servidor</span>
              </button>

              <button
                onClick={onBackToDashboard}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        )}

        {/* State: Loading Initial Session */}
        {sessionState === 'loading' && messages.length === 0 && (
          <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">A preparar sala de aula com o professor...</h4>
              <p className="text-xs text-slate-400">
                A carregar o perfil do aluno e a compor o contexto pedagógico inicial.
              </p>
            </div>
          </div>
        )}

        {/* Dialogue Stream: Active / Error / Loading */}
        {sessionState !== 'completed' && sessionState !== 'AI_NOT_CONFIGURED' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="space-y-4 max-h-[420px] min-h-[160px] overflow-y-auto pr-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                      m.sender === 'teacher'
                        ? 'bg-indigo-950/80 border border-indigo-800/80 text-indigo-100 rounded-tl-none'
                        : m.sender === 'student'
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1 opacity-75 text-[10px] uppercase font-bold">
                      <span>{m.sender === 'teacher' ? currentSession?.teacherPersona || 'Professor' : 'Tu'}</span>
                      {m.sender === 'teacher' && (
                        <Volume2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{m.text}</p>

                    {m.translation && (
                      <p className="text-[11px] text-slate-400 border-t border-indigo-800/50 pt-1.5 mt-2 italic">
                        💡 {m.translation}
                      </p>
                    )}

                    {m.tip && (
                      <p className="text-[11px] text-amber-300 mt-1 font-semibold">
                        {m.tip}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {isSubmitting && (
                <div className="flex items-center gap-2 text-xs text-indigo-300 italic p-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>O Professor está a formular a intervenção...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Interactive Microphone & Input Controls */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                disabled={isSubmitting}
                className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border font-bold transition flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 ${
                  isRecording
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
                aria-label={isRecording ? 'Parar gravação de voz' : 'Ativar microfone para falar'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-400" />}
                <span className="text-xs hidden sm:inline">{isRecording ? 'A Gravar...' : 'Microfone'}</span>
              </button>

              <input
                type="text"
                value={studentInput}
                disabled={isSubmitting}
                onChange={(e) => setStudentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendUtterance()}
                placeholder={isRecording ? 'A ouvir a tua fala...' : 'Digita a tua resposta na língua alvo...'}
                className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                aria-label="Resposta do aluno durante a sessão"
              />

              <button
                type="button"
                onClick={handleSendUtterance}
                disabled={isSubmitting || !studentInput.trim()}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                aria-label="Enviar resposta na aula"
              >
                Responder
              </button>
            </div>
          </div>
        )}

        {/* State: Completed Post-Lesson Summary */}
        {sessionState === 'completed' && summary && (
          <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-700/60 text-center space-y-6 shadow-2xl animate-fadeIn">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white">Sessão Concluída com Sucesso!</h2>
              <p className="text-xs text-slate-300 mt-1">
                Duração Real: <strong>{formatTimer(summary.durationSeconds)}</strong> • Intervenções do Aluno:{' '}
                <strong>{summary.studentMessagesCount}</strong> • Turnos Totais: <strong>{summary.turnsCount}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Tempo Praticado
                </span>
                <span className="text-base font-black text-indigo-400">{summary.durationMinutes} min</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">{summary.durationSeconds}s medidos</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Palavras do Aluno
                </span>
                <span className="text-base font-black text-emerald-400">{summary.studentWordsCount} palavras</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Contagem direta</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Avaliação Pedagógica
                </span>
                <span className="text-xs font-black text-amber-400 block mt-1">Não disponível</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Sem pontuação simulada</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Registo de Sessão
                </span>
                <span className="text-base font-black text-violet-400">
                  {summary.profileUpdated ? 'Sincronizado' : 'Gravado Localmente'}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Application Layer</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 text-left space-y-2">
              <span className="font-extrabold text-indigo-400 uppercase tracking-wider text-[10px] block">
                Transparência de Avaliação Fluento
              </span>
              <p className="text-slate-300 leading-relaxed">
                Esta sessão contabilizou estritamente o tempo decorrido e as mensagens emitidas.
                Em conformidade com as diretrizes do Sprint 16A.4, não são geradas notas falsas nem percentagens
                artificiais de fluência enquanto a avaliação pedagógica automatizada não estiver ligada.
              </p>
            </div>

            <button
              onClick={onBackToDashboard}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl transition"
            >
              Voltar ao Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
