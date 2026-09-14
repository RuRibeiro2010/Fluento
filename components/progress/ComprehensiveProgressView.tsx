import React from 'react';
import { UserProfile } from '@/types/profile';
import {
  Mic,
  Headphones,
  BookOpen,
  CheckCircle2,
  Volume2,
  ShieldCheck,
  MessageSquare,
  Compass,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';

interface ComprehensiveProgressViewProps {
  userProfile?: UserProfile;
}

export const ComprehensiveProgressView: React.FC<ComprehensiveProgressViewProps> = ({ userProfile }) => {
  const competencies = [
    {
      id: 'speaking',
      title: 'Speaking (Fala Flutuante)',
      score: 74,
      level: 'B1.2 Intermédio',
      icon: Mic,
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/60 border-indigo-800/80',
      desc: 'Capacidade de encadear ideias sem pausas excessivas ou bloqueios.',
    },
    {
      id: 'listening',
      title: 'Listening (Compreensão Auditiva)',
      score: 82,
      level: 'B2.1 Avançado',
      icon: Headphones,
      color: 'text-sky-400',
      bg: 'bg-sky-950/60 border-sky-800/80',
      desc: 'Compreensão de sotaques variados em velocidade nativa normal.',
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary (Léxico Ativo)',
      score: 78,
      level: '380 Palavras Ativas',
      icon: BookOpen,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/60 border-emerald-800/80',
      desc: 'Vocabulário profissional e idiomatico pronto para evocação imediata.',
    },
    {
      id: 'grammar',
      title: 'Grammar (Concordância e Estrutura)',
      score: 70,
      level: 'B1.1 Sólido',
      icon: CheckCircle2,
      color: 'text-amber-400',
      bg: 'bg-amber-950/60 border-amber-800/80',
      desc: 'Uso correto de tempos verbais passados e modos condicionais.',
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation (Navegação Fonética)',
      score: 88,
      level: '88% Clareza Nativa',
      icon: Volume2,
      color: 'text-violet-400',
      bg: 'bg-violet-950/60 border-violet-800/80',
      desc: 'Articulação clara de fonemas e entoação natural.',
    },
    {
      id: 'confidence',
      title: 'Confidence (Ausência de Ansiedade)',
      score: 76,
      level: 'Redução de Filtro Afetivo',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/60 border-emerald-800/80',
      desc: 'Fluidez emocional sem travamento ao cometer pequenos erros.',
    },
    {
      id: 'communication',
      title: 'Communication (Eficácia e Pragmatismo)',
      score: 80,
      level: 'Comunicação Diplomática',
      icon: MessageSquare,
      color: 'text-rose-400',
      bg: 'bg-rose-950/60 border-rose-800/80',
      desc: 'Habilidade de transmitir a mensagem com tato e clareza contextual.',
    },
    {
      id: 'readiness',
      title: 'Readiness (Prontidão para o Mundo Real)',
      score: 85,
      level: 'Pronto para Reuniões',
      icon: Compass,
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/60 border-indigo-800/80',
      desc: 'Capacidade de interagir em reuniões de negócios sem preparação prévia.',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-100 p-4 md:p-8">
      {/* Title */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Evolução Real de Competências Linguísticas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Progresso Pedagógico</h1>
        <p className="text-xs text-slate-300 mt-1">
          O Fluento mede o teu avanço real através de 8 dimensões de competência sem depender de métricas superficiais.
        </p>
      </div>

      {/* Primary Evolution Score Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/80 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">Índice Global de Fluência Ativa</span>
            <h2 className="text-3xl font-black text-white mt-1">Nível B1 Intermédio Avançado</h2>
            <p className="text-xs text-slate-300 mt-1">Progresso estimado para atingir C1: <strong className="text-emerald-400">76%</strong></p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-center">
            <span className="text-2xl font-black text-white block">78/100</span>
            <span className="text-[10px] text-indigo-300 font-bold uppercase">Média de Competências</span>
          </div>
        </div>
      </div>

      {/* 8 Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {competencies.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border ${c.bg} space-y-4 flex flex-col justify-between transition hover:scale-[1.01]`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${c.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-black text-white">{c.score}%</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-white">{c.title}</h3>
                  <span className="text-[11px] font-semibold text-indigo-300 block mt-0.5">{c.level}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${c.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
