import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types/profile';
import { StudyPlan } from '@/types/study-plan';
import { Lesson } from '@/types/lesson';
import { SundayWeeklyReview } from '@/types/coach';
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
import { CoachCard } from '@/components/coach/CoachCard';
import { LessonCard } from '@/components/lesson/LessonCard';
import {
  generateStudyPlan,
  generateDailyCoachMessage,
  generateSundayWeeklyReview,
  createInitialLongitudinalMemory,
} from '@/lib/ai/coach';
import { generateLesson } from '@/lib/ai/lesson-generator';
import { LoadingState } from '@/components/ui/LoadingState';
import { BookOpen, Sparkles, Plus, Layers, Flame, Target, Calendar, TrendingUp } from 'lucide-react';
import { dashboardAdapter, studentProfileAdapter, DashboardViewModelDTO } from '@/src/application/adapters';
import { StudentProfileData } from '@/src/domain/student/entities/student-profile.entity';

interface DashboardPageProps {
  userProfile?: UserProfile;
  onSelectLesson?: (lessonId: string) => void;
  onNavigateView?: (view: string) => void;
}

export default function DashboardPage({
  userProfile,
  onSelectLesson,
  onNavigateView,
}: DashboardPageProps) {
  const [profile, setProfile] = useState<Partial<UserProfile>>(
    userProfile || {
      id: 'demo-user',
      email: 'user@fluento.ai',
      native_language: 'pt',
      target_languages: ['es'],
      coach_personality: 'encouraging',
      minutes_per_day: 15,
      confidence_score: 76,
      current_focus: 'Apresentação Executiva & Negociação de Ideias',
      profession: 'Diretor de Operações',
      hobbies: ['Tecnologia', 'Viagens', 'Café'],
      motivation: 'Liderar reuniões internacionais e negociações com total fluência',
    }
  );

  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardViewModelDTO | null>(null);
  const [coachBannerMessage, setCoachBannerMessage] = useState<any>(null);
  const [weeklyReview, setWeeklyReview] = useState<SundayWeeklyReview | null>(null);
  const [showWeeklyReviewModal, setShowWeeklyReviewModal] = useState(false);
  const [currentSubView, setCurrentSubView] = useState<'dashboard' | 'timeline'>('dashboard');
  const [loading, setLoading] = useState(true);

  const memory = createInitialLongitudinalMemory(profile.id || 'usr_demo', 'es', profile);

  useEffect(() => {
    let isMounted = true;
    const studentId = userProfile?.id || profile.id || 'usr_fluento_primary';

    // Subscribe to student profile updates across application layer
    const unsubscribe = studentProfileAdapter.subscribe((updatedData: StudentProfileData) => {
      if (isMounted) {
        studentProfileAdapter.getLegacyUserProfile(updatedData.id).then((legacy) => {
          if (isMounted) setProfile(legacy);
        });
      }
    });

    async function loadDashboardData() {
      setLoading(true);

      // 1. Fetch canonical profile from Application Layer (UI -> Application Adapter -> Profile Sync Service -> Storage)
      let canonicalProfile: StudentProfileData | undefined;
      try {
        canonicalProfile = await studentProfileAdapter.getCanonicalProfile(studentId);
        if (canonicalProfile && isMounted) {
          const legacyProfile = await studentProfileAdapter.getLegacyUserProfile(studentId);
          setProfile(legacyProfile);
        }
      } catch (profileErr) {
        console.warn('[DashboardPage] Could not load canonical profile, falling back to local state:', profileErr);
      }

      // 2. Query Application Layer via DashboardAdapter (UI -> Adapter -> Query Handlers -> Domain -> DTO -> UI)
      try {
        const appVm = await dashboardAdapter.getDashboardViewModel(studentId, canonicalProfile || profile);
        if (isMounted) setDashboardData(appVm);
      } catch (err) {
        console.warn('[DashboardPage] Application layer query failed, continuing with legacy fallback:', err);
      }

      const activeProfile = canonicalProfile
        ? await studentProfileAdapter.getLegacyUserProfile(studentId)
        : profile;

      const targetLang = activeProfile.target_languages?.[0] || 'es';
      const nativeLang = activeProfile.native_language || 'pt';

      const plan = await generateStudyPlan(activeProfile, targetLang, nativeLang);
      const coachMsg = await generateDailyCoachMessage(activeProfile, undefined, memory);
      const review = generateSundayWeeklyReview(activeProfile, memory);

      const sampleLessons = await Promise.all([
        generateLesson(
          targetLang,
          nativeLang,
          'Apresentação Executiva & Negociação de Ideias',
          'B1',
          activeProfile,
          memory
        ),
        generateLesson(
          targetLang,
          nativeLang,
          'Check-in e Imigração no Aeroporto',
          'A2',
          activeProfile,
          memory
        ),
        generateLesson(
          targetLang,
          nativeLang,
          'Discussão de Projetos e Prazos',
          'B2',
          activeProfile,
          memory
        ),
      ]);

      if (isMounted) {
        setStudyPlan(plan);
        setCoachBannerMessage(coachMsg);
        setWeeklyReview(review);
        setLessons(sampleLessons);
        setLoading(false);
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
  if (currentSubView === 'timeline') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
        <MonthlyTimelineView
          userProfile={profile}
          memory={memory}
          onBackToDashboard={() => setCurrentSubView('dashboard')}
        />
      </div>
    );
  }

  const firstLesson = lessons[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Sunday Weekly Review Modal */}
      {showWeeklyReviewModal && weeklyReview && (
        <SundayWeeklyReviewModal
          review={weeklyReview}
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
      {coachBannerMessage && (
        <DailyCoachBanner
          message={coachBannerMessage}
          onStartLesson={() => onSelectLesson && onSelectLesson(firstLesson?.id || 'lesson-1')}
          onOpenWeeklyReview={() => setShowWeeklyReviewModal(true)}
          onOpenTimeline={() => setCurrentSubView('timeline')}
        />
      )}

      {/* Metrics Overview Bar */}
      <MetricsOverviewGrid
        streakDays={dashboardData?.metrics.streakDays || 5}
        confidenceScore={dashboardData?.metrics.confidenceScore || profile.confidence_score || 76}
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
            nextLesson={firstLesson}
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
                  const newLesson = await generateLesson(
                    profile.target_languages?.[0] || 'es',
                    profile.native_language || 'pt',
                    'Nova Leção Adaptativa do Professor',
                    'B1',
                    profile,
                    memory
                  );
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
                  lesson={lesson}
                  onStart={(id) => onSelectLesson && onSelectLesson(id)}
                />
              ))}
            </div>
          </div>

          {/* Objetivos & Missões do Mundo Real */}
          <MissionsGoalsList
            primaryGoal={profile.current_focus || 'Fluência em Negócios e Viagens'}
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
              <p className="text-emerald-400 font-medium">Estado: Confiante (88% motivação). O ritmo foi acelerado para novos desafios práticos.</p>
            </div>
          </div>

          {/* Current Study Plan Summary */}
          {studyPlan && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    Plano de Estudo Ativo
                  </span>
                  <h4 className="font-bold text-white text-sm">{studyPlan.title}</h4>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {studyPlan.estimatedWeeks} Semanas
                </span>
              </div>

              <div className="space-y-2">
                {studyPlan.modules.slice(0, 3).map((mod) => (
                  <div key={mod.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-300 font-medium truncate max-w-[160px]">{mod.title}</span>
                    <span className="text-indigo-400 font-bold">{mod.completedCount}/{mod.totalLessons}</span>
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
