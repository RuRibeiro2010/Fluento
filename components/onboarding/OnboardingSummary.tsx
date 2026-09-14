import React from 'react';
import { OnboardingData } from '@/types/onboarding';
import { UserProfile } from '@/types/profile';
import { Sparkles, CheckCircle2, ShieldCheck, Flame, Target, BookOpen, User, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface OnboardingSummaryProps {
  data: OnboardingData;
  isLoading: boolean;
  error?: string | null;
  onConfirm: () => void;
  onRetry?: () => void;
}

export function OnboardingSummary({
  data,
  isLoading,
  error,
  onConfirm,
  onRetry,
}: OnboardingSummaryProps) {
  // Empty state check
  if (!data || (!data.targetLanguages || data.targetLanguages.length === 0)) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Missing Onboarding Choices</h3>
        <p className="text-sm text-slate-400">
          Please step back and select at least one target language to complete your profile setup.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-6 max-w-lg mx-auto shadow-2xl">
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Sparkles className="w-8 h-8 text-amber-400 fill-amber-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-white">Building Your Learner Persona</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Configuring AI Coach parameters, initial fluency matrix, and interest topics...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-rose-500/40 text-center space-y-4 max-w-md mx-auto shadow-2xl">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Profile Creation Error</h3>
        <p className="text-xs text-rose-300">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs inline-flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
      </div>
    );
  }

  const finalLevel = data.placementResult?.assignedLevel || data.currentLevel || 'A1';

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile Setup Ready</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Your Personalized Learner Persona
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Your AI Coach has calibrated your daily study path based on your exact preferences.
        </p>
      </div>

      {/* Main Persona Card */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* AI Coach Preview Banner */}
        <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/50 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shrink-0 shadow-md">
            AI
          </div>
          <div className="space-y-1 text-xs">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              AI Coach ({data.coachStyle || 'Encouraging'})
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </span>
            <p className="text-slate-300 leading-relaxed italic">
              "Welcome! I’m set up to guide you in mastering{' '}
              <span className="font-bold text-white uppercase">{data.targetLanguages.join(', ')}</span>.
              We will practice {data.dailyCommitmentMinutes || 15} minutes a day at {finalLevel} level."
            </p>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-400" /> Target Langs
            </span>
            <span className="font-bold text-sm text-white uppercase">
              {data.targetLanguages.join(', ')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Target className="w-3 h-3 text-amber-400" /> Fluency Level
            </span>
            <span className="font-bold text-sm text-amber-400">
              {finalLevel} {data.placementResult ? '(Tested)' : ''}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-400" /> Daily Commitment
            </span>
            <span className="font-bold text-sm text-white">
              {data.dailyCommitmentMinutes || 15} Mins / Day
            </span>
          </div>
        </div>

        {/* Details Breakdown */}
        <div className="space-y-3 text-xs border-t border-slate-800/80 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Native Language:</span>
            <span className="font-bold text-slate-200 uppercase">{data.nativeLanguage}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Primary Motivation:</span>
            <span className="font-bold text-slate-200 capitalize">{data.primaryGoal}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Learning Style:</span>
            <span className="font-bold text-indigo-300 capitalize">{data.learningStyle}</span>
          </div>

          {data.interests && data.interests.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-slate-400 font-medium block">Selected Topics of Interest:</span>
              <div className="flex flex-wrap gap-1.5">
                {data.interests.map((topic) => (
                  <span
                    key={topic}
                    className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-300 capitalize"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Action */}
      <div className="pt-2">
        <button
          onClick={onConfirm}
          className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm sm:text-base transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Complete Onboarding & Start Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
