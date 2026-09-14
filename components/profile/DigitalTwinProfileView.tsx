import React, { useState, useEffect } from 'react';
import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import { User, Sparkles, Target, Clock, ShieldCheck, Heart, Award, RefreshCw, BookOpen, Brain, Globe } from 'lucide-react';

interface DigitalTwinProfileViewProps {
  studentId?: string;
}

export const DigitalTwinProfileView: React.FC<DigitalTwinProfileViewProps> = ({
  studentId = 'usr_fluento_primary'
}) => {
  const [twin, setTwin] = useState<any>(null);

  useEffect(() => {
    const data = studentDigitalTwin.getOrCreateTwin(studentId);
    setTwin(data);
  }, [studentId]);

  if (!twin) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mx-auto mb-2" />
        <span>A carregar perfil Digital Twin...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-100 p-4 md:p-8">
      {/* Title */}
      <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Perfil de Aprendizagem Vivo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Digital Twin</h1>
          <p className="text-xs text-slate-300 mt-1">
            Representação em tempo real do teu perfil cognitivo, emocional, hábitos de linguagem e metas.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-bold">
          ID: {twin.identity.studentId}
        </span>
      </div>

      {/* Hero Twin Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/80 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-xl shrink-0">
            {twin.identity.name ? twin.identity.name[0] : 'A'}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">{twin.identity.name || 'Aluno Executivo'}</h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-semibold">
                💼 {twin.identity.profession || 'Profissional Executivo'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-semibold">
                🌐 Nativo: {twin.identity.nativeLanguage.toUpperCase()} → Alvo: {twin.identity.targetLanguage.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-900 border border-indigo-700 text-indigo-300 font-bold">
                CEFR Atual: {twin.language.currentCefr} (Meta: {twin.language.targetCefr})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Objetivos & Motivações */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" /> Objetivo & Motivação Principal
          </h3>
          <p className="text-xs text-slate-200 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed font-medium">
            "{twin.goal.primaryMotivation || 'Liderar reuniões internacionais e negociações com total fluência'}"
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Carreira / Domínio:</span>
              <span className="font-bold text-white">{twin.goal.careerGoal || 'Negócios Executivos'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Sessões Concluídas:</span>
              <span className="font-bold text-emerald-400">{twin.behaviour.completedSessionsCount} aulas</span>
            </div>
          </div>
        </div>

        {/* Preferências de Aprendizagem */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Preferências & Cadência
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Duração Preferida:</span>
              <span className="font-bold text-white">{twin.goal.preferredSessionDurationMinutes} min / sessão</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Sotaque Preferido:</span>
              <span className="font-bold text-indigo-300">{twin.language.accentPreference || 'Espanha (Castelhano)'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Personalidade do AI Coach:</span>
              <span className="font-bold text-emerald-400">Encorajador e Diplomático</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Cadência dos Turnos:</span>
              <span className="font-bold text-white">~{twin.behaviour.turnCadenceSeconds || 4}s por resposta</span>
            </div>
          </div>
        </div>

        {/* Estado Emocional & Traumas Registados */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-rose-400" /> Estado Emocional & Memória
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Ansiedade de Fala:</span>
              <span className="font-bold text-amber-400">{twin.emotional.speakingAnxiety || 25}% (Reduzida)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Motivação Atual:</span>
              <span className="font-bold text-emerald-400">{twin.emotional.motivationLevel || 85}% (Elevada)</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Pontos de Fricção em Observação:</span>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
              {twin.memory?.permanentTraumaOrBlocks?.join(', ') || 'Nenhum bloqueio crítico detetado.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
