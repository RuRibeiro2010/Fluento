import React from 'react';
import { TeacherPersona } from '@/types/teacher';
import { Mic, Volume2 } from 'lucide-react';

interface TeacherAvatarProps {
  persona: TeacherPersona;
  isSpeaking?: boolean;
  isListening?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TeacherAvatar({
  persona,
  isSpeaking = false,
  isListening = false,
  size = 'md',
}: TeacherAvatarProps) {
  const sizeMap = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer Glow Wave when Speaking */}
      {isSpeaking && (
        <span className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping pointer-events-none" />
      )}

      {/* Outer Pulse Ring when Listening */}
      {isListening && (
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none" />
      )}

      {/* Main Avatar Circle */}
      <div
        className={`rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 shadow-xl flex items-center justify-center shrink-0 relative ${sizeMap[size]}`}
      >
        <span>{persona.avatar || '👩🏽‍💼'}</span>

        {/* Status Indicator Badge */}
        {isSpeaking && (
          <div className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 text-white rounded-full border border-slate-900 shadow">
            <Volume2 className="w-3 h-3 animate-bounce" />
          </div>
        )}

        {isListening && (
          <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full border border-slate-900 shadow">
            <Mic className="w-3 h-3 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
