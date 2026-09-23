import React from 'react';
import { BarChart2, History, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, Heading3, CaptionText, Badge } from '@/src/components/design-system';

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
      <Card className="lg:col-span-1 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-base">
          <BarChart2 className="w-5 h-5 text-indigo-400" />
          <Heading3 className="text-base">Estatísticas de Competência</Heading3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <CaptionText className="text-slate-300 font-medium">Gramática & Sintaxe</CaptionText>
              <CaptionText className="text-indigo-400 font-black">84%</CaptionText>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
              <div className="bg-indigo-500 h-2 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(99,102,241,0.3)]" style={{ width: '84%' }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <CaptionText className="text-slate-300 font-medium">Vocabulário Ativo</CaptionText>
              <CaptionText className="text-amber-400 font-black">78%</CaptionText>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
              <div className="bg-amber-400 h-2 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(251,191,36,0.3)]" style={{ width: '78%' }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <CaptionText className="text-slate-300 font-medium">Precisão Acústica (Pronúncia)</CaptionText>
              <CaptionText className="text-emerald-400 font-black">88%</CaptionText>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
              <div className="bg-emerald-400 h-2 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(52,211,153,0.3)]" style={{ width: '88%' }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <CaptionText className="text-slate-300 font-medium">Compreensão Auditiva</CaptionText>
              <CaptionText className="text-purple-400 font-black">92%</CaptionText>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
              <div className="bg-purple-400 h-2 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(167,139,250,0.3)]" style={{ width: '92%' }} />
            </div>
          </div>
        </div>
      </Card>

      {/* History Log */}
      <Card className="lg:col-span-2 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <History className="w-5 h-5 text-indigo-400" />
            <Heading3 className="text-base">Histórico de Lições e Sessões</Heading3>
          </div>
          <Badge variant="secondary" size="sm" className="font-bold opacity-80">3 Sessões Recentes</Badge>
        </div>

        <div className="space-y-3">
          {history.map((item) => (
            <Card
              key={item.id}
              variant="outlined"
              className="p-3.5 flex items-center justify-between gap-4 border-slate-800/60 bg-slate-950/40 hover:bg-slate-950/60 transition-colors"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Heading3 className="text-sm font-bold text-white truncate">{item.topic}</Heading3>
                  <Badge variant="cefr" size="sm" className="font-black px-2">{item.cefrLevel}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <CaptionText className="text-slate-400 text-[11px]">{item.dateStr}</CaptionText>
                  <span className="text-slate-600 opacity-50 text-[10px]">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <CaptionText className="text-slate-400 text-[11px]">{item.durationMinutes} min</CaptionText>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-emerald-400 font-black text-sm flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {item.accuracyScore}%
                </div>
                <CaptionText className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Precisão</CaptionText>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

