import React from 'react';
import { COMPARISON_TABLE } from '@/lib/marketing/landing-data';
import { Check, X, Sparkles } from 'lucide-react';

export function ComparisonSection() {
  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Why Choose Fluento</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">The Next Generation of Language Coaching</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            See how Fluento combines the affordability and availability of an app with the deep customization of a private human coach.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950">
                <th className="p-4 font-bold text-slate-400 w-1/3">Feature</th>
                <th className="p-4 font-bold text-indigo-400 bg-indigo-950/40 border-x border-indigo-900/40 w-1/4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Fluento AI Coach
                  </div>
                </th>
                <th className="p-4 font-bold text-slate-400 w-1/4">Traditional Apps</th>
                <th className="p-4 font-bold text-slate-400 w-1/4">Private Tutors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {COMPARISON_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition">
                  <td className="p-4 font-semibold text-slate-200">{row.feature}</td>
                  <td className="p-4 font-bold text-emerald-400 bg-indigo-950/20 border-x border-indigo-900/30">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{row.fluento}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <X className="w-4 h-4 text-slate-500" />
                      <span>{row.traditionalApps}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{row.privateTutors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
