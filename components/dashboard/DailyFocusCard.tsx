import React from 'react';
import { Play, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { Lesson } from '@/types/lesson';
import { Card, Button, Badge, Heading2, CaptionText } from '@/src/components/design-system';

interface DailyFocusCardProps {
  nextLesson?: Lesson;
  onStartLesson?: (lessonId: string) => void;
  onOpenVirtualTeacher?: () => void;
}

export function DailyFocusCard({
  nextLesson = {
    id: 'lesson-1',
    title: 'Apresentação Executiva & Negociação de Ideias',
    description: 'Aprenda conectores de opinião e vocabulário de reuniões corporativas.',
    targetLanguage: 'es',
    nativeLanguage: 'pt',
    difficulty: 'B1',
    type: 'conversation',
    estimatedMinutes: 15,
    content: {
      grammarNotes: [
        'Dominar conectores de opinião ("Desde mi punto de vista")',
        'Manter ritmo sem pausas longas',
      ],
      vocabulary: [
        { word: 'Desde mi punto de vista...', translation: 'Do meu ponto de vista...' },
        { word: 'Quisiera proponer una alternativa.', translation: 'Gostaria de propor uma alternativa.' },
      ],
    },
    createdAt: new Date().toISOString(),
  },
  onStartLesson,
  onOpenVirtualTeacher,
}: DailyFocusCardProps) {
  const grammarNotes = nextLesson.content?.grammarNotes || [
    'Dominar conectores de opinião',
    'Manter ritmo sem pausas longas',
  ];
  const vocabList = nextLesson.content?.vocabulary || [];

  return (
    <Card variant="accent" className="p-6 md:p-8 space-y-6 border-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <Badge variant="indigo" dot>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1.5" />
            Hoje • Foco Recomendado
          </Badge>
          <Heading2 className="text-white tracking-tight">
            Próxima Aula: {nextLesson.title}
          </Heading2>
          <div className="flex items-center gap-3">
            <CaptionText className="text-indigo-100">
              Nível: <strong className="text-white">{nextLesson.difficulty}</strong>
            </CaptionText>
            <span className="opacity-30 text-white">•</span>
            <CaptionText className="text-indigo-100 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-300" /> {nextLesson.estimatedMinutes} minutos
            </CaptionText>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={() => onStartLesson && onStartLesson(nextLesson.id)}
            variant="primary"
            size="lg"
            icon={<Play className="w-4 h-4 fill-white" />}
          >
            Iniciar Lição
          </Button>

          <Button
            onClick={onOpenVirtualTeacher}
            variant="secondary"
            size="lg"
            icon={<Sparkles className="w-4 h-4 text-amber-400" />}
          >
            Professor Virtual
          </Button>
        </div>
      </div>

      {/* Quick Lesson Highlights / Objectives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="default" className="p-4 bg-white/5 border-white/5 space-y-3">
          <CaptionText className="text-indigo-200 uppercase tracking-widest font-bold block">
            Objetivos de Aprendizagem
          </CaptionText>
          <div className="space-y-2">
            {grammarNotes.slice(0, 3).map((obj, i) => (
              <div key={i} className="flex items-center gap-2.5 text-slate-200 font-medium text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="default" className="p-4 bg-white/5 border-white/5 space-y-3">
          <CaptionText className="text-indigo-200 uppercase tracking-widest font-bold block">
            Expressões Principais
          </CaptionText>
          <div className="space-y-2.5">
            {vocabList.slice(0, 2).map((kp, idx) => (
              <div key={idx} className="text-slate-300">
                <div className="text-white font-semibold text-xs">{kp.word}</div>
                <div className="text-slate-400 text-[10px] italic">{kp.translation}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Card>
  );
}
