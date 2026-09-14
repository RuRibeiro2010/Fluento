import React from 'react';
import { QuizQuestion } from '@/types/onboarding';
import { Check } from 'lucide-react';

interface SingleSelectStepProps {
  question: QuizQuestion;
  uiLanguage: string;
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export function SingleSelectStep({
  question,
  uiLanguage,
  selectedValue,
  onSelect,
}: SingleSelectStepProps) {
  const title = question.question[uiLanguage] || question.question.en || '';
  const subtitle = question.subtitle?.[uiLanguage] || question.subtitle?.en || '';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
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
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`group relative p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-600/20 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    {opt.icon && <span className="text-lg">{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </span>

                  {opt.badge && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-800 text-indigo-300 border border-indigo-800/50'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  )}
                </div>

                {opt.description && (
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {opt.description}
                  </p>
                )}
              </div>

              <div className="mt-3 flex justify-end">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-slate-700 bg-slate-950/50 group-hover:border-slate-500'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
