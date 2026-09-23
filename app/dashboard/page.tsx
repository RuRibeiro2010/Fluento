'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types/profile';
import {
  DashboardHeader,
  MetricsOverviewGrid,
  DailyFocusCard,
  WeeklyCalendarCard,
  MissionsGoalsList,
  StatsHistoryView,
} from '@/components/dashboard';
import { DailyCoachBanner } from '@/components/coach/DailyCoachBanner';
import { SundayWeeklyReviewModal } from '@/components/coach/SundayWeeklyReviewModal';
import { MonthlyTimelineView } from '@/components/progress/MonthlyTimelineView';
import { LessonCard } from '@/components/lesson/LessonCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { Sparkles, Plus, TrendingUp } from 'lucide-react';
import { dashboardAdapter, studentProfileAdapter, DashboardViewModelDTO } from '@/src/application/adapters';
import { SynchronizedStudentState } from '@/src/application/services/student-profile-sync.service';
import { DetailedLessonDTO } from '@/src/application/dto/lesson.dtos';
import { MonthlyEvolutionDataDTO } from '@/src/application/dto/coach.dtos';

interface DashboardPageProps {
  userProfile?: UserProfile;
  onSelectLesson?: (lessonId: string) => void;
  onNavigateView?: (view: string) => void;
}

