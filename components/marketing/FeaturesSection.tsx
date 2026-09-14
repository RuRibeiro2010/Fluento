import React from 'react';
import { LANDING_FEATURES } from '@/lib/marketing/landing-data';
import { Sparkles, Globe, Brain, MessageSquare, TrendingUp, Shield } from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Globe: Globe,
  Brain: Brain,
  MessageSquare: MessageSquare,
  TrendingUp: TrendingUp,
  Shield: Shield,
};

export function FeaturesSection() {
  return (
    <section className="py-20 bg-slate-950 text-slate-100 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Core Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Built for Real Polyglot Fluency</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every feature is engineered to optimize retention, eliminate cognitive friction, and make language learning deeply personal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LANDING_FEATURES.map((feature) => {
            const IconComponent = iconMap[feature.iconName] || Sparkles;
            return (
              <div
                key={feature.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-900/60">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {feature.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
