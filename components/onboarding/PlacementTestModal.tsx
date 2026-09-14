import React, { useState } from 'react';
import { PlacementTestQuestion, PlacementTestResult } from '@/types/onboarding';
import { evaluatePlacementTest, getPlacementQuestions } from '@/lib/onboarding/placement-test';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Brain, Award } from 'lucide-react';

interface PlacementTestModalProps {
  targetLanguage: string;
  uiLanguage: string;
  onComplete: (result: PlacementTestResult) => void;
  onCancel: () => void;
}

export function PlacementTestModal({
  targetLanguage,
  uiLanguage,
  onComplete,
  onCancel,
}: PlacementTestModalProps) {
  const questions: PlacementTestQuestion[] = getPlacementQuestions(targetLanguage);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [testResult, setTestResult] = useState<PlacementTestResult | null>(null);

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = (optionId: string) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const result = evaluatePlacementTest(selectedAnswers, questions);
      setTestResult(result);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setTestResult(null);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              Adaptive AI Placement Test
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Assessing language fluency for target: <span className="uppercase font-bold text-indigo-300">{targetLanguage}</span>
            </p>
          </div>
        </div>

        {!testResult && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Q{currentIndex + 1} of {questions.length}
          </span>
        )}
      </div>

      {/* If Result Ready */}
      {testResult ? (
        <div className="space-y-6 text-center py-4">
          <div className="inline-flex p-4 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-amber-400">
            <Award className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              AI Evaluation Complete
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Assigned Level: <span className="text-amber-400">{testResult.assignedLevel}</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {testResult.recommendedFocus}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Accuracy Score:</span>
              <span className="text-indigo-300 font-bold">{testResult.score}%</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Key Strengths Identified:</span>
              <span className="text-emerald-400">{testResult.strengths.join(', ')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" /> Retake Test
            </button>
            <button
              onClick={() => onComplete(testResult)}
              className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <span>Accept Level ({testResult.assignedLevel}) & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Question Card */
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold uppercase">
              Target Level: {currentQ.levelTarget}
            </div>
            <h4 className="text-lg font-bold text-white">{currentQ.questionText}</h4>
            <p className="text-sm text-indigo-200 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-medium italic">
              "{currentQ.context}"
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              const isCorrect = opt.isCorrect;

              let btnClass = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700';
              if (showExplanation) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-950/50 border-emerald-500/80 text-emerald-200';
                } else if (isSelected) {
                  btnClass = 'bg-rose-950/50 border-rose-500/80 text-rose-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={showExplanation}
                  className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt.text}</span>
                  {showExplanation && (
                    <>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/50 text-xs text-indigo-200 space-y-1">
              <span className="font-bold flex items-center gap-1 text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Coach Explanation
              </span>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onCancel}
              className="text-xs font-medium text-slate-400 hover:text-white"
            >
              Skip Test
            </button>

            {showExplanation && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
