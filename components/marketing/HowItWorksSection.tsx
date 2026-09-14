import React from 'react';
import { HOW_IT_WORKS_STEPS } from '@/lib/marketing/landing-data';
import { CheckCircle2 } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Simple 3-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How Fluento Coaching Works</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From smart onboarding to daily AI conversational practice, fluency is broken down into structured, achievable milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.step}
              className="relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-indigo-500/40 group-hover:text-indigo-400 transition">
                  {step.step}
                </span>
                <CheckCircle2 className="w-5 h-5 text-indigo-400 opacity-60" />
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