export default function DashboardPage({
  userProfile,
  onSelectLesson,
}: DashboardPageProps) {
  const [profile, setProfile] = useState<Partial<UserProfile>>(
    userProfile || {
      id: 'demo-user',
      email: 'user@fluento.ai',
      native_language: 'pt',
      target_languages: ['es'],
    }
  );

  const [dashboardData, setDashboardData] = useState<DashboardViewModelDTO | null>(null);
  const [evolutionData, setEvolutionData] = useState<MonthlyEvolutionDataDTO | null>(null);
  const [lessons, setLessons] = useState<DetailedLessonDTO[]>([]);
  const [showWeeklyReviewModal, setShowWeeklyReviewModal] = useState(false);
  const [currentSubView, setCurrentSubView] = useState<'dashboard' | 'timeline'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const studentId = userProfile?.id || profile.id || 'usr_fluento_primary';

    // Subscribe to student profile updates across application layer
    const unsubscribe = studentProfileAdapter.subscribe((state: SynchronizedStudentState) => {
      if (isMounted) {
        studentProfileAdapter.getLegacyUserProfile(state.profile.id).then((legacy) => {
          if (isMounted) setProfile(legacy);
        });
      }
    });

    async function loadDashboardData() {
      setLoading(true);

      try {
        // 1. Fetch complete dashboard view model from Application Layer Adapter (UI -> Adapter -> Use Cases -> AI/Domain -> DTO -> UI)
        // This single call now resolves profile, metrics, coach message, and weekly review summary.
        const appVm = await dashboardAdapter.getDashboardViewModel(studentId);
        
        // Fetch evolution data for the timeline sub-view
        const timelineData = await dashboardAdapter.getMonthlyEvolutionData(studentId);
        
        if (isMounted) {
          setDashboardData(appVm);
          setEvolutionData(timelineData);
          
          // Sync local legacy profile state for backwards compatibility
          const legacy = await studentProfileAdapter.getLegacyUserProfile(studentId);
          setProfile(legacy);

          // 2. Load initial adaptive lessons via Application Layer
          const initialLesson = await dashboardAdapter.generateNewLesson(studentId);
          setLessons([initialLesson]);
          
          setLoading(false);
        }
      } catch (err) {
        console.warn('[DashboardPage] Application layer query failed:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [userProfile?.id]);

  if (loading) {
    return <LoadingState message="A carregar o seu AI Coach pessoal do Fluento..." fullScreen />;
  }

  // Render Monthly Evolution Timeline Sub-view if active
  if (currentSubView === 'timeline' && evolutionData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
        <MonthlyTimelineView
          evolutionData={evolutionData}
          onBackToDashboard={() => setCurrentSubView('dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Sunday Weekly Review Modal */}
      {showWeeklyReviewModal && dashboardData?.weeklyReview && (
        <SundayWeeklyReviewModal
          review={{
            id: dashboardData.weeklyReview.weekId,
            weekNumber: 4,
            dateRange: 'Resumo da Semana',
            achievements: [
              `Accuracy: ${dashboardData.weeklyReview.overallAccuracy}%`,
              `Time: ${dashboardData.weeklyReview.totalMinutes}m`,
              `Words: ${dashboardData.weeklyReview.wordsLearned}`,
            ],
            weaknessesIdentified: [dashboardData.weeklyReview.topWeakness],
            completedGoals: [`${dashboardData.weeklyReview.sessionsCount} sessões`],
            nextWeekPlan: [dashboardData.weeklyReview.recommendation],
            coachPersonalNote: dashboardData.weeklyReview.coachFeedback,
            isViewed: false,
          }}
          onClose={() => setShowWeeklyReviewModal(false)}
        />
      )}

      {/* Top Header */}
      <DashboardHeader
        profile={{
          ...profile,
          current_focus: dashboardData?.student.currentFocus || profile.current_focus,
          confidence_score: dashboardData?.metrics.confidenceScore || profile.confidence_score,
        }}
        streakCount={dashboardData?.metrics.streakDays || 5}
      />

      {/* Application Layer Status Badge (Sprint 16A.2 Architecture Separation) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">
            Camada de Aplicação:
          </span>
          <span className="text-emerald-400 font-semibold">
            {dashboardData?.source === 'application_layer' ? 'Application Query Handlers & DTO Adapter' : 'Fallback State'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>Nível: <strong className="text-slate-200">{dashboardData?.student.currentLevel || 'B1'}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Sessões mensais: <strong className="text-slate-200">{dashboardData?.subscription.sessionsUsedThisMonth ?? 0}/{dashboardData?.subscription.monthlyLimit ?? 5}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Vocabulário SRS: <strong className="text-indigo-300">{dashboardData?.dueVocabularyCount ?? 0} palavras</strong></span>
        </div>
      </div>

      {/* Daily Coach Banner with Long-Term Memory & Actions */}
      {dashboardData?.coachMessage && (
        <DailyCoachBanner
          message={{
            greeting: dashboardData.coachMessage.teacherName,
            advice: dashboardData.coachMessage.text,
            focusSkill: dashboardData.student.currentFocus,
            recommendedAction: dashboardData.coachMessage.actionLabel,
            motivationQuote: 'Consistency beats intensity every single time.',
            tone: dashboardData.coachMessage.teacherPersona,
          }}
          onStartLesson={() => onSelectLesson && onSelectLesson(lessons[0]?.id || 'lesson-1')}
          onOpenWeeklyReview={() => setShowWeeklyReviewModal(true)}
          onOpenTimeline={() => setCurrentSubView('timeline')}
        />
      )}

      {/* Metrics Overview Bar */}
      <MetricsOverviewGrid
        streakDays={dashboardData?.metrics.streakDays || 5}
        confidenceScore={dashboardData?.metrics.confidenceScore || 76}
        fluencyLevel={dashboardData?.metrics.fluencyLevel || "B1 Intermédio"}
        pronunciationMastery={dashboardData?.metrics.pronunciationMastery || 88}
        activeVocabularyCount={dashboardData?.metrics.activeVocabularyCount || 340}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hoje & Próxima Aula */}
          <DailyFocusCard
            nextLesson={lessons[0] as any}
            onStartLesson={(id) => onSelectLesson && onSelectLesson(id)}
            onOpenVirtualTeacher={() => onSelectLesson && onSelectLesson('virtual-teacher')}
          />

          {/* Plano Semanal & Calendário */}
          <WeeklyCalendarCard
            weeklyGoalMinutes={dashboardData?.weeklyCalendar.weeklyGoalMinutes || 105}
            completedMinutes={dashboardData?.weeklyCalendar.completedMinutes || 75}
          />

          {/* Continue Learning - Lesson Library */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Continue a Aprender</h3>
                <p className="text-xs text-slate-400">
                  Aulas adaptadas às suas metas em {profile.target_languages?.[0]?.toUpperCase() || 'ES'}
                </p>
              </div>
              <button
                onClick={async () => {
                  const studentId = dashboardData?.student.id || 'usr_fluento_primary';
                  const newLesson = await dashboardAdapter.generateNewLesson(studentId);
                  setLessons((prev) => [newLesson, ...prev]);
                }}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Gerar nova aula adaptativa com Inteligência Artificial"
              >
                <Plus className="w-3.5 h-3.5" /> Gerar Nova Aula AI
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson as any}
                  onStart={(id) => onSelectLesson && onSelectLesson(id)}
                />
              ))}
            </div>
          </div>

          {/* Objetivos & Missões do Mundo Real */}
          <MissionsGoalsList
            primaryGoal={dashboardData?.student.currentFocus || 'Fluência em Negócios e Viagens'}
            onStartMission={(mId) => onSelectLesson && onSelectLesson(mId)}
          />

          {/* Estatísticas & Histórico de Leções */}
          <StatsHistoryView />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Timeline Navigation Button */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-800/80 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Histórico de Meses
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-900 text-indigo-300">
                A1 → B1
              </span>
            </div>
            <h4 className="font-extrabold text-white text-base">Timeline de Evolução Mensal</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consulte a tua evolução desde a primeira aula, vocabulário acumulado e marcos alcançados.
            </p>
            <button
              onClick={() => setCurrentSubView('timeline')}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Ver timeline completa de evolução do aluno"
            >
              <span>Ver Timeline Completa</span>
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          {/* Longitudinal Memory Focus */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Memória Longitudinal do Professor
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lembrando: Na semana passada tiveste dúvidas em <strong className="text-indigo-300">"Past Subjunctive"</strong> e <strong className="text-indigo-300">"por vs para"</strong>.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-200 block">Deteção Emocional & Adaptação:</span>
              <p className="text-emerald-400 font-medium">Estado: Confiante ({dashboardData?.metrics.confidenceScore}% motivação). O ritmo foi acelerado para novos desafios práticos.</p>
            </div>
          </div>

          {/* Current Study Plan Summary */}
          {dashboardData?.activePlan && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    Plano de Estudo Ativo
                  </span>
                  <h4 className="font-bold text-white text-sm">{dashboardData.activePlan.primaryObjective}</h4>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                   Meta Ativa
                </span>
              </div>

              <div className="space-y-2">
                {dashboardData.activePlan.missions.slice(0, 3).map((mod) => (
                  <div key={mod.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-300 font-medium truncate max-w-[160px]">{mod.title}</span>
                    <span className="text-indigo-400 font-bold">{mod.completed ? 'Ok' : 'Pendente'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
