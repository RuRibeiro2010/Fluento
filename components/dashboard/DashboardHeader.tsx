import React from 'react';
import { UserProfile } from '@/types/profile';
import { Flame, Target, Sparkles } from 'lucide-react';
import { getLanguageByCode } from '@/lib/language/languages';
import { Card, Heading1, CaptionText, Badge } from '@/src/components/design-system';

interface DashboardHeaderProps {
  profile: Partial<UserProfile>;
  streakCount?: number;
}

export function DashboardHeader({ profile, streakCount = 3 }: DashboardHeaderProps) {
  const nativeLang = getLanguageByCode(profile.native_language || 'en');
  const targetLangs = (profile.target_languages || ['es']).map((c) => getLanguageByCode(c));

  return (
    <Card variant="accent" className="p-6 border-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="indigo" dot>
              <Sparkles className="w-3 h-3 text-amber-400 mr-1" />
              AI Language Coach Active
            </Badge>
          </div>
          <Heading1>
            Welcome back, {profile.email ? profile.email.split('@')[0] : 'Learner'}!
          </Heading1>
          <div className="flex items-center gap-2">
            <CaptionText className="text-indigo-100 font-medium">
              Learning: {targetLangs.map((t) => `${t.flag || ''} ${t.name}`).join(', ')}
            </CaptionText>
            <span className="opacity-50 text-indigo-100">•</span>
            <CaptionText className="text-indigo-100 font-medium">
              Native: {nativeLang.flag} {nativeLang.name}
            </CaptionText>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <CaptionText className="text-indigo-200 uppercase tracking-wider block">Daily Streak</CaptionText>
              <div className="text-lg font-bold">{streakCount} Days</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <CaptionText className="text-indigo-200 uppercase tracking-wider block">Daily Goal</CaptionText>
              <div className="text-lg font-bold">{profile.minutes_per_day || 15} min</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
