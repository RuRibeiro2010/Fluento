import React from 'react';
import { LongitudinalMemory } from '@/types/coach';
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface LongitudinalMemoryCardProps {
  memory: LongitudinalMemory;
  className?: string;
}

export function LongitudinalMemoryCard({
  memory,
  className = '',
}: LongitudinalMemoryCardProps) {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
              Longitudinal AI Memory
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Tracking error persistence & confidence trends over time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
            {memory.learningVelocity} pace
          </span>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" /> Daily Streak
          </span>
          <span className="font-extrabold text-lg text-white">
            {memory.streakDays} Days
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" /> Total Practice
          </span>
          <span className="font-extrabold text-lg text-white">
            {memory.totalPracticeMinutes} Mins
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Confidence
          </span>
          <span className="font-extrabold text-lg text-emerald-400">
            {memory.confidenceTrend.slice(-1)[0]?.score || 50}%
          </span>
        </div>
      </div>

      {/* Persistent Weak Words & Grammar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weak Words */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Vocabulary Focus List
            </span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-900">
              {memory.weakWords.length} Items
            </span>
          </div>

          <div className="space-y-1.5">
            {memory.weakWords.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{item.word}</span>
                  <span className="text-[11px] text-slate-400">{item.translation}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900">
                  {item.errorCount} Errors
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Grammar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Grammar Weak Spots
            </span>
            <span className="text-[10px] font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-900">
              {memory.weakGrammar.length} Rules
            </span>
          </div>

          <div className="space-y-1.5">
            {memory.weakGrammar.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-slate-200">{item.concept}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-900">
                  {Math.round(item.errorRate * 100)}% Error
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mastered Topics */}
      {memory.masteredTopics && memory.masteredTopics.length > 0 && (
        <div className="space-y-2 border-t border-slate-800 pt-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mastered Topics & Vocab Domains
          </span>
          <div className="flex flex-wrap gap-1.5">
            {memory.masteredTopics.map((topic, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-slate-950 border border-emerald-900/50 text-emerald-300 text-xs font-semibold flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
