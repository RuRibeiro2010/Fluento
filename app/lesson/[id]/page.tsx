import React, { useEffect, useState } from 'react';
import { Lesson } from '@/types/lesson';
import { generateLesson } from '@/lib/ai/lesson-generator';
import { LoadingState } from '@/components/ui/LoadingState';
import {
  ArrowLeft,
  CheckCircle2,
  Volume2,
  BookOpen,
  Sparkles,
  HelpCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  Target,
  Award,
  Video,
  Headphones,
  FileText,
  Mic,
  Send,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

interface LessonPageProps {
  lessonId?: string;
  onBack?: () => void;
}

export default function LessonPage({ lessonId = 'sample-1', onBack }: LessonPageProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPedagogy, setShowPedagogy] = useState(false);
  const [showExplainBetter, setShowExplainBetter] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      setLoading(true);
      const data = await generateLesson(
        'es',
        'pt',
        'Apresentação Executiva & Negociação de Ideias',
        'B1'
      );
      setLesson(data);
      setLoading(false);
    }

    fetchLesson();
  }, [lessonId]);

  if (loading) {
    return <LoadingState message="Preparando Lição com Decisão Pedagógica do AI Coach..." fullScreen />;
  }

  if (!lesson) {
    return null;
  }

  const handleOptionSelect = (exerciseId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
  };

  const explainBetter = lesson.content?.explainBetter || {
    concept: 'Estruturas Condicionais de Cortesia',
    simpleExplanation: 'Expressões em tom condicional permitem sugerir ideias e negociações de forma natural e diplomática, sem soar autoritário.',
    analogy: 'É como dizer "Gostaria de sugerir uma alternativa" em vez de "Faz assim".',
    nativeLanguageBridge: 'Em português é exatamente o mesmo tom de "Gostaria de propor...". Em espanhol usas "Quisiera proponer...".',
  };

  const homework = lesson.intelligentHomework;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-slate-800">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </button>
          <div className="text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
              {lesson.targetLanguage.toUpperCase()} • Nível {lesson.difficulty}
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-white mt-1">{lesson.title}</h1>
          </div>
          <div className="w-24 text-right">
            <button
              onClick={() => setShowExplainBetter(!showExplainBetter)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Explica melhor</span>
            </button>
          </div>
        </header>

        {/* Explain Better Drawer Modal */}
        {showExplainBetter && (
          <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Explicação Detalhada do Professor (Explica Melhor)</span>
              </div>
              <button
                onClick={() => setShowExplainBetter(false)}
                className="text-xs text-amber-400/80 hover:text-amber-200"
              >
                Fechar
              </button>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-200">
              <div>
                <strong className="text-amber-300 block mb-0.5">O Conceito de Forma Simples:</strong>
                <p className="bg-slate-950/60 p-3 rounded-xl border border-amber-500/20">{explainBetter.simpleExplanation}</p>
              </div>
              <div>
                <strong className="text-amber-300 block mb-0.5">Analogia Prática:</strong>
                <p className="bg-slate-950/60 p-3 rounded-xl border border-amber-500/20 italic">{explainBetter.analogy}</p>
              </div>
              <div>
                <strong className="text-amber-300 block mb-0.5">Ponte com a Língua Nativa:</strong>
                <p className="bg-slate-950/60 p-3 rounded-xl border border-amber-500/20">{explainBetter.nativeLanguageBridge}</p>
              </div>
            </div>
          </div>
        )}

        {submitted ? (
          /* Smart Lesson Ending Screen */
          <div className="rounded-2xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border border-indigo-700/50 p-6 md:p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="text-center space-y-2 border-b border-slate-800 pb-6">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-2">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Lição Concluída com Sucesso!</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Resumo da evolução pedagógica gerado pelo teu AI Coach.
              </p>
            </div>

            {/* Smart Lesson Ending Insights */}
            {lesson.smartEnding && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    O que Melhorou
                  </span>
                  <p className="text-slate-200 leading-relaxed">{lesson.smartEnding.whatImproved}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    O que Falta Melhorar
                  </span>
                  <p className="text-slate-200 leading-relaxed">{lesson.smartEnding.whatNeedsWork}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-1.5">
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                    O que Acontece Amanhã
                  </span>
                  <p className="text-slate-200 leading-relaxed">{lesson.smartEnding.previewTomorrow}</p>
                </div>
              </div>
            )}

            {/* Intelligent Homework (Tarefas Reais) */}
            {homework && (
              <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-800/40 pb-2">
                  <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-indigo-400" />
                    Tarefa Prática Recomendada (Mundo Real)
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-900 text-indigo-300 font-semibold">
                    {homework.estimatedMinutes} min
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{homework.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{homework.description}</p>
                </div>
                {homework.actionInstruction && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 italic">
                    💡 <strong>Instrução:</strong> {homework.actionInstruction}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onBack}
              className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <span>Voltar ao Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Main Lesson Flow */
          <main className="space-y-6">
            {/* Smart Lesson Introduction */}
            {lesson.smartIntroduction && (
              <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-800/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>Porquê esta Aula Existe</span>
                  </div>
                  <button
                    onClick={() => setShowPedagogy(!showPedagogy)}
                    className="text-[11px] font-semibold text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Brain className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Decisão Pedagógica AI</span>
                    {showPedagogy ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <strong className="text-indigo-300 block mb-1">Motivo:</strong>
                    <span className="text-slate-300">{lesson.smartIntroduction.whyThisLessonExists}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <strong className="text-indigo-300 block mb-1">Importância:</strong>
                    <span className="text-slate-300">{lesson.smartIntroduction.whyItIsImportant}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <strong className="text-indigo-300 block mb-1">Objetivo Final:</strong>
                    <span className="text-slate-300">{lesson.smartIntroduction.howItHelpsGoal}</span>
                  </div>
                </div>

                {/* Collapsible Internal AI Pedagogical Decisions */}
                {showPedagogy && lesson.pedagogicalDecision && (
                  <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-700/50 space-y-2 text-xs text-indigo-100 animate-fadeIn">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-400 block">
                      🧠 Raciocínio Pedagógico do AI Coach (Antes de Gerar)
                    </span>
                    <ul className="space-y-1 list-disc list-inside opacity-90 leading-relaxed">
                      <li><strong>Necessidade do Aluno:</strong> {lesson.pedagogicalDecision.studentNeeds}</li>
                      <li><strong>Justificação:</strong> {lesson.pedagogicalDecision.rationale}</li>
                      <li><strong>Metodologia:</strong> {lesson.pedagogicalDecision.methodology}</li>
                      <li><strong>Pontos de Fricção Esperados:</strong> {lesson.pedagogicalDecision.expectedFriction}</li>
                      <li><strong>Estratégia Motivacional:</strong> {lesson.pedagogicalDecision.motivationalHook}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Vocabulary */}
            {lesson.content?.vocabulary && lesson.content.vocabulary.length > 0 && (
              <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Vocabulário & Expressões Relevantes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lesson.content.vocabulary.map((vocab, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
                      <div className="flex items-center justify-between font-bold text-white text-sm">
                        <span>{vocab.word}</span>
                        <Volume2 className="w-4 h-4 text-slate-400 hover:text-indigo-400 cursor-pointer" />
                      </div>
                      <p className="text-xs text-indigo-300 font-medium">{vocab.translation}</p>
                      {vocab.example && <p className="text-xs text-slate-400 italic mt-1">"{vocab.example}"</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Interactive Dialogue */}
            {lesson.content?.dialogue && lesson.content.dialogue.length > 0 && (
              <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Diálogo de Exemplo no Contexto
                </h2>
                <div className="space-y-3">
                  {lesson.content.dialogue.map((line, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl max-w-lg ${
                        line.speaker === 'Coach'
                          ? 'bg-indigo-950/60 border border-indigo-800/60 text-indigo-100 mr-auto'
                          : 'bg-slate-800 border border-slate-700 text-slate-100 ml-auto'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase opacity-70 mb-1">{line.speaker}</div>
                      <div className="text-xs sm:text-sm font-medium">{line.text}</div>
                      {line.translation && (
                        <div className="text-xs text-slate-400 mt-1 italic">{line.translation}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Exercises */}
            {lesson.content?.exercises && lesson.content.exercises.length > 0 && (
              <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Exercício Prático
                  </h2>
                  <button
                    onClick={() => setShowExplainBetter(true)}
                    className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Dúvidas? Explica melhor</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {lesson.content.exercises.map((ex) => (
                    <div key={ex.id} className="space-y-3">
                      <p className="text-xs sm:text-sm font-bold text-white">{ex.prompt}</p>
                      <div className="grid gap-2">
                        {ex.options?.map((opt) => {
                          const isSelected = selectedAnswers[ex.id] === opt.text;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleOptionSelect(ex.id, opt.text)}
                              className={`p-3.5 rounded-xl border text-left text-xs font-medium transition ${
                                isSelected
                                  ? 'border-indigo-500 bg-indigo-950/80 text-indigo-200 shadow-md'
                                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/50 text-slate-300'
                              }`}
                            >
                              {opt.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <button
              onClick={() => setSubmitted(true)}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-xl shadow-indigo-600/30 hover:scale-[1.01]"
            >
              <span>Concluir Lição e Ver Análise do Coach</span>
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </main>
        )}
      </div>
    </div>
  );
}
