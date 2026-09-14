import React from 'react';

interface WeeklyProgressProps {
  weeklyGoalMinutes?: number;
  completedMinutes?: number;
}

export function WeeklyProgress({ weeklyGoalMinutes = 75, completedMinutes = 45 }: WeeklyProgressProps) {
  const percentage = Math.min(100, Math.round((completedMinutes / Math.max(1, weeklyGoalMinutes)) * 100));

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-800 dark:text-slate-200">Weekly Goal Progress</span>
        <span className="text-indigo-600 dark:text-indigo-400">
          {completedMinutes} / {weeklyGoalMinutes} min ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
