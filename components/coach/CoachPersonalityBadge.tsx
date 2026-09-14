import React from 'react';
import { Sparkles, Brain, Flame, GraduationCap, Compass, Smile } from 'lucide-react';

interface CoachPersonalityBadgeProps {
  personality: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CoachPersonalityBadge({ personality, size = 'md' }: CoachPersonalityBadgeProps) {
  const normalized = (personality || 'encouraging').toLowerCase();

  let icon = <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />;
  let label = 'Encouraging Coach';
  let colorClass = 'bg-amber-950/80 border-amber-500/40 text-amber-300';

  if (normalized.includes('strict') || normalized.includes('academic')) {
    icon = <GraduationCap className="w-3.5 h-3.5 text-purple-400" />;
    label = 'Academic Coach';
    colorClass = 'bg-purple-950/80 border-purple-500/40 text-purple-300';
  } else if (normalized.includes('casual')) {
    icon = <Smile className="w-3.5 h-3.5 text-emerald-400" />;
    label = 'Casual Coach';
    colorClass = 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300';
  } else if (normalized.includes('socratic')) {
    icon = <Brain className="w-3.5 h-3.5 text-sky-400" />;
    label = 'Socratic Coach';
    colorClass = 'bg-sky-950/80 border-sky-500/40 text-sky-300';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border font-bold uppercase tracking-wider ${colorClass} ${sizeClasses[size]}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
