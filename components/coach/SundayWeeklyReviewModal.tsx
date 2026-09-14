import React from 'react';
import { SundayWeeklyReview } from '@/types/coach';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Target,
  Sparkles,
  ArrowRight,
  X,
  Award,
  BookOpen,
} from 'lucide-react';

interface SundayWeeklyReviewModalProps {
  review: SundayWeeklyReview;
  onClose: () => void;
}

export function SundayWeeklyReviewModal({ review, onClose }: SundayWeeklyReviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-indigo-500/40 p-6 md:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Resumo Semanal Automático • Domingo</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Revisão da Semana (Semana {review.weekNumber})
          </h2>
          <p className="text-xs text-slate-400">{review.dateRange}</p>
        </div>

        {/* Coach Personal Note */}
        <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-xs text-indigo-200 leading-relaxed italic flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-bold mb-1 not-italic">
              Nota Pessoal do teu AI Coach:
            </strong>
            "{review.coachPersonalNote}"
          </div>
        </div>

        {/* Grid: Achievements vs Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Achievements */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-900/50 space-y-3">
            <h3 className="font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Conquistas da Semana
            </h3>
            <ul className="space-y-2">
              {review.achievements.map((item, i) => (
                <li key={i} className="text-slate-200 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-900/50 space-y-3">
            <h3 className="font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" /> Pontos de Reforço
            </h3>
            <ul className="space-y-2">
              {review.weaknessesIdentified.map((item, i) => (
                <li key={i} className="text-slate-200 flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Week Plan */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
          <h3 className="font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Plano para a Próxima Semana
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {review.nextWeekPlan.map((plan, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                {plan}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl transition flex items-center justify-center gap-2"
        >
          <span>Continuar com o Novo Plano</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
