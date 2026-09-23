import React from 'react';
import { SkillMatrix } from '@/types/profile';
import { calculateConfidenceScore, getConfidenceBadge } from '@/lib/learning/confidence';
import { Card, Badge, Heading3, CaptionText } from '@/src/components/design-system';

interface ProgressTrackerProps {
  confidenceScore?: number;
  skillMatrix?: Partial<SkillMatrix>;
}

export function ProgressTracker({ confidenceScore, skillMatrix }: ProgressTrackerProps) {
  const score = confidenceScore ?? calculateConfidenceScore(skillMatrix);
  const badge = getConfidenceBadge(score);

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Heading3 className="text-sm font-bold">Confidence & Fluency Index</Heading3>
        <Badge variant="primary" size="sm" className="font-semibold px-2.5 py-1">
          {badge.label}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <CaptionText className="text-slate-400 font-semibold">Overall Score</CaptionText>
          <span className="text-xs font-bold text-indigo-400">{score}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]"
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
