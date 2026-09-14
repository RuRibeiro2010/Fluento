import React, { useState } from 'react';
import { WeeklyStudyPlan, DaySchedule } from '@/types/coach';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  Award,
  ChevronRight,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface WeeklyPlanCardProps {
  plan: WeeklyStudyPlan;
  onSelectDay?: (day: DaySchedule) => void;
  onRefreshPlan?: () => void;
  className?: string;
}

export function WeeklyPlanCard({
  plan,
  onSelectDay,
  onRefreshPlan,
  className = '',
}: WeeklyPlanCardProps) {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  const currentSelectedDay =
    plan.dailySchedules.find((d) => d.dayNumber === selectedDayNumber) ||
    plan.dailySchedules[0];

  const getFocusBadgeColor = (focus: DaySchedule['focusArea']) => {
    switch (focus) {
      case 'grammar':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'vocabulary':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'speaking':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'listening':
        return 'bg-sky-950 text-sky-300 border-sky-800';
      case 'mission':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'review':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      default:
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
    }
  };

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-extrabold text-white">{plan.title}</h3>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" /> Goal:{' '}
            <span className="text-slate-200 font-semibold">{plan.overallGoal}</span>
          </p>
        </div>

        {onRefreshPlan && (
          <button
            onClick={onRefreshPlan}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Adapt Plan
          </button>
        )}
      </div>

      {/* Adaptation Triggers Pill Bar */}
      {plan.adaptedBasedOn && plan.adaptedBasedOn.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" /> AI Adaptive Strategy Drivers:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {plan.adaptedBasedOn.map((trigger, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-medium text-indigo-300"
              >
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Quick Selector Tabs */}
      <div className="grid grid-cols-7 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80">
        {plan.dailySchedules.map((day) => {
          const isActive = day.dayNumber === selectedDayNumber;
          return (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`p-2 rounded-lg text-center transition flex flex-col items-center justify-between ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                {day.dayName.substring(0, 3)}
              </span>

              <div className="my-1">
                {day.isCompleted ? (
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-400'}`}
                  />
                ) : (
                  <span
                    className={`w-2 h-2 rounded-full block ${
                      day.focusArea === 'mission'
                        ? 'bg-amber-400 animate-pulse'
                        : isActive
                        ? 'bg-white'
                        : 'bg-indigo-400'
                    }`}
                  />
                )}
              </div>

              <span className="text-[9px] capitalize font-medium truncate max-w-full">
                {day.focusArea.substring(0, 4)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Details Card */}
      {currentSelectedDay && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
          {currentSelectedDay.focusArea === 'mission' && (
            <div className="absolute top-0 right-0 bg-amber-500/10 border-b border-l border-amber-500/30 text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" /> Real-World Mission
            </div>
          )}

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getFocusBadgeColor(
                currentSelectedDay.focusArea
              )}`}
            >
              {currentSelectedDay.focusArea}
            </span>

            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" /> {currentSelectedDay.estimatedMinutes} mins
            </span>

            <span className="text-xs text-indigo-300 font-bold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
              {currentSelectedDay.difficultyLevel}
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              Day {currentSelectedDay.dayNumber}: {currentSelectedDay.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {currentSelectedDay.description}
            </p>
          </div>

          {currentSelectedDay.missionTask && (
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200 space-y-1">
              <span className="font-bold flex items-center gap-1 text-amber-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Mission Task:
              </span>
              <p className="text-slate-200">{currentSelectedDay.missionTask}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-400">
              Format: <span className="text-slate-200 font-medium">{currentSelectedDay.lessonType}</span>
            </span>

            {onSelectDay && (
              <button
                onClick={() => onSelectDay(currentSelectedDay)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <span>Launch Day {currentSelectedDay.dayNumber} Session</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
