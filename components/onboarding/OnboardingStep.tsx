import React from 'react';
import { QuizQuestion } from '@/types/onboarding';

interface OnboardingStepProps {
  question: QuizQuestion;
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export function OnboardingStep({ question, selectedValue, onSelect }: OnboardingStepProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{question.question}</h2>
        {question.subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{question.subtitle}</p>}
      </div>

      <div className="grid gap-3">
        {question.options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`flex items-center justify-between p-4 rounded-xl border text-left transition ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div>
                <div className="font-semibold text-sm">{opt.label}</div>
                {opt.description && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.description}</div>}
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
