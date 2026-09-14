import React, { useState } from 'react';
import {
  Volume2,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  ArrowRight,
  Award,
  Heart,
  MessageSquare,
  Mic,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

interface FirstLessonViewProps {
  userName?: string;
  targetLanguage?: string;
  uiLanguage?: string;
  onLessonComplete: () => void;
}

interface LessonTurn {
  id: string;
  speaker: 'teacher' | 'user';
  name: string;
  text: string;
  translation: string;
  correctionNote?: string;
  praiseNote?: string;
}

export function FirstLessonView({
  userName = 'Aluno',
  targetLanguage = 'es',
  uiLanguage = 'pt',
  onLessonComplete,
}: FirstLessonViewProps) {
  // Conversation history in first lesson
  const [turns, setTurns] = useState<LessonTurn[]>([
    {
      id: 'turn-1',
      speaker: 'teacher',
      name: 'Prof. Mateo (Virtual Teacher)',
      text: `¡Hola ${userName}! Qué alegría tenerte en tu primera clase. Yo soy Mateo, tu profesor virtual. Hoy vamos a hacer el check-in en tu hotel de Madrid. ¿Estás listo?`,
      translation: `Olá ${userName}! Que alegria ter-te na tua primeira aula. Eu sou o Mateo, o teu professor virtual. Hoje vamos fazer o check-in no teu hotel em Madrid. Estás pronto?`,
    },
  ]);

  const [userInput, setUserInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [stepCount, setStepCount] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  // Suggested quick replies for frictionless interaction
  const quickReplies = [
    '¡Sí, estoy listo! Hola Mateo.',
    'Buenas tardes. Tengo una reserva a nombre de ' + userName + '.',
    '¿Podría tener una habitación silenciosa, por favor?',
  ];

  const handleSendResponse = (textToSend?: string) => {
    const finalMsg = textToSend || userInput;
    if (!finalMsg.trim()) return;

    // Add user turn
    const userTurn: LessonTurn = {
      id: `usr-${Date.now()}`,
      speaker: 'user',
      name: `${userName} (Tu)`,
      text: finalMsg,
      translation: 'Minha resposta em espanhol.',
    };

    setTurns((prev) => [...prev, userTurn]);
    setUserInput('');
    setIsAiProcessing(true);

    // AI Professor response synthesis
    setTimeout(() => {
      setIsAiProcessing(false);
      const nextStep = stepCount + 1;
      setStepCount(nextStep);

      let teacherReply: LessonTurn;

      if (nextStep === 2) {
        teacherReply = {
          id: `tch-${Date.now()}`,
          speaker: 'teacher',
          name: 'Prof. Mateo (Virtual Teacher)',
          text: `¡Excelente pronunciación! He encontrado tu reserva para 3 noches. ¿Prefieres una habitación en la planta alta con vistas a la ciudad o cerca del ascensor?`,
          translation: `Excelente pronúncia! Encontrei a tua reserva para 3 noites. Preferes um quarto no andar alto com vista para a cidade ou perto do elevador?`,
          praiseNote: 'Ótima estruturação da frase inicial! Confiança +12%',
        };
      } else if (nextStep === 3) {
        teacherReply = {
          id: `tch-${Date.now()}`,
          speaker: 'teacher',
          name: 'Prof. Mateo (Virtual Teacher)',
          text: `¡Perfecto! Habitación 402 en la planta alta. Aquí tienes tu tarjeta. El desayuno se sirve en la terraza de 7:00 a 10:30. ¡Disfruta tu estancia en Madrid!`,
          translation: `Perfeito! Quarto 402 no andar alto. Aqui tens o teu cartão. O pequeno-almoço é servido no terraço das 7:00 às 10:30. Desfruta da tua estadia em Madrid!`,
          correctionNote: 'Nota pedagógica: A tua resposta foi clara e compreendida à primeira!',
        };
      } else {
        teacherReply = {
          id: `tch-${Date.now()}`,
          speaker: 'teacher',
          name: 'Prof. Mateo (Virtual Teacher)',
          text: `¡Felicitaciones ${userName}! Has completado tu primera misión real con éxito total. Demostraste gran fluidez y seguridad. ¡Nos vemos en la próxima lección!`,
          translation: `Parabéns ${userName}! Concluíste a tua primeira missão real com sucesso total. Demonstraste grande fluidez e segurança. Vemo-nos na próxima lição!`,
          praiseNote: 'Primeira Missão Concluída! Nível de Confiança elevado!',
        };
        setIsCompleted(true);
      }

      setTurns((prev) => [...prev, teacherReply]);
    }, 900);
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden font-sans text-white space-y-6">
      {/* Background Lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-base shadow-md">
            M
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              Prof. Mateo
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                Live Voice
              </span>
            </h3>
            <p className="text-xs text-slate-400">Primeira Aula • Check-in no Hotel</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Sparkles className="w-4 h-4 fill-amber-400" />
          <span>Primeira Missão</span>
        </div>
      </div>

      {/* Dialogue Thread */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
        {turns.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-2xl border space-y-2 transition-all ${
              t.speaker === 'teacher'
                ? 'bg-slate-950/90 border-indigo-900/40 text-slate-100 ml-0 mr-4'
                : 'bg-indigo-950/50 border-indigo-800/60 text-indigo-100 ml-4 mr-0'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className={t.speaker === 'teacher' ? 'text-indigo-400' : 'text-amber-400'}>
                {t.name}
              </span>
              {t.speaker === 'teacher' && (
                <button
                  type="button"
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm font-medium leading-relaxed">{t.text}</p>
            <p className="text-[11px] text-slate-400 italic">Tradução: "{t.translation}"</p>

            {t.praiseNote && (
              <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-900/60 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.praiseNote}</span>
              </div>
            )}

            {t.correctionNote && (
              <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-[11px] text-indigo-200 font-medium">
                {t.correctionNote}
              </div>
            )}
          </div>
        ))}

        {isAiProcessing && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Prof. Mateo está a ouvir e a preparar a resposta...</span>
          </div>
        )}
      </div>

      {/* If Completed */}
      {isCompleted ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/50 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="inline-flex p-3.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white">
              Parabéns, {userName}! Primeira Aula Concluída!
            </h3>
            <p className="text-xs text-slate-300">
              Desbloqueaste a tua primeira conquista e o teu Dashboard personalizado já está pronto.
            </p>
          </div>

          <button
            type="button"
            onClick={onLessonComplete}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition hover:scale-[1.01]"
          >
            <span>Entrar no Dashboard do Fluento</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Response Input Section */
        <div className="space-y-3 pt-2">
          {/* Quick reply suggestions */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sugestões rápidas:</span>
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendResponse(qr)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-indigo-950 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition"
              >
                {qr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendResponse()}
              placeholder="Responde ao Prof. Mateo em espanhol..."
              className="flex-1 px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="button"
              onClick={() => handleSendResponse()}
              disabled={!userInput.trim() || isAiProcessing}
              className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
