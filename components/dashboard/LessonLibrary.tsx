import React from 'react';
import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { Lesson } from '@/types/lesson';
import { Card, Heading3, CaptionText, Badge } from '@/src/components/design-system';

interface LessonLibraryProps {
  lessons: Lesson[];
  onSelectLesson: (lessonId: string) => void;
}

export function LessonLibrary({ lessons, onSelectLesson }: LessonLibraryProps) {
  if (lessons.length === 0) {
    return (
      <Card variant="outlined" className="p-8 text-center border-dashed">
        <CaptionText className="text-slate-500">
          No generated lessons yet. Use the AI Lesson Generator above to create your first session.
        </CaptionText>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading3 className="text-sm font-bold flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" /> Lesson Library
        </Heading3>
        <CaptionText className="text-slate-500">{lessons.length} lessons available</CaptionText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lessons.map((lesson) => (
          <Card
            key={lesson.id}
            onClick={() => onSelectLesson(lesson.id)}
            hoverable
            className="p-4 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="cefr" size="sm" className="font-black">
                  {lesson.difficulty || 'B1'} • {lesson.targetLanguage.toUpperCase()}
                </Badge>
                {lesson.completed && (
                  <Badge variant="success" size="sm" className="gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Done
                  </Badge>
                )}
              </div>
              <h4 className="font-bold text-sm text-slate-100">{lesson.title}</h4>
              <CaptionText className="text-slate-400 line-clamp-2">{lesson.description}</CaptionText>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-semibold text-indigo-400">
              <span>Start Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
