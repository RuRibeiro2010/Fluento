import React from 'react';
import { Lesson } from '@/types/lesson';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';

interface LessonCardProps {
  key?: string | number;
  lesson: Lesson;
  onStart: (lessonId: string) => void;
}

export function LessonCard({ lesson, onStart }: LessonCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-md transition space-y-4 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {lesson.difficulty || 'A1'} • {lesson.type}
          </span>
          {lesson.completed ? (
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle className="w-4 h-4" /> Completed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" /> {lesson.estimatedMinutes || 15} min
            </span>
          )}
        </div>

        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{lesson.title}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{lesson.description}</p>
      </div>

      <button
        onClick={() => onStart(lesson.id)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
      >
        <PlayCircle className="w-4 h-4" />
        {lesson.completed ? 'Review Lesson' : 'Start Lesson'}
      </button>
    </div>
  );
}
