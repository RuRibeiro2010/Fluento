import React from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Users,
  Target,
  Bot,
} from 'lucide-react';

interface FirstMissionViewProps {
  userName?: string;
  targetLanguage?: string;
  onStartLesson: () => void;
}

export function FirstMissionView({
  userName = 'Aluno',
  targetLanguage = 'es',
  onStartLesson,
}: FirstMissionViewProps) {
  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden font-sans text-white space-y-6">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Mission Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Primeira Missão Prática
            </span>
            <h3 className="text-lg font-extrabold text-white">Check-in no Hotel em Madrid</h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
          Nível A2 - B1
        </span>
      </div>

      {/* Mission Briefing */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
          <MapPin className="w-4 h-4 text-indigo-400" />
          <span>Cenário: Receção do Hotel Real em Madrid</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Acabaste de chegar a Madrid após uma longa viagem. O teu objetivo é falar com o rececionista (Prof. Mateo), confirmar a tua reserva para 3 noites e pedir um quarto sossegado com bom Wi-Fi.
        </p>
      </div>

      {/* Objectives List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase text-slate-400">Objetivos Concretos da Aula:</h4>
        <div className="grid grid-cols-1 gap-2 text-xs text-slate-200">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Saudar cordialmente e indicar o teu nome de reserva</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Pedir preferências de quarto ("vista a la calle" / "silencioso")</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Confirmar o horário do pequeno-almoço e chave do Wi-Fi</span>
          </div>
        </div>
      </div>

      {/* Virtual Teacher Info */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
          M
        </div>
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-white flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-indigo-400" /> Prof. Mateo está pronto para ti
          </span>
          <p className="text-slate-300">
            Ele vai acolher-te calorosamente, conduzir a conversa com paciência e encorajar cada resposta.
          </p>
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={onStartLesson}
        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition hover:scale-[1.01]"
      >
        <span>Iniciar Primeira Aula com Prof. Mateo</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
