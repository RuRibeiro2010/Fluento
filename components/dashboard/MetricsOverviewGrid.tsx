import React from 'react';
import { Flame, Award, Mic, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import { Card, Heading2, Heading3, CaptionText } from '@/src/components/design-system';

interface MetricsOverviewGridProps {
  streakDays?: number;
  confidenceScore?: number;
  fluencyLevel?: string;
  pronunciationMastery?: number;
  activeVocabularyCount?: number;
}

export function MetricsOverviewGrid({
  streakDays = 5,
  confidenceScore = 74,
  fluencyLevel = 'B1 Intermediate',
  pronunciationMastery = 88,
  activeVocabularyCount = 340,
}: MetricsOverviewGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* 1. Streak */}
      <Card hoverable className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <CaptionText>Ofensiva (Streak)</CaptionText>
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
        </div>
        <Heading2 className="text-white font-black">{streakDays} Dias</Heading2>
        <div className="text-[11px] text-emerald-400 font-medium">Meta diária ativa</div>
      </Card>

      {/* 2. Confiança */}
      <Card hoverable className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <CaptionText>Confiança</CaptionText>
          <Award className="w-4 h-4 text-indigo-400" />
        </div>
        <Heading2 className="text-indigo-300 font-black">{confidenceScore}%</Heading2>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-500 h-1.5 rounded-full"
            style={{ width: `${Math.min(100, Math.max(5, confidenceScore))}%` }}
          />
        </div>
      </Card>

      {/* 3. Fluência */}
      <Card hoverable className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <CaptionText>Fluência</CaptionText>
          <TrendingUp className="w-4 h-4 text-purple-400" />
        </div>
        <Heading3 className="text-white truncate font-bold">{fluencyLevel}</Heading3>
        <div className="text-[11px] text-purple-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> CEFR Adaptativo
        </div>
      </Card>

      {/* 4. Pronúncia */}
      <Card hoverable className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <CaptionText>Pronúncia</CaptionText>
          <Mic className="w-4 h-4 text-emerald-400" />
        </div>
        <Heading2 className="text-emerald-300 font-black">{pronunciationMastery}%</Heading2>
        <div className="text-[11px] text-slate-400">Acoustic Precision</div>
      </Card>

      {/* 5. Vocabulário */}
      <Card hoverable className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <CaptionText>Vocabulário</CaptionText>
          <BookOpen className="w-4 h-4 text-amber-400" />
        </div>
        <Heading2 className="text-amber-200 font-black">{activeVocabularyCount}</Heading2>
        <div className="text-[11px] text-slate-400">Palavras ativas</div>
      </Card>
    </div>
  );
}
