import React, { useState } from 'react';
import { Bot, Sparkles, MessageSquare, Volume2, CheckCircle, Flame, ArrowUpRight } from 'lucide-react';

export function AppPreviewSection() {
  const [activeTab, setActiveTab] = useState<'coach' | 'dashboard' | 'analytics'>('coach');

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 -mt-8 pb-16 z-20">
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Mock App Window Header */}
        <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-slate-500 ml-2 font-mono hidden sm:inline">app.fluento.ai/dashboard</span>
          </div>

          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveTab('coach')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                activeTab === 'coach'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Coach Session
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Study Plan
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fluency Analytics
            </button>
          </div>
        </div>

        {/* Tab Content PREVIEWS */}
        <div className="p-6 md:p-8 min-h-[380px] bg-slate-900">
          {activeTab === 'coach' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Left Chat Window */}
              <div className="md:col-span-2 space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        Fluento AI Coach <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-normal">Socratic Mode</span>
                      </div>
                      <div className="text-xs text-slate-400">Target: German (DE) • Native: Portuguese (PT)</div>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/60 text-indigo-100 space-y-1">
                    <div className="font-semibold text-indigo-300 flex items-center justify-between">
                      <span>AI Coach</span>
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400 cursor-pointer" />
                    </div>
                    <p className="text-sm font-medium">"Wie war dein Tag heute? Hast du etwas Interessantes gemacht?"</p>
                    <p className="text-[11px] text-slate-400 italic">(Como foi o teu dia hoje? Fizeste algo interessante?)</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800 text-slate-100 space-y-1 ml-auto max-w-md">
                    <div className="font-semibold text-slate-300">You (Student)</div>
                    <p className="text-sm font-medium">"Heute ich bin zum Supermarkt gegangen."</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-emerald-200 space-y-2">
                    <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Instant Coaching Correction
                    </div>
                    <p className="text-xs leading-normal">
                      Great effort! In German, with past participle <strong className="underline">gegangen</strong>, the auxiliary verb comes second and the main verb goes to the end:
                      <br />
                      <span className="text-emerald-300 font-bold">"Heute bin ich zum Supermarkt gegangen."</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Memory Sidebar */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Longitudinal Memory
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">German Word Order</span>
                      <span className="text-amber-400 font-semibold">Practicing (72%)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Past Auxiliaries (sein/haben)</span>
                      <span className="text-emerald-400 font-semibold">Mastered (95%)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-900/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>Daily Goal</span>
                    <span className="flex items-center gap-1 text-amber-400"><Flame className="w-3.5 h-3.5 fill-amber-400" /> 5 Day Streak</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-500 h-2 w-4/5 rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-400">12 / 15 minutes completed today</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Curriculum: German Master Path</h3>
                  <p className="text-xs text-slate-400">Generated by AI Coach based on Portuguese native background</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Level B1 Target
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Module 1 • Mastered</span>
                  <h4 className="font-bold text-white text-sm">Everyday Greetings & Directions</h4>
                  <p className="text-xs text-slate-400">3 of 3 lessons complete</p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/80 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Module 2 • Active Now</span>
                  <h4 className="font-bold text-white text-sm">Past Tense & Conversational Storytelling</h4>
                  <p className="text-xs text-slate-300">1 of 4 lessons complete</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 opacity-60 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Module 3 • Upcoming</span>
                  <h4 className="font-bold text-white text-sm">Professional & Work Environment</h4>
                  <p className="text-xs text-slate-400">0 of 3 lessons complete</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Confidence Score</div>
                <div className="text-3xl font-extrabold text-indigo-400">78 / 100</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> +12% this week</div>
              </div>

              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Active Vocabulary</div>
                <div className="text-3xl font-extrabold text-amber-400">480 Words</div>
                <div className="text-xs text-slate-400">92% Long-term Retention</div>
              </div>

              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Grammar Accuracy</div>
                <div className="text-3xl font-extrabold text-purple-400">86%</div>
                <div className="text-xs text-slate-400">Based on 14 conversation sessions</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
