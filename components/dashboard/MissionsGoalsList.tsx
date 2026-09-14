import React from 'react';
import { Target, Flag, CheckCircle2, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';

export interface MissionItem {
  id: string;
  title: string;
  category: string;
  progressPercent: number;
  isCompleted: boolean;
  rewardXp: number;
}

interface MissionsGoalsListProps {
  primaryGoal?: string;
  missions?: MissionItem[];
  onStartMission?: (missionId: string) => void;
}

export function MissionsGoalsList({
  primaryGoal = 'Proficiência Profissional & Viagens de Negócios',
  missions = [
    {
      id: 'm-1',
      title: 'Negociação de Proposta de Trabalho',
      category: 'Negócios',
      progressPercent: 65,
      isCompleted: false,
      rewardXp: 150,
    },
    {
      id: 'm-2',
      title: 'Apresentação de Projeto em Reunião',
      category: 'Carreira',
      progressPercent: 100,
      isCompleted: true,
      rewardXp: 200,
    },
    {
      id: 'm-3',
      title: 'Check-in e Imigração no Aeroporto',
      category: 'Viagens',
      progressPercent: 40,
      isCompleted: false,
      rewardXp: 120,
    },
  ],
  onStartMission,
}: MissionsGoalsListProps) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Objetivos & Missões do Mundo Real</h3>
            <p className="text-xs text-slate-400">Objetivo Principal: <span className="text-slate-200 font-semibold">{primaryGoal}</span></p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 fill-amber-400" /> +470 XP Acumulados
        </span>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/50 transition flex items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800">
                  {mission.category}
                </span>
                <h4 className="font-bold text-sm text-white">{mission.title}</h4>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
                    style={{ width: `${mission.progressPercent}%` }}
                  />
                </div>
                <span>{mission.progressPercent}% Concluído</span>
              </div>
            </div>

            <button
              onClick={() => onStartMission && onStartMission(mission.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                mission.isCompleted
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
              }`}
            >
              {mission.isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Concluída (+{mission.rewardXp} XP)
                </>
              ) : (
                <>
                  Iniciar Missão <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
