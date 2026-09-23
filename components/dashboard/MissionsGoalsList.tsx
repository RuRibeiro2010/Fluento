import React from 'react';
import { Target, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { Card, Button, Badge, Heading3, CaptionText } from '@/src/components/design-system';

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
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950/50 text-indigo-400 border border-indigo-900/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <Heading3 className="text-base font-bold">Objetivos & Missões do Mundo Real</Heading3>
            <CaptionText className="text-slate-400">
              Objetivo Principal: <span className="text-slate-200 font-semibold">{primaryGoal}</span>
            </CaptionText>
          </div>
        </div>

        <Badge variant="warning" className="px-3 py-1 gap-1.5 shadow-amber-900/10">
          <Sparkles className="w-3.5 h-3.5 fill-amber-400" /> +470 XP
        </Badge>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => (
          <Card
            key={mission.id}
            variant="outlined"
            className="p-4 flex items-center justify-between gap-4 border-slate-800/60 bg-slate-950/40 hover:bg-slate-950/60 transition-colors"
          >
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="primary" size="sm" className="uppercase font-black">
                  {mission.category}
                </Badge>
                <h4 className="font-bold text-sm text-white truncate">{mission.title}</h4>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="w-24 sm:w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden shadow-inner">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${mission.progressPercent}%` }}
                  />
                </div>
                <CaptionText className="text-[10px] font-bold text-slate-500">
                  {mission.progressPercent}%
                </CaptionText>
              </div>
            </div>

            <Button
              onClick={() => onStartMission && onStartMission(mission.id)}
              variant={mission.isCompleted ? 'secondary' : 'primary'}
              size="sm"
              className={mission.isCompleted ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400' : ''}
              icon={mission.isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            >
              {mission.isCompleted ? `+${mission.rewardXp} XP` : 'Iniciar'}
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  );
}

