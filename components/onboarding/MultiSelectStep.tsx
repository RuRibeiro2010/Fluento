import React from 'react';
import { QuizQuestion } from '@/types/onboarding';
import { Check, Plus } from 'lucide-react';

interface MultiSelectStepProps {
  question: QuizQuestion;
  uiLanguage: string;
  selectedValues?: string[];
  onToggle: (value: string) => void;
}

export function MultiSelectStep({
  question,
  uiLanguage,
  selectedValues = [],
  onToggle,
}: MultiSelectStepProps) {
  const title = question.question[uiLanguage] || question.question.en || '';
  const subtitle = question.subtitle?.[uiLanguage] || question.subtitle?.en || '';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-semibold">
          <span>{selectedValues.length} Selected</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1 pr-1 custom-scrollbar">
        {question.options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className={`group relative p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-600/20 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3">
                {opt.icon && <span className="text-2xl shrink-0">{opt.icon}</span>}
                <div>
                  <span className="font-bold text-sm sm:text-base text-white block">
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="text-xs text-slate-300 block font-normal mt-0.5">
                      {opt.description}
                    </span>
                  )}
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-700 bg-slate-950/50 group-hover:border-slate-500 text-slate-500'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
