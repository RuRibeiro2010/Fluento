import React from 'react';
import { Flame, Award, Mic, BookOpen, TrendingUp, Sparkles } from 'lucide-react';

interface MetricsOverviewGridProps {
  streakDays?: number;
  confidenceScore?: number;
  fluencyLevel?: string;
  pronunciationMastery?: number;
  activeVocabularyCount?: number;
}

export function MetricsOverviewGrid({
  streakDays = 5,
  confidenceScore = 74,
  fluencyLevel = 'B1 Intermediate',
  pronunciationMastery = 88,
  activeVocabularyCount = 340,
}: MetricsOverviewGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* 1. Streak */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Ofensiva (Streak)</span>
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
        </div>
        <div className="text-2xl font-black text-white">{streakDays} Dias</div>
        <div className="text-[11px] text-emerald-400 font-medium">Meta diária ativa</div>
      </div>

      {/* 2. Confiança */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Confiança</span>
          <Award className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-black text-indigo-300">{confidenceScore}%</div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-500 h-1.5 rounded-full"
            style={{ width: `${Math.min(100, Math.max(5, confidenceScore))}%` }}
          />
        </div>
      </div>

      {/* 3. Fluência */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Fluência</span>
          <TrendingUp className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-xl font-bold text-white truncate">{fluencyLevel}</div>
        <div className="text-[11px] text-purple-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> CEFR Adaptativo
        </div>
      </div>

      {/* 4. Pronúncia */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Pronúncia</span>
          <Mic className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-black text-emerald-300">{pronunciationMastery}%</div>
        <div className="text-[11px] text-slate-400">Acoustic Precision</div>
      </div>

      {/* 5. Vocabulário */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Vocabulário</span>
          <BookOpen className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-black text-amber-200">{activeVocabularyCount}</div>
        <div className="text-[11px] text-slate-400">Palavras ativas</div>
      </div>
    </div>
  );
}
