import React from 'react';
import { Briefcase, Compass, Plane, Coffee, Award, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';

export interface MissionCard {
  id: string;
  title: string;
  category: string;
  audience: string;
  level: string;
  description: string;
  icon: 'Briefcase' | 'Compass' | 'Plane' | 'Coffee' | 'Award';
  outcomes: string[];
}

export const REAL_WORLD_MISSIONS: MissionCard[] = [
  {
    id: 'm-1',
    title: 'Executive Salary & Job Offer Negotiation',
    category: 'Business & Career',
    audience: 'Professionals & Adults',
    level: 'B2 - C1',
    description: 'Simulate high-stakes salary negotiations in English or German with an AI C-Level counterpart.',
    icon: 'Briefcase',
    outcomes: ['Assertive vocabulary', 'Diplomatic counter-offers', 'Corporate etiquette'],
  },
  {
    id: 'm-2',
    title: 'University Interview & Academic Defence',
    category: 'Academic & Higher Ed',
    audience: 'University Students',
    level: 'B2',
    description: 'Practice defending your research thesis or answering admissions board questions in French or Spanish.',
    icon: 'Award',
    outcomes: ['Academic syntax', 'Formal arguments', 'Spontaneous question response'],
  },
  {
    id: 'm-3',
    title: 'Airport Customs & Emergency Travel',
    category: 'Global Travel',
    audience: 'Teens & Adults',
    level: 'A2 - B1',
    description: 'Navigate passport control, delayed flights, and lost baggage with native airport official personas.',
    icon: 'Plane',
    outcomes: ['Rapid listening comprehension', 'Travel terminology', 'Stress-free composure'],
  },
  {
    id: 'm-4',
    title: 'Social Café Conversation & Local Culture',
    category: 'Daily Integration',
    audience: 'All Learners',
    level: 'A1 - A2',
    description: 'Order regional dishes, chat with local baristas, and handle dietary requests effortlessly.',
    icon: 'Coffee',
    outcomes: ['Ordering idioms', 'Polite native phrasing', 'Cultural nuances'],
  },
];

const iconComponentMap = {
  Briefcase: Briefcase,
  Compass: Compass,
  Plane: Plane,
  Coffee: Coffee,
  Award: Award,
};

export function RealWorldMissionsSection() {
  return (
    <section className="py-20 bg-slate-950 text-slate-100 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Real-World Missions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Learn Language for Real Life, Not Toy Games
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Designed for teens, university students, working professionals, and adult polyglots. Put your fluency to work in authentic scenarios that mirror career and travel demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REAL_WORLD_MISSIONS.map((mission) => {
            const IconComp = iconComponentMap[mission.icon];
            return (
              <div
                key={mission.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition-all space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-900/60 group-hover:scale-105 transition-transform">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                          {mission.category}
                        </span>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition">
                          {mission.title}
                        </h3>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {mission.level}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {mission.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Competencies:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {mission.outcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Audience: {mission.audience}</span>
                  <span className="flex items-center gap-1">
                    Preview Mission <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
