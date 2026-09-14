import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

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
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Plano Semanal & Calendário</h3>
            <p className="text-xs text-slate-400">Distribuição recomendada para retenção máxima de fluência</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase">Progresso Semanal</span>
            <span className="text-indigo-300 font-bold">
              {completedMinutes} / {weeklyGoalMinutes} min ({percentComplete}%)
            </span>
          </div>
          <div className="w-24 bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${percentComplete}%` }} />
          </div>
        </div>
      </div>

      {/* Grid of 7 days */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition flex flex-col justify-between space-y-2 ${
              day.isToday
                ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                : day.isCompleted
                ? 'bg-slate-950/80 border-slate-800/80 text-slate-300'
                : 'bg-slate-950/30 border-slate-800/40 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold ${day.isToday ? 'text-indigo-300' : 'text-slate-400'}`}>
                {day.dayName}
              </span>
              <span className="text-[10px] opacity-70">{day.dateStr}</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold line-clamp-1">{day.topic}</div>
              <div className="flex items-center gap-1 text-[10px]">
                {day.isCompleted ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> {day.minutesSpent} min
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 15 min
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
