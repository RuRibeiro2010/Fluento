import React from 'react';
import { PRICING_PLANS } from '@/lib/marketing/landing-data';
import { Check, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onStartFree: () => void;
}

export function PricingSection({ onStartFree }: PricingSectionProps) {
  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Transparent Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Invest in Your Language Mastery</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Start completely free. Upgrade anytime for unlimited AI coaching sessions and multi-personality access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-2xl border flex flex-col justify-between space-y-8 relative transition-all ${
                plan.popular
                  ? 'bg-slate-950 border-indigo-500 shadow-xl shadow-indigo-600/10 ring-2 ring-indigo-500/20'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400">/ {plan.period}</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="p-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onStartFree}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition shadow-md ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
