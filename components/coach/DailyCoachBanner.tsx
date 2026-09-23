import React from 'react';
import { DailyCoachMessage } from '@/types/coach';
import { CoachPersonalityBadge } from './CoachPersonalityBadge';
import { Bot, Sparkles, ArrowRight, Lightbulb, Target, Calendar, TrendingUp } from 'lucide-react';
import { Card, Button, Badge, Heading3, CaptionText } from '@/src/components/design-system';

interface DailyCoachBannerProps {
  message: DailyCoachMessage;
  onStartLesson?: () => void;
  onOpenWeeklyReview?: () => void;
  onOpenTimeline?: () => void;
  className?: string;
}

export function DailyCoachBanner({
  message,
  onStartLesson,
  onOpenWeeklyReview,
  onOpenTimeline,
  className = '',
}: DailyCoachBannerProps) {
  return (
    <Card
      variant="accent"
      className={`relative overflow-hidden p-5 sm:p-6 shadow-xl ${className}`}
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top bar with Coach badge & Focus Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <Heading3 className="text-white text-base sm:text-lg flex items-center gap-2">
                O Teu AI Coach Pessoal
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              </Heading3>
              <CaptionText className="text-slate-400">Acompanhamento humano adaptativo contínuo</CaptionText>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CoachPersonalityBadge personality={message.tone} size="sm" />
            <Badge variant="primary" size="sm" className="font-extrabold uppercase tracking-wider gap-1 border-indigo-800/50 bg-slate-800">
              <Target className="w-3 h-3 text-indigo-400" />
              {message.focusSkill} Focus
            </Badge>
          </div>
        </div>

        {/* Coach Advice Body */}
        <div className="space-y-2">
          <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug">
            {message.greeting}
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {message.advice}
          </p>
        </div>

        {/* Motivational Quote Callout */}
        {message.motivationQuote && (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-indigo-900/40 text-xs text-indigo-200 flex items-center gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="italic font-medium text-slate-300">
              "{message.motivationQuote}"
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            {onOpenWeeklyReview && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenWeeklyReview}
                className="rounded-xl border-slate-700 font-semibold"
                icon={<Calendar className="w-3.5 h-3.5 text-amber-400" />}
              >
                Revisão Semanal
              </Button>
            )}

            {onOpenTimeline && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenTimeline}
                className="rounded-xl border-slate-700 font-semibold"
                icon={<TrendingUp className="w-3.5 h-3.5 text-indigo-400" />}
              >
                Timeline Mensal
              </Button>
            )}
          </div>

          {onStartLesson && (
            <Button
              variant="primary"
              size="md"
              onClick={onStartLesson}
              className="rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] font-bold"
              icon={<ArrowRight className="w-4 h-4 order-last" />}
            >
              {message.recommendedAction || 'Iniciar Aula de Hoje'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
