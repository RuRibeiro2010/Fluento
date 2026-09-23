import React from 'react';
import { MonthlyEvolutionDataDTO } from '@/src/application/dto/coach.dtos';
import {
  Calendar,
  Award,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Clock,
  Flame,
  Brain,
  TrendingUp,
  Target,
  Briefcase,
  Flag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface MonthlyTimelineViewProps {
  evolutionData: MonthlyEvolutionDataDTO;
  onBackToDashboard?: () => void;
}

export function MonthlyTimelineView({
  evolutionData,
  onBackToDashboard,
}: MonthlyTimelineViewProps) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Evolução de Longo Prazo</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Timeline de Progresso Mensal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Histórico contínuo do teu acompanhamento com o AI Coach desde o primeiro dia.
          </p>
        </div>

        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2"
          >
            <span>Voltar ao Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Overview Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* First Lesson Date & Initial Level */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 w-fit">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Primeira Aula
          </span>
          <div className="text-sm sm:text-base font-extrabold text-white">
            {evolutionData.firstLessonDate}
          </div>
          <span className="text-xs text-indigo-300 font-semibold block">
            Nível Inicial: {evolutionData.initialLevel}
          </span>
        </div>

        {/* Current Level */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 w-fit">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Nível Atual
          </span>
          <div className="text-sm sm:text-base font-extrabold text-emerald-400">
            {evolutionData.currentLevel}
          </div>
          <span className="text-xs text-slate-400 block">
            Avanço de +2 Níveis CEFR
          </span>
        </div>

        {/* Words & Grammar */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="p-2 rounded-xl bg-amber-950 text-amber-400 w-fit">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Palavras & Gramática
          </span>
          <div className="text-sm sm:text-base font-extrabold text-white">
            {evolutionData.wordsLearnedCount} Palavras
          </div>
          <span className="text-xs text-amber-300 font-semibold block">
            {evolutionData.grammarRulesMastered} Regras Dominadas
          </span>
        </div>

        {/* Time Studied & Streak */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="p-2 rounded-xl bg-rose-950 text-rose-400 w-fit">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Tempo & Ofensiva
          </span>
          <div className="text-sm sm:text-base font-extrabold text-white">
            {Math.round(evolutionData.totalTimeStudiedMinutes / 60)} Horas
          </div>
          <span className="text-xs text-rose-300 font-semibold block">
            🔥 {evolutionData.consecutiveStreakDays} Dias Consecutivos
          </span>
        </div>
      </div>

      {/* Fluency & Pronunciation Metrics */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-800/80 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          Indicadores de Fluência & Pronúncia
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Pontuação de Fluência Verbal</span>
              <span className="text-indigo-300 font-bold">{evolutionData.fluencyScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${evolutionData.fluencyScore}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Precisão Fonética & Pronúncia</span>
              <span className="text-emerald-400 font-bold">{evolutionData.pronunciationScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${evolutionData.pronunciationScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Biggest Achievements Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          Maiores Conquistas Alcançadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {evolutionData.biggestAchievements.map((achieve, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-200 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{achieve}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones Vertical Timeline */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          Linha do Tempo de Marcos Históricos (Milestones)
        </h3>

        <div className="relative border-l-2 border-indigo-900/60 ml-4 space-y-8 pl-6">
          {evolutionData.milestonesTimeline.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Dot Icon */}
              <div className="absolute -left-[35px] top-0 p-1.5 rounded-full bg-slate-900 border-2 border-indigo-500 text-indigo-400 shadow-md">
                {item.category === 'first_lesson' ? (
                  <Flag className="w-3.5 h-3.5" />
                ) : item.category === 'level_up' ? (
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>

              {/* Content Card */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 group-hover:border-indigo-800/60 transition">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-extrabold text-white text-sm sm:text-base">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
