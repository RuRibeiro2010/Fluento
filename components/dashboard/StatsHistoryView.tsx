import React from 'react';
import { BarChart2, History, CheckCircle2, Clock, Award, Sparkles, TrendingUp } from 'lucide-react';

export interface LessonHistoryItem {
  id: string;
  topic: string;
  dateStr: string;
  durationMinutes: number;
  accuracyScore: number;
  cefrLevel: string;
}

interface StatsHistoryViewProps {
  history?: LessonHistoryItem[];
}

export function StatsHistoryView({
  history = [
    { id: 'h-1', topic: 'Conversação de Trabalho e Apresentações', dateStr: 'Ontem às 18:30', durationMinutes: 18, accuracyScore: 92, cefrLevel: 'B1' },
    { id: 'h-2', topic: 'Passado Composto e Verbos Irregulares', dateStr: '21 Jul às 14:15', durationMinutes: 15, accuracyScore: 85, cefrLevel: 'A2' },
    { id: 'h-3', topic: 'Simulação de Reunião com Professor Virtual', dateStr: '20 Jul às 09:00', durationMinutes: 22, accuracyScore: 94, cefrLevel: 'B1' },
  ],
}: StatsHistoryViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Skill Matrix Detailed Stats */}
      <div className="lg:col-span-1 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-base">
          <BarChart2 className="w-5 h-5 text-indigo-400" />
          <span>Estatísticas de Competência</span>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Gramática & Sintaxe</span>
              <span className="text-indigo-400 font-bold">84%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-500 h-2 rounded-full w-[84%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Vocabulário Ativo</span>
              <span className="text-amber-400 font-bold">78%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-400 h-2 rounded-full w-[78%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Precisão Acústica (Pronúncia)</span>
              <span className="text-emerald-400 font-bold">88%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-400 h-2 rounded-full w-[88%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Compreensão Auditiva</span>
              <span className="text-purple-400 font-bold">92%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-purple-400 h-2 rounded-full w-[92%]" />
            </div>
          </div>
        </div>
      </div>

      {/* History Log */}
      <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Histórico de Leções e Sessões</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">3 Sessões Recentes</span>
        </div>

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.topic}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                    {item.cefrLevel}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>{item.dateStr}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" /> {item.durationMinutes} min
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {item.accuracyScore}%
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Precisão</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
