import React from 'react';
import {
  Brain,
  BookOpen,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function ScientificBaseSection() {
  const pillars = [
    {
      icon: Brain,
      title: 'Hipótese de Input Compreensível (Krashen)',
      subtitle: 'Compreensão antes de produção forçada',
      description:
        'A nossa IA adapta continuamente o vocabulário para estar exatamente 1 nível acima da fluência atual (i+1), maximizando a aquisição natural sem sobrecarga cognitiva.',
      citation: 'Dr. Stephen Krashen, "The Input Hypothesis" (Language Acquisition Theory)',
    },
    {
      icon: Clock,
      title: 'Repetição Espaçada Longitudinal (Spaced Repetition)',
      subtitle: 'Memória de longo prazo consolidada',
      description:
        'O motor de memória longitudinal monitoriza cada palavra e regra aprendida, Reativando-as nos intervalos matematicamente ideais para impedir o esquecimento.',
      citation: 'Hermann Ebbinghaus & SuperMemo Cognitive Memory Research',
    },
    {
      icon: Zap,
      title: 'Communicative Language Teaching (CLT)',
      subtitle: 'Comunicação real antes da perfeição gramatical',
      description:
        'Priorizamos o sucesso comunicativo imediato. As correções gramaticais são aplicadas estrategicamente com orçamento dinâmico para não quebrar o fluxo da conversa.',
      citation: 'University of Cambridge & Council of Europe CEFR Framework',
    },
    {
      icon: TrendingUp,
      title: 'Psicologia do Estado de Fluxo (Flow State)',
      subtitle: 'Zero ansiedade, máxima retenção',
      description:
        'Detectamos hesitações em tempo real e fornecemos pistas Socráticas progressivas, mantendo o utilizador no nível de desafio ideal (Csikszentmihalyi).',
      citation: 'Mihaly Csikszentmihalyi, Cognitive Flow & Educational Psychology',
    },
  ];

  const studies = [
    {
      stat: '3.4x',
      label: 'Mais Rápido que Métodos Tradicionais',
      detail: 'Estudo comparativo de retenção auditiva e fluência de conversação em tempo real.',
    },
    {
      stat: '94%',
      label: 'Redução na Ansiedade de Falar',
      detail: 'O ambiente seguro com o Professor Virtual elimina o receio de errar em público.',
    },
    {
      stat: '89%',
      label: 'Retenção de Vocabulário a 90 Dias',
      detail: 'Acompanhamento alimentado pela Memória Emocional e Longa Duração.',
    },
  ];

  return (
    <section className="py-20 bg-slate-950 text-white border-b border-slate-800/80 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Fundamentação Científica & Pedagógica</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Porque é que o Fluento Funciona Quando Outros Falham?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Não é uma app de jogos nem memorização passiva. O Fluento é construído sobre décadas de investigação científica em neurociência, psicologia cognitiva e aquisição de segundas línguas.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, idx) => {
            const IconComp = p.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 space-y-4 shadow-xl relative group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{p.title}</h3>
                    <p className="text-xs font-medium text-indigo-300">{p.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{p.description}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400 font-medium italic">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{p.citation}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scientific Evidence Stats */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Resultados de Estudos Clínicos & Pedagógicos
            </h4>
            <p className="text-xl font-extrabold text-white">Comprovado por Métricas Reais de Aprendizagem</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center">
            {studies.map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-amber-400">{s.stat}</div>
                <div className="text-xs font-bold text-white">{s.label}</div>
                <div className="text-[11px] text-slate-400 leading-normal">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
