import React from 'react';
import { Bot, MessageSquare } from 'lucide-react';

interface CoachCardProps {
  personality?: string;
  advice?: string;
  onInteract?: () => void;
}

export function CoachCard({ personality = 'Encouraging', advice, onInteract }: CoachCardProps) {
  return (
    <div className="rounded-xl border border-indigo-100 dark:border-indigo-950 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">AI Language Coach</h4>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 capitalize">{personality} Style</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
        "{advice || 'Ready to boost your fluency? Let’s work on your vocabulary and speaking confidence today!'}"
      </p>

      {onInteract && (
        <button
          onClick={onInteract}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Speak with Coach
        </button>
      )}
    </div>
  );
}
