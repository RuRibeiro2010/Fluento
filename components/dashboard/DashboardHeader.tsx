import React from 'react';
import { UserProfile } from '@/types/profile';
import { Flame, Target, Sparkles } from 'lucide-react';
import { getLanguageByCode } from '@/lib/language/languages';

interface DashboardHeaderProps {
  profile: Partial<UserProfile>;
  streakCount?: number;
}

export function DashboardHeader({ profile, streakCount = 3 }: DashboardHeaderProps) {
  const nativeLang = getLanguageByCode(profile.native_language || 'en');
  const targetLangs = (profile.target_languages || ['es']).map((c) => getLanguageByCode(c));

  return (
    <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Language Coach Active
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {profile.email ? profile.email.split('@')[0] : 'Learner'}!
          </h1>
          <p className="text-sm text-indigo-100 flex items-center gap-2">
            <span>Learning: {targetLangs.map((t) => `${t.flag || ''} ${t.name}`).join(', ')}</span>
            <span className="opacity-50">•</span>
            <span>Native: {nativeLang.flag} {nativeLang.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="text-xs text-indigo-200 font-medium">Daily Streak</div>
              <div className="text-lg font-bold">{streakCount} Days</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-indigo-200 font-medium">Daily Goal</div>
              <div className="text-lg font-bold">{profile.minutes_per_day || 15} min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
