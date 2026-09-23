import React from 'react';
import { Card, CaptionText } from '@/src/components/design-system';

interface WeeklyProgressProps {
  weeklyGoalMinutes?: number;
  completedMinutes?: number;
}

export function WeeklyProgress({ weeklyGoalMinutes = 75, completedMinutes = 45 }: WeeklyProgressProps) {
  const percentage = Math.min(100, Math.round((completedMinutes / Math.max(1, weeklyGoalMinutes)) * 100));

  return (
    <Card className="p-5 space-y-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <CaptionText className="text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider">
          Progresso da Meta Semanal
        </CaptionText>
        <CaptionText className="text-indigo-600 dark:text-indigo-400 font-black">
          {completedMinutes} / {weeklyGoalMinutes} min ({percentage}%)
        </CaptionText>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  );
}
