import React, { useState, useEffect, Suspense } from 'react';

import { SharedHeader } from '@/components/shared/SharedHeader';
import { SharedFooter } from '@/components/shared/SharedFooter';
import { AuthModal, AuthSessionData } from '@/components/auth/AuthModal';
import { UserProfile } from '@/types/profile';
import { studentProfileAdapter } from '@/src/application/adapters';

// Lazy-loaded routes for optimal bundle code-splitting and low-end mobile performance
const MarketingPage = React.lazy(() => import('@/app/(marketing)/page'));
const PlacementPage = React.lazy(() => import('@/app/placement/page'));
const DashboardPage = React.lazy(() => import('@/app/dashboard/page'));
const ProgressPage = React.lazy(() => import('@/app/progress/page'));
const AnalyticsPage = React.lazy(() => import('@/app/analytics/page'));
const ProfilePage = React.lazy(() => import('@/app/profile/page'));
const SettingsPage = React.lazy(() => import('@/app/settings/page'));
const PricingPage = React.lazy(() => import('@/app/pricing/page'));
const ConversationalOnboarding = React.lazy(() =>
  import('@/components/onboarding/ConversationalOnboarding').then((m) => ({
    default: m.ConversationalOnboarding,
  }))
);
const VirtualTeacherLessonRoom = React.lazy(() =>
  import('@/components/lesson/VirtualTeacherLessonRoom').then((m) => ({
    default: m.VirtualTeacherLessonRoom,
  }))
);

export type AppExperienceView =
  | 'home'
  | 'landing'
  | 'onboarding'
  | 'placement'
  | 'dashboard'
  | 'lesson'
  | 'progress'
  | 'analytics'
  | 'profile'
  | 'settings'
  | 'pricing';

// Elegant Loading Skeleton Fallback for View Transitions
const ViewLoadingFallback = () => (
  <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6 animate-pulse font-sans">
    <div className="flex items-center justify-between pb-6 border-b border-slate-900">
      <div className="space-y-2 w-full max-w-md">
        <div className="h-4 bg-indigo-900/30 rounded-lg w-1/3" />
        <div className="h-8 bg-slate-900 rounded-xl w-3/4 border border-slate-800/80" />
        <div className="h-3 bg-slate-900/60 rounded-lg w-2/3" />
      </div>
      <div className="h-10 w-28 bg-slate-900 rounded-xl border border-slate-800" />
    </div>

    <div className="h-32 bg-slate-900/80 rounded-2xl border border-slate-800/80" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
      <div className="h-44 bg-slate-900/80 rounded-2xl border border-slate-800/80" />
      <div className="h-44 bg-slate-900/80 rounded-2xl border border-slate-800/80" />
      <div className="h-44 bg-slate-900/80 rounded-2xl border border-slate-800/80" />
    </div>
  </div>
);

export default function App() {
  // User Auth Session State
  const [session, setSession] = useState<AuthSessionData | null>(() => {
    try {
      const saved = localStorage.getItem('fluento_auth_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);

  // Synchronize profile through Application Layer
  useEffect(() => {
    let isMounted = true;

    // Load initial profile via Application Layer
    studentProfileAdapter.getLegacyUserProfile().then((loadedProfile) => {
      if (isMounted && loadedProfile) {
        setUserProfile(loadedProfile);
      }
    }).catch((err) => {
      console.warn('[App] Error hydrating profile via adapter:', err);
    });

    // Subscribe to profile updates across the app
    const unsubscribe = studentProfileAdapter.subscribe((canonical) => {
      if (isMounted) {
        studentProfileAdapter.getLegacyUserProfile(canonical.id).then((updated) => {
          if (isMounted && updated) {
            setUserProfile(updated);
          }
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Navigation View State
  const [currentView, setCurrentView] = useState<AppExperienceView>('home');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [activeLessonId, setActiveLessonId] = useState<string>('session-exec-1');

  // Navigation handler
  const navigateTo = (view: AppExperienceView | string, lessonId?: string) => {
    if (lessonId) setActiveLessonId(lessonId);
    setCurrentView(view as AppExperienceView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Success Handler
  const handleAuthSuccess = (newSession: AuthSessionData) => {
    setSession(newSession);
    try {
      localStorage.setItem('fluento_auth_session', JSON.stringify(newSession));
    } catch (e) {}
    setShowAuthModal(false);
    navigateTo('dashboard');
  };

  // Onboarding Complete Handler: delegates to Application Layer
  const handleOnboardingComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      await studentProfileAdapter.saveOnboardingProfile(profile);
    } catch (e) {
      console.warn('[App] Error persisting profile through adapter:', e);
    }
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Universal Experience Header */}
      <SharedHeader
        currentView={currentView}
        onNavigate={(v) => navigateTo(v)}
        userEmail={session?.email}
        userName={session?.name}
      />

      {/* Main Experience View Container */}
      <main className="flex-1">
        <Suspense fallback={<ViewLoadingFallback />}>
          {(currentView === 'home' || currentView === 'landing') && (
            <MarketingPage
              onStartOnboarding={() => navigateTo('onboarding')}
              onGoToDashboard={() => navigateTo('dashboard')}
            />
          )}

          {currentView === 'onboarding' && (
            <ConversationalOnboarding
              onComplete={handleOnboardingComplete}
              onGoToPlacement={() => navigateTo('placement')}
              onCancel={() => navigateTo('home')}
            />
          )}

          {currentView === 'placement' && (
            <PlacementPage
              onComplete={handleOnboardingComplete}
              onCancel={() => navigateTo('dashboard')}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardPage
              userProfile={userProfile}
              onSelectLesson={(lessonId) => navigateTo('lesson', lessonId)}
              onNavigateView={(v) => navigateTo(v)}
            />
          )}

          {currentView === 'lesson' && (
            <VirtualTeacherLessonRoom
              lessonId={activeLessonId}
              studentId={userProfile?.id || 'usr_fluento_primary'}
              onBackToDashboard={() => navigateTo('dashboard')}
            />
          )}

          {currentView === 'progress' && (
            <ProgressPage userProfile={userProfile} />
          )}

          {currentView === 'analytics' && (
            <AnalyticsPage
              studentId={userProfile?.id || 'usr_fluento_primary'}
              onBackToDashboard={() => navigateTo('dashboard')}
            />
          )}

          {currentView === 'profile' && (
            <ProfilePage studentId={userProfile?.id || 'usr_fluento_primary'} />
          )}

          {currentView === 'settings' && <SettingsPage />}

          {currentView === 'pricing' && (
            <PricingPage
              onSelectPlan={(planId) => {
                if (!session) setShowAuthModal(true);
                else navigateTo('dashboard');
              }}
              onStartFree={() => navigateTo('onboarding')}
            />
          )}
        </Suspense>
      </main>

      {/* Universal Footer */}
      <SharedFooter onNavigate={(v) => navigateTo(v)} />

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <AuthModal
          initialLanguage="pt"
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
