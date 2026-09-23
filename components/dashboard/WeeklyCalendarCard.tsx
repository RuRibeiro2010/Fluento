import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';
import { Card, Heading3, CaptionText } from '@/src/components/design-system';

export interface DaySchedule {
  dayName: string;
  dateStr: string;
  isToday: boolean;
  isCompleted: boolean;
  minutesSpent: number;
  topic: string;
}

interface WeeklyCalendarCardProps {
  days?: DaySchedule[];
  weeklyGoalMinutes?: number;
  completedMinutes?: number;
}

export function WeeklyCalendarCard({
  days = [
    { dayName: 'Seg', dateStr: '19 Jul', isToday: false, isCompleted: true, minutesSpent: 20, topic: 'Conversação Trabalho' },
    { dayName: 'Ter', dateStr: '20 Jul', isToday: false, isCompleted: true, minutesSpent: 15, topic: 'Gramática Passado' },
    { dayName: 'Qua', dateStr: '21 Jul', isToday: false, isCompleted: true, minutesSpent: 25, topic: 'Vocabulário Negócios' },
    { dayName: 'Qui', dateStr: '22 Jul', isToday: false, isCompleted: true, minutesSpent: 15, topic: 'Missão Aeroporto' },
    { dayName: 'Sex', dateStr: '23 Jul', isToday: true, isCompleted: false, minutesSpent: 0, topic: 'Sessão Professor Virtual' },
    { dayName: 'Sáb', dateStr: '24 Jul', isToday: false, isCompleted: false, minutesSpent: 0, topic: 'Repaso Inteligente' },
    { dayName: 'Dom', dateStr: '25 Jul', isToday: false, isCompleted: false, minutesSpent: 0, topic: 'Consolidação AI Coach' },
  ],
  weeklyGoalMinutes = 105,
  completedMinutes = 75,
}: WeeklyCalendarCardProps) {
  const percentComplete = Math.min(100, Math.round((completedMinutes / weeklyGoalMinutes) * 100));

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950/50 text-indigo-400 border border-indigo-900/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <Heading3 className="text-base font-bold">Plano Semanal & Calendário</Heading3>
            <CaptionText className="text-slate-400">Distribuição recomendada para retenção máxima</CaptionText>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <CaptionText className="text-slate-400 uppercase tracking-widest font-bold block text-[10px]">
              Progresso Semanal
            </CaptionText>
            <span className="text-indigo-300 font-black text-xs">
              {completedMinutes} / {weeklyGoalMinutes} min ({percentComplete}%)
            </span>
          </div>
          <div className="w-24 bg-slate-800 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div 
              className="bg-indigo-500 h-2.5 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.4)]" 
              style={{ width: `${percentComplete}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Grid of 7 days */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((day, idx) => (
          <Card
            key={idx}
            variant={day.isToday ? 'accent' : day.isCompleted ? 'default' : 'outlined'}
            className={`p-3.5 space-y-2 flex flex-col justify-between transition-all duration-300 ${
              !day.isToday && !day.isCompleted ? 'opacity-40 grayscale-[0.5]' : ''
            } ${day.isToday ? 'ring-1 ring-indigo-500/50 scale-[1.02]' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black uppercase tracking-tighter ${day.isToday ? 'text-white' : 'text-slate-400'}`}>
                {day.dayName}
              </span>
              <CaptionText className="text-[10px] opacity-60 font-medium">{day.dateStr}</CaptionText>
            </div>

            <div className="space-y-1.5">
              <div className={`text-[11px] font-bold leading-tight line-clamp-2 ${day.isToday ? 'text-white' : 'text-slate-200'}`}>
                {day.topic}
              </div>
              <div className="flex items-center gap-1">
                {day.isCompleted ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> {day.minutesSpent} min
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1 text-[10px] font-medium">
                    <Clock className="w-3 h-3 opacity-70" /> 15 min
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}

