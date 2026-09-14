import React from 'react';
import { SkillMatrix } from '@/types/profile';
import { calculateConfidenceScore, getConfidenceBadge } from '@/lib/learning/confidence';

interface ProgressTrackerProps {
  confidenceScore?: number;
  skillMatrix?: Partial<SkillMatrix>;
}

export function ProgressTracker({ confidenceScore, skillMatrix }: ProgressTrackerProps) {
  const score = confidenceScore ?? calculateConfidenceScore(skillMatrix);
  const badge = getConfidenceBadge(score);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Confidence & Fluency Index</h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
          {badge.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400">Overall Score</span>
          <span className="text-indigo-600 dark:text-indigo-400">{score}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
