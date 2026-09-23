import React from 'react';
import { Lesson } from '@/types/lesson';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, Badge, Button, CaptionText } from '@/src/components/design-system';

interface LessonCardProps {
  key?: string | number;
  lesson: Lesson;
  onStart: (lessonId: string) => void;
}

export function LessonCard({ lesson, onStart }: LessonCardProps) {
  return (
    <Card 
      hoverable 
      className="p-5 flex flex-col justify-between space-y-4"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="cefr" size="sm" className="font-black">
            {lesson.difficulty || 'A1'} • {lesson.type}
          </Badge>
          {lesson.completed ? (
            <Badge variant="success" size="sm" className="gap-1 font-bold">
              <CheckCircle className="w-3.5 h-3.5" /> Completed
            </Badge>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <CaptionText className="text-[11px] font-bold">
                {lesson.estimatedMinutes || 15} min
              </CaptionText>
            </div>
          )}
        </div>

        <h3 className="font-bold text-slate-100 text-base">{lesson.title}</h3>
        <CaptionText className="text-slate-400 line-clamp-2">
          {lesson.description}
        </CaptionText>
      </div>

      <Button
        onClick={() => onStart(lesson.id)}
        variant={lesson.completed ? "secondary" : "primary"}
        size="md"
        className="w-full"
        icon={<PlayCircle className="w-4 h-4" />}
      >
        {lesson.completed ? 'Review Lesson' : 'Start Lesson'}
      </Button>
    </Card>
  );
}

