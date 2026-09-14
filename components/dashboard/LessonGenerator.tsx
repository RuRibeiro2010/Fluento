import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { TargetLanguage } from '@/types/language';

interface LessonGeneratorProps {
  topic: string;
  setTopic: (topic: string) => void;
  targetLanguage: TargetLanguage;
  setTargetLanguage: (lang: TargetLanguage) => void;
  level: string;
  setLevel: (level: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  supportedLanguages: { code: TargetLanguage; name: string; flag: string }[];
}

export function LessonGenerator({
  topic,
  setTopic,
  targetLanguage,
  setTargetLanguage,
  level,
  setLevel,
  onGenerate,
  isGenerating,
  supportedLanguages,
}: LessonGeneratorProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
        <Sparkles className="w-4 h-4" />
        <span>Generate AI Custom Lesson</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Language Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Language
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value as TargetLanguage)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            CEFR Target Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="A1">A1 - Beginner</option>
            <option value="A2">A2 - Elementary</option>
            <option value="B1">B1 - Intermediate</option>
            <option value="B2">B2 - Upper Intermediate</option>
            <option value="C1">C1 - Advanced</option>
          </select>
        </div>

        {/* Topic Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Lesson Topic / Goal
          </label>
          <input
            type="text"
            placeholder="e.g. Ordering coffee, Job Interview..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !topic.trim()}
        className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating Lesson with AI Memory...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate Adaptive Lesson</span>
          </>
        )}
      </button>
    </div>
  );
}
