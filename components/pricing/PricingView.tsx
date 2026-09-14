import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, ShieldCheck, Zap, Users, ArrowRight } from 'lucide-react';

interface PricingViewProps {
  onSelectPlan?: (planId: string) => void;
  onStartFree?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onSelectPlan, onStartFree }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      badge: 'Iniciação',
      priceMonthly: '€0',
      priceAnnual: '€0',
      desc: 'Para experimentar a tecnologia do professor pessoal e diálogos básicos.',
      features: [
        'Acesso a sessões em texto com o AI Teacher',
        '15 minutos de prática diária',
        'Diagnóstico inicial de nível básico',
        'Suporte por comunidade',
      ],
      popular: false,
      cta: 'Começar Grátis',
      ctaClass: 'bg-slate-800 hover:bg-slate-700 text-white',
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: 'Mais Popular',
      priceMonthly: '€11,99',
      priceAnnual: '€9,59',
      period: '/mês',
      desc: 'Experiência completa com voz, Student Digital Twin e Learning Analytics.',
      features: [
        'Voz e áudio ao vivo sem limites de tempo',
        'Student Digital Twin com memória longitudinal',
        'Learning Analytics Engine com relatórios semanais',
        'Missões práticas do mundo real e cenários executivos',
        'Simulação de sotaques regionais',
      ],
      popular: true,
      cta: 'Subscrever Pro (€11,99)',
      ctaClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30',
    },
    {
      id: 'ultra',
      name: 'Ultra',
      badge: 'Máxima Performance',
      priceMonthly: '€24,99',
      priceAnnual: '€19,99',
      period: '/mês',
      desc: 'Para profissionais e executivos com necessidade de aceleração de fluência.',
      features: [
        'Tudo do plano Pro',
        'Modelos de IA de alta fidelidade e latência ultrabaixa',
        'Gerador de cenários de negócios personalizados',
        'Sintonização avançada de pronúncia e fonética',
        'Suporte prioritário 24/7',
      ],
      popular: false,
      cta: 'Subscrever Ultra (€24,99)',
      ctaClass: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl',
    },
    {
      id: 'family',
      name: 'Family',
      badge: 'Até 4 Pessoas',
      priceMonthly: '€34,99',
      priceAnnual: '€27,99',
      period: '/mês',
      desc: 'Partilhe a aprendizagem de idiomas com a sua família ou equipa de trabalho.',
      features: [
        'Até 4 contas de aluno individuais',
        'Student Digital Twin independente por perfil',
        'Painel unificado de progresso e analytics',
        'Todas as funcionalidades do plano Pro incluídas',
      ],
      popular: false,
      cta: 'Subscrever Family (€34,99)',
      ctaClass: 'bg-slate-800 hover:bg-slate-700 text-white',
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto font-sans text-slate-100 p-4 md:p-8">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-bold">
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          <span>Planos & Investimento em Fluência</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Escolha o plano ideal para a tua jornada de idiomas
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Sem contratos de fidelização. Cancele quando quiser. Garantia de evolução contínua.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
            Mensal
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 min-h-[44px] rounded-full bg-slate-800 p-1 transition flex items-center relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={`Alternar ciclo de faturação entre mensal e anual (atual: ${billingCycle})`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-indigo-500 transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
            Anual <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800 font-extrabold">Poupe 20%</span>
          </span>
        </div>
      </div>

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl p-6 border flex flex-col justify-between transition-all relative ${
              p.popular
                ? 'bg-gradient-to-b from-indigo-950/90 via-slate-900 to-slate-950 border-indigo-500 shadow-2xl scale-[1.02]'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                {p.badge}
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-white">{p.name}</h3>
                {!p.popular && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {p.badge}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">
                  {billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly}
                </span>
                {p.period && <span className="text-xs text-slate-400 font-semibold">{p.period}</span>}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-b border-slate-800 pb-4">
                {p.desc}
              </p>

              <div className="space-y-2.5 text-xs">
                {p.features.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  if (p.id === 'free') {
                    if (onStartFree) onStartFree();
                  } else {
                    if (onSelectPlan) onSelectPlan(p.id);
                  }
                }}
                className={`w-full min-h-[44px] py-3 px-4 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${p.ctaClass}`}
                aria-label={`Selecionar plano ${p.name}`}
              >
                <span>{p.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
