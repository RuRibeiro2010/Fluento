import React from 'react';
import { ArrowLeft, Globe, Sparkles } from 'lucide-react';
import { UI_LANGUAGES } from '@/lib/onboarding/quiz';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  uiLanguage: string;
  onUiLanguageChange: (lang: string) => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function OnboardingHeader({
  currentStep,
  totalSteps,
  uiLanguage,
  onUiLanguageChange,
  onBack,
  canGoBack,
}: OnboardingHeaderProps) {
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pt-4 px-4 sm:px-0">
      <div className="flex items-center justify-between gap-3">
        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            canGoBack
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'opacity-30 cursor-not-allowed text-slate-600'
          }`}
          aria-label="Previous Step"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Step Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Quick UI Language Switcher */}
        <div className="relative flex items-center gap-1 text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={uiLanguage}
            onChange={(e) => onUiLanguageChange(e.target.value)}
            className="bg-transparent text-slate-200 font-medium cursor-pointer focus:outline-none"
          >
            {UI_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-slate-900 text-slate-100">
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>Onboarding Progress</span>
          <span className="text-indigo-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
