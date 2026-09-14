import React from 'react';
import { CorrectionMode } from '@/types/teacher';
import { ShieldCheck, Scale, Zap } from 'lucide-react';

interface CorrectionModeSelectorProps {
  currentMode: CorrectionMode;
  onChange: (mode: CorrectionMode) => void;
  className?: string;
}

export function CorrectionModeSelector({
  currentMode,
  onChange,
  className = '',
}: CorrectionModeSelectorProps) {
  const modes: { id: CorrectionMode; label: string; desc: string; icon: React.ReactNode; badgeColor: string }[] = [
    {
      id: 'relaxed',
      label: 'Relaxed',
      desc: 'Flow first. Only major errors block conversation.',
      icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
      badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/60',
    },
    {
      id: 'balanced',
      label: 'Balanced',
      desc: 'Gentle feedback on grammar & natural phrases.',
      icon: <Scale className="w-3.5 h-3.5 text-indigo-400" />,
      badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/60',
    },
    {
      id: 'strict',
      label: 'Strict',
      desc: 'Detailed syntax, preposition, and accent corrections.',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />,
      badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/60',
    },
  ];

  return (
    <div className={`space-y-1.5 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
        Correction Intensity Level
      </span>
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className={`p-2 rounded-lg text-left transition flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-850 border border-slate-700 shadow-md ring-1 ring-indigo-500/30'
                  : 'hover:bg-slate-900 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                {m.icon}
                <span>{m.label}</span>
              </div>
              <span className="text-[9px] text-slate-400 leading-tight mt-1 line-clamp-1 hidden sm:block">
                {m.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
