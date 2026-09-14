import React from 'react';
import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { Lesson } from '@/types/lesson';

interface LessonLibraryProps {
  lessons: Lesson[];
  onSelectLesson: (lessonId: string) => void;
}

export function LessonLibrary({ lessons, onSelectLesson }: LessonLibraryProps) {
  if (lessons.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center text-xs text-slate-500">
        No generated lessons yet. Use the AI Lesson Generator above to create your first session.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" /> Lesson Library
        </h3>
        <span className="text-xs text-slate-500">{lessons.length} lessons available</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => onSelectLesson(lesson.id)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 transition cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {lesson.difficulty || 'B1'} • {lesson.targetLanguage.toUpperCase()}
                </span>
                {lesson.completed && (
                  <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Done
                  </span>
                )}
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{lesson.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{lesson.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Start Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
