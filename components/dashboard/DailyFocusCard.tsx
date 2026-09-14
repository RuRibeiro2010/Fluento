import React from 'react';
import { Play, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { Lesson } from '@/types/lesson';

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
    <div className="rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-800/80 p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/60 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Hoje • Foco Recomendado</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Próxima Aula: {nextLesson.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
            <span>Nível: <strong className="text-indigo-300">{nextLesson.difficulty}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-400" /> {nextLesson.estimatedMinutes} minutos</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => onStartLesson && onStartLesson(nextLesson.id)}
            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Iniciar Leção</span>
          </button>

          <button
            onClick={onOpenVirtualTeacher}
            className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Praticar com Professor Virtual</span>
          </button>
        </div>
      </div>

      {/* Quick Lesson Highlights / Objectives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Objetivos de Aprendizagem
          </span>
          <div className="space-y-1.5">
            {grammarNotes.slice(0, 3).map((obj, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
            Expressões Principais
          </span>
          <div className="space-y-1.5">
            {vocabList.slice(0, 2).map((kp, idx) => (
              <div key={idx} className="text-slate-300">
                <strong className="text-white font-semibold">{kp.word}</strong>
                <span className="text-slate-400 text-[11px] italic block">{kp.translation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
