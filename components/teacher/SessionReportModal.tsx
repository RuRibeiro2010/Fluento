import React from 'react';
import { SessionReport } from '@/types/teacher';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Bot,
  Brain,
} from 'lucide-react';

interface SessionReportModalProps {
  report: SessionReport;
  onClose: () => void;
  onSyncWithCoach?: () => void;
}

export function SessionReportModal({
  report,
  onClose,
  onSyncWithCoach,
}: SessionReportModalProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500';
    if (score >= 70) return 'text-indigo-400 bg-indigo-500';
    return 'text-amber-400 bg-amber-500';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        {/* Top Grade Banner */}
        <div className="text-center space-y-2 border-b border-slate-800 pb-6">
          <div className="inline-flex p-4 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-amber-400 mb-2">
            <Award className="w-12 h-12" />
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center justify-center gap-1.5">
            Conversation Session Complete
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Overall Grade: <span className="text-amber-400">{report.overallGrade}</span>
          </h2>
          <p className="text-xs text-slate-400">
            Partner: <span className="text-white font-semibold">{report.characterName}</span> • Duration:{' '}
            <span className="text-white font-semibold">{report.durationMinutes} Mins</span> • Turns:{' '}
            <span className="text-white font-semibold">{report.totalUserTurns} Messages</span>
            {report.studentTalkRatioPercentage && (
              <>
                {' '}
                • Tempo de Fala Aluno:{' '}
                <span className="text-emerald-400 font-extrabold">{report.studentTalkRatioPercentage}%</span>
              </>
            )}
          </p>
        </div>

        {/* Feedback Quote */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
          "{report.summaryFeedback}"
        </div>

        {/* Metric Scores Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Fluency', score: report.fluencyScore },
            { label: 'Pronunciation', score: report.pronunciationScore },
            { label: 'Grammar', score: report.grammarScore },
            { label: 'Vocabulary', score: report.vocabularyScore },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>{m.label}</span>
                <span className={getScoreColor(m.score).split(' ')[0]}>{m.score}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getScoreColor(m.score).split(' ')[1]}`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Vocabulary & Errors Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* New Vocabulary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> New Words & Phrases
            </h4>
            <div className="space-y-2">
              {report.newWordsLearned.map((item, idx) => (
                <div key={idx} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-indigo-300">
                    <span>{item.word}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{item.meaning}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">"{item.contextSentence}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Frequent Errors */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Frequent Corrections
            </h4>
            <div className="space-y-2">
              {report.frequentErrors.map((err, idx) => (
                <div key={idx} className="text-xs space-y-0.5">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="line-through text-rose-400">{err.error}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-emerald-400 font-bold">{err.correction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Reflection Metacognition Card */}
        {report.aiReflection && (
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-emerald-400" />
                Reflexão Interna do Professor (AI Reflection)
              </span>
              <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-emerald-300">
                Fala Aluno: {report.aiReflection.studentTalkRatioPercentage}% (Alvo ~70%)
              </span>
            </div>
            <p className="text-xs text-slate-300 italic">
              "{report.aiReflection.keyPedagogicalTakeaway}"
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col gap-1">
              <span><strong>Evolução Emocional:</strong> {report.aiReflection.observedEmotionalTrajectory}</span>
              <span><strong>Estratégia para a Próxima Aula:</strong> {report.aiReflection.adaptationStrategyForNextSession}</span>
            </div>
          </div>
        )}

        {/* AI Coach Recommendations */}
        <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Brain className="w-4 h-4 text-amber-400" />
            <span>AI Coach Recommendations (Syncing with Memory)</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
            {report.coachRecommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Close Report
          </button>
          <button
            onClick={() => {
              if (onSyncWithCoach) onSyncWithCoach();
              onClose();
            }}
            className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30"
          >
            <span>Sync Report with AI Coach</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
