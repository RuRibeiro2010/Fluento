import React from 'react';
import {
  Sparkles,
  Target,
  Calendar,
  Award,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Brain,
  Clock,
  Zap,
} from 'lucide-react';
import { AssessmentResultData } from '../assessment/AdaptiveAssessmentView';

interface PersonalizedPlanViewProps {
  userName?: string;
  assessmentResult?: AssessmentResultData | null;
  onContinue: () => void;
}

export function PersonalizedPlanView({
  userName = 'Aluno',
  assessmentResult,
  onContinue,
}: PersonalizedPlanViewProps) {
  const currentLevel = assessmentResult?.assignedLevel || 'B1';
  const estimatedMonths = assessmentResult?.estimatedMonthsToGoal || 3;

  const milestones = [
    {
      week: 'Semanas 1-2',
      title: 'Fluência de Conversação do Dia a Dia',
      desc: 'Dominar check-in de hotel, pedidos em restaurantes e direções nas ruas.',
      status: 'active',
    },
    {
      week: 'Semanas 3-6',
      title: 'Expressão de Opiniões & Passado/Futuro',
      desc: 'Contar experiências vividas e debater tópicos de interesse pessoal.',
      status: 'locked',
    },
    {
      week: 'Semanas 7-12',
      title: 'Comunicação Profissional B2 Completa',
      desc: 'Reuniões de negócios, negociações e vocabulário técnico avançado.',
      status: 'locked',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden font-sans text-white space-y-6">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Plano de Aprendizagem Criado com Sucesso</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          O Teu Roteiro Personalizado para Fluência
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Desenhado especialmente para {userName} com base no teu nível atual ({currentLevel}).
        </p>
      </div>

      {/* Key Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400">Nível Inicial</span>
          <div className="text-2xl font-black text-indigo-400">{currentLevel}</div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400">Meta Estimada</span>
          <div className="text-2xl font-black text-amber-400">B2 / C1</div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400">Tempo Estimado</span>
          <div className="text-2xl font-black text-emerald-400">{estimatedMonths} Meses</div>
        </div>
      </div>

      {/* Weekly Milestones */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <span>Fases do Teu Progresso Mensal</span>
        </h4>

        <div className="space-y-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                m.status === 'active'
                  ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div
                className={`p-2 rounded-xl text-xs font-bold ${
                  m.status === 'active'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Zap className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={m.status === 'active' ? 'text-indigo-300' : 'text-slate-400'}>
                    {m.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">{m.week}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onContinue}
        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition hover:scale-[1.01]"
      >
        <span>Aceitar Plano & Abrir Primeira Missão</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
