import React, { useState } from 'react';
import { AIMemoryEngine, defaultMemoryEngine } from '@/lib/memory/memory-engine';
import {
  Brain,
  Database,
  Flame,
  Sparkles,
  BookOpen,
  MessageSquare,
  BarChart2,
  Dna,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

interface MemoryOverviewCardProps {
  engine?: AIMemoryEngine;
  className?: string;
}

export function MemoryOverviewCard({
  engine = defaultMemoryEngine,
  className = '',
}: MemoryOverviewCardProps) {
  const [activeTab, setActiveTab] = useState<
    'summary' | 'vocabulary' | 'grammar' | 'conversation' | 'dna'
  >('summary');

  const summary = engine.generateContextSummary();
  const fullMemory = engine.getFullMemory();

  return (
    <div className={`p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 text-white space-y-6 shadow-xl ${className}`}>
      {/* Top Banner: Engine Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-amber-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg">AI Memory Engine</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold flex items-center gap-1">
                <Database className="w-3 h-3" /> Supabase Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Long-Term Context Engine for AI Coach & Virtual Teacher
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 flex items-center gap-1.5">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>{summary.streakDays} Day Streak</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{summary.confidenceScore}% Confidence</span>
          </div>
        </div>
      </div>

      {/* Module Selector Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'summary', label: 'Context Briefs', icon: Brain },
          { id: 'vocabulary', label: 'Vocab Memory', icon: BookOpen },
          { id: 'grammar', label: 'Grammar Memory', icon: ShieldAlert },
          { id: 'conversation', label: 'Conversation Log', icon: MessageSquare },
          { id: 'dna', label: 'Learning DNA', icon: Dna },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'summary' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-extrabold uppercase tracking-wider text-indigo-400 block">
              🤖 Generated Brief for AI Coach:
            </span>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-900 p-3 rounded-lg border border-slate-800">
              "{summary.coachBrief}"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-extrabold uppercase tracking-wider text-amber-400 block">
              👩🏽‍💼 Generated Brief for Virtual Teacher:
            </span>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-900 p-3 rounded-lg border border-slate-800">
              "{summary.teacherBrief}"
            </p>
          </div>
        </div>
      )}

      {activeTab === 'vocabulary' && (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300">
              Total Learned Words: {fullMemory.vocabulary.items.length}
            </span>
            <span className="text-amber-400 font-bold">
              Weak Spots: {fullMemory.vocabulary.totalWeakWords}
            </span>
          </div>
          <div className="space-y-2">
            {fullMemory.vocabulary.items.map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white text-sm">{v.word}</span>
                  <span className="text-slate-400 ml-2">({v.translation})</span>
                  <p className="text-[11px] text-slate-400 italic mt-0.5">{v.contextSentence}</p>
                </div>
                <div className="text-right">
                  <span className={`font-bold font-mono ${v.isWeakSpot ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {v.masteryScore}% Mastery
                  </span>
                  <span className="text-[10px] text-slate-500 block">Seen {v.timesSeen}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'grammar' && (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300">
              Grammar Score: {fullMemory.grammar.overallGrammarScore}%
            </span>
          </div>
          <div className="space-y-2">
            {fullMemory.grammar.rules.map((g) => (
              <div
                key={g.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white text-sm">{g.conceptName}</span>
                  <span className="text-xs text-indigo-400 ml-2 font-mono">[{g.category}]</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{g.notes}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold font-mono text-rose-400">
                    {(g.errorRate * 100).toFixed(0)}% Error Rate
                  </span>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">
                    {g.masteryStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'conversation' && (
        <div className="space-y-3 text-xs">
          <p className="text-slate-400">
            Total Conversation Time: {fullMemory.conversation.totalConversationTimeMinutes} Mins
          </p>
          <div className="space-y-2">
            {fullMemory.conversation.history.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>{c.characterName}</span>
                  <span className="text-amber-400">Fluency: {c.fluencyScore}%</span>
                </div>
                <p className="text-slate-300 italic">"{c.keyFeedbackSummary}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'dna' && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Learning Style</span>
            <span className="font-extrabold text-indigo-300 uppercase">
              {fullMemory.learningDna.primaryLearningStyle}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Correction Mode</span>
            <span className="font-extrabold text-amber-400 uppercase">
              {fullMemory.learningDna.preferredCorrectionMode}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 col-span-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Cognitive Strengths</span>
            <ul className="list-disc list-inside text-slate-300 space-y-0.5">
              {fullMemory.learningDna.cognitiveStrengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
