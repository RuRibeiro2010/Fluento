import React from 'react';
import { TeacherPersona } from '@/types/teacher';
import { TeacherAvatar } from './TeacherAvatar';
import { ArrowRight, Sparkles, Tag, Users } from 'lucide-react';

interface PersonaCardProps {
  key?: React.Key;
  persona: TeacherPersona;
  isSelected?: boolean;
  onSelect: (persona: TeacherPersona) => void;
}

export function PersonaCard({ persona, isSelected = false, onSelect }: PersonaCardProps) {
  return (
    <div
      onClick={() => onSelect(persona)}
      className={`group relative p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 ${
        isSelected
          ? 'bg-indigo-950/70 border-indigo-500 shadow-xl shadow-indigo-600/20 ring-2 ring-indigo-500/30'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
      }`}
    >
      <div className="space-y-3">
        {/* Header: Avatar & Level */}
        <div className="flex items-start justify-between gap-3">
          <TeacherAvatar persona={persona} size="md" />

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-indigo-300">
              {persona.difficulty}
            </span>
            {persona.scenarioTitle && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" /> Scenario
              </span>
            )}
          </div>
        </div>

        {/* Name & Role */}
        <div>
          <h4 className="font-extrabold text-base sm:text-lg text-white group-hover:text-indigo-200 transition">
            {persona.name}
          </h4>
          <p className="text-xs font-semibold text-indigo-400">{persona.role}</p>
        </div>

        {/* Context / Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-normal">
          {persona.situationContext || persona.description}
        </p>

        {/* Traits Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {persona.personalityTraits.map((trait, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-slate-400"
            >
              #{trait}
            </span>
          ))}
        </div>
      </div>

      {/* Action footer */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
        <span>Start Practice Session</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}
