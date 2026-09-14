import React, { useState, useEffect, useRef } from 'react';
import {
  ConversationMode,
  ConversationMessage,
  ConversationSession,
  CorrectionMode,
  SessionReport,
  TeacherPersona,
} from '@/types/teacher';
import { TEACHER_PERSONAS, getPersonaById } from '@/lib/teacher/personas';
import { processUserMessage, generateSessionReport } from '@/lib/teacher/conversation-engine';
import { defaultVoiceService } from '@/lib/teacher/voice-service';
import { TeacherAvatar } from './TeacherAvatar';
import { CorrectionModeSelector } from './CorrectionModeSelector';
import { PersonaCard } from './PersonaCard';
import { VoiceControls } from './VoiceControls';
import { ConversationBubble } from './ConversationBubble';
import { SessionReportModal } from './SessionReportModal';
import {
  Send,
  ArrowLeft,
  Bot,
  Sparkles,
  MessageSquare,
  Flag,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  CheckCircle2,
  AlertCircle,
  Video,
  VideoOff,
  HelpCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface VirtualTeacherRoomProps {
  targetLanguage?: string;
  nativeLanguage?: string;
  userId?: string;
  onExitRoom?: () => void;
  onSessionComplete?: (report: SessionReport) => void;
}

export function VirtualTeacherRoom({
  targetLanguage = 'es',
  nativeLanguage = 'pt',
  userId = 'usr_guest',
  onExitRoom,
  onSessionComplete,
}: VirtualTeacherRoomProps) {
  // Mode selection state
  const [activeMode, setActiveMode] = useState<ConversationMode>('scenario');
  const [selectedPersona, setSelectedPersona] = useState<TeacherPersona>(TEACHER_PERSONAS[1]);

  // Session state
  const [currentSession, setCurrentSession] = useState<ConversationSession | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [correctionMode, setCorrectionMode] = useState<CorrectionMode>('balanced');

  // Voice & Video Call State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoPlayTts, setAutoPlayTts] = useState<boolean>(true);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [showTemporaryTranslation, setShowTemporaryTranslation] = useState<boolean>(false);
  const [latestCorrection, setLatestCorrection] = useState<{
    original: string;
    corrected: string;
    explanation: string;
  } | null>(null);

  // End Session & Report
  const [sessionReport, setSessionReport] = useState<SessionReport | null>(null);

  // Chat auto-scroll ref
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // Filter personas based on active mode
  const filteredPersonas = TEACHER_PERSONAS.filter((p) =>
    activeMode === 'scenario' ? Boolean(p.scenarioTitle) : !p.scenarioTitle
  );

  // AI Status string computation
  const getAiStateLabel = () => {
    if (isSpeaking) return { label: 'A Falar...', color: 'bg-emerald-500', text: 'text-emerald-400' };
    if (isListening) return { label: 'A Ouvir...', color: 'bg-indigo-500 animate-ping', text: 'text-indigo-400' };
    return { label: 'Pronto', color: 'bg-slate-400', text: 'text-slate-300' };
  };

  // Start new session
  const handleStartSession = (persona: TeacherPersona) => {
    setSelectedPersona(persona);

    const initialMessage: ConversationMessage = {
      id: `msg-init-${Date.now()}`,
      sender: 'teacher',
      text: persona.suggestedOpening,
      timestamp: new Date().toISOString(),
    };

    const newSession: ConversationSession = {
      id: `session-${Date.now()}`,
      userId,
      targetLanguage,
      mode: activeMode,
      character: persona,
      correctionMode,
      messages: [initialMessage],
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      isCompleted: false,
    };

    setCurrentSession(newSession);

    // Auto-read initial message if TTS enabled
    if (autoPlayTts) {
      defaultVoiceService.speakText(
        persona.suggestedOpening,
        targetLanguage,
        1.0,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentSession) return;

    const userMessageText = inputText.trim();
    setInputText('');

    const userMsg: ConversationMessage = {
      id: `msg-usr-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...currentSession.messages, userMsg];

    const tempSession = {
      ...currentSession,
      messages: updatedMessages,
      correctionMode,
    };

    // Process AI response
    const { teacherMessage, corrections } = processUserMessage({
      userText: userMessageText,
      session: tempSession,
      targetLanguage,
    });

    if (corrections && corrections.length > 0) {
      const primaryCorrection = corrections[0];
      setLatestCorrection({
        original: userMessageText,
        corrected: primaryCorrection.correctedText,
        explanation: primaryCorrection.explanation,
      });
    }

    const finalSession: ConversationSession = {
      ...tempSession,
      messages: [...updatedMessages, teacherMessage],
      durationSeconds: currentSession.durationSeconds + 20,
    };

    setCurrentSession(finalSession);

    // Speak response
    if (autoPlayTts) {
      defaultVoiceService.speakText(
        teacherMessage.text,
        targetLanguage,
        1.0,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  // Toggle Voice Input
  const handleToggleListening = () => {
    if (isListening) {
      defaultVoiceService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      defaultVoiceService.startListening(
        targetLanguage === 'es' ? 'es-ES' : 'en-US',
        (text, isFinal) => {
          setInputText(text);
          if (isFinal) {
            setIsListening(false);
          }
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  // End Session & Calculate Report
  const handleEndSession = () => {
    if (!currentSession) return;
    const report = generateSessionReport(currentSession);
    setSessionReport(report);
    if (onSessionComplete) {
      onSessionComplete(report);
    }
  };

  const aiState = getAiStateLabel();
  const lastTeacherMsg = currentSession?.messages.filter((m) => m.sender === 'teacher').slice(-1)[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          {onExitRoom && (
            <button
              onClick={onExitRoom}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Voltar ao Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Sala do Professor Virtual
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">
                Sessão em direto de conversação imersiva em {targetLanguage.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* End Session button if active */}
        {currentSession && (
          <button
            onClick={handleEndSession}
            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5" /> Terminar Videochamada
          </button>
        )}
      </div>

      {/* Screen 1: Persona Selection */}
      {!currentSession ? (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveMode('scenario')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                  activeMode === 'scenario'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Modo Cenário & Missões</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('free_conversation')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                  activeMode === 'free_conversation'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Conversa Livre</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersonas.map((persona) => (
              <PersonaCard key={persona.id} persona={persona} onSelect={handleStartSession} />
            ))}
          </div>
        </div>
      ) : (
        /* Screen 2: Modern Video Call Room */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Call Screen Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl h-[420px] flex flex-col justify-between p-6">
              {/* Top Video Status Overlay */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs font-semibold text-white">
                  <span className={`w-2.5 h-2.5 rounded-full ${aiState.color}`} />
                  <span>Estado IA: <strong className={aiState.text}>{aiState.label}</strong></span>
                </div>

                {/* Discrete Feedback Chips */}
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[11px] font-bold">
                    Pronúncia: 94% ✓
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-[11px] font-bold">
                    Ritmo: Flow Ideal
                  </span>
                </div>
              </div>

              {/* Central Video Call Avatar Display */}
              <div className="my-auto flex flex-col items-center justify-center space-y-4 relative z-10">
                <div className="relative">
                  <TeacherAvatar
                    persona={currentSession.character}
                    isSpeaking={isSpeaking}
                    isListening={isListening}
                    size="lg"
                  />
                  {isSpeaking && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg animate-pulse">
                      Voz Ativa
                    </div>
                  )}
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-extrabold text-xl text-white tracking-tight">
                    {currentSession.character.name}
                  </h3>
                  <p className="text-xs text-indigo-400 font-semibold">
                    {currentSession.character.role}
                  </p>
                </div>
              </div>

              {/* Bottom Captions / Live Subtitles */}
              {showSubtitles && lastTeacherMsg && (
                <div className="relative z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 space-y-1 text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                    Legendas em Direto ({targetLanguage.toUpperCase()})
                  </span>
                  <p className="text-sm font-medium text-white leading-snug">
                    "{lastTeacherMsg.text}"
                  </p>

                  {showTemporaryTranslation && (
                    <p className="text-xs text-amber-300 italic pt-1 border-t border-slate-800/60">
                      Tradução temporária: "Como posso ajudá-lo na reunião de hoje?"
                    </p>
                  )}
                </div>
              )}

              {/* Video Call Controls Bar */}
              <div className="flex items-center justify-center gap-3 pt-2 z-10">
                <button
                  onClick={handleToggleListening}
                  className={`p-3 rounded-full transition ${
                    isListening
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={isListening ? 'Desactivar Microfone' : 'Ativar Microfone'}
                >
                  {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`p-3 rounded-full border transition ${
                    showSubtitles
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Alternar Legendas em Direto"
                >
                  {showSubtitles ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setShowTemporaryTranslation(!showTemporaryTranslation)}
                  className={`px-3.5 py-2 rounded-full border text-xs font-bold transition flex items-center gap-1.5 ${
                    showTemporaryTranslation
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  <span>{showTemporaryTranslation ? 'Ocultar Tradução' : 'Explicar Melhor'}</span>
                </button>
              </div>
            </div>

            {/* Input Form below Video Call */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Escreva ou fale a sua resposta em ${targetLanguage.toUpperCase()}...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500 font-medium"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
              >
                <span>Enviar</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Sidebar: Real-time Corrections & Conversation Stream */}
          <div className="space-y-4">
            {/* Real-time Corrections Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Correções em Tempo Real
                </span>
                <CorrectionModeSelector currentMode={correctionMode} onChange={setCorrectionMode} />
              </div>

              {latestCorrection ? (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200">
                    <span className="font-bold block text-[10px] uppercase text-rose-400">A sua frase:</span>
                    <p>"{latestCorrection.original}"</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-emerald-200 space-y-1">
                    <span className="font-bold block text-[10px] uppercase text-emerald-400">Correção Recomendada:</span>
                    <p className="font-bold text-emerald-300">"{latestCorrection.corrected}"</p>
                    <p className="text-[11px] text-slate-300 pt-1 border-t border-emerald-900/40">
                      {latestCorrection.explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  O seu AI Coach analisa continuamente a gramática e sintaxe à medida que fala. As correções aparecerão aqui.
                </p>
              )}
            </div>

            {/* Conversation Log Bubble Stream */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 h-[280px] overflow-y-auto space-y-3 custom-scrollbar">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-800">
                Fluxo da Conversa
              </span>

              {currentSession.messages.map((msg) => (
                <ConversationBubble
                  key={msg.id}
                  message={msg}
                  teacherName={currentSession.character.name}
                  onPlayAudio={(txt) => defaultVoiceService.speakText(txt, targetLanguage)}
                />
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Session Report Modal */}
      {sessionReport && (
        <SessionReportModal
          report={sessionReport}
          onClose={() => setSessionReport(null)}
          onSyncWithCoach={() => {
            setSessionReport(null);
            setCurrentSession(null);
          }}
        />
      )}
    </div>
  );
}
