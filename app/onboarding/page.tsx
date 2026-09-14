import React, { useState } from 'react';
import { ONBOARDING_QUESTIONS } from '@/lib/onboarding/quiz';
import {
  OnboardingHeader,
  OnboardingStepWrapper,
  SingleSelectStep,
  MultiSelectStep,
  PlacementTestModal,
  OnboardingSummary,
} from '@/components/onboarding';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { saveOnboardingProfile } from './actions';
import { UserProfile } from '@/types/profile';
import { OnboardingData, PlacementTestResult } from '@/types/onboarding';

interface OnboardingPageProps {
  onComplete?: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export default function OnboardingPage({ onComplete, onCancel }: OnboardingPageProps) {
  // UI Language state (en, pt, es, fr, de)
  const [uiLanguage, setUiLanguage] = useState<string>('en');

  // Current question index in ONBOARDING_QUESTIONS array
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Form selections state
  const [answers, setAnswers] = useState<{
    ui_language: string;
    native_language: string;
    target_languages: string[];
    primary_goal: string;
    daily_commitment: string;
    current_level: string;
    learning_style: string;
    coach_personality: string;
    topics: string[];
  }>({
    ui_language: 'en',
    native_language: 'en',
    target_languages: ['es'],
    primary_goal: 'travel',
    daily_commitment: '15',
    current_level: 'A1',
    learning_style: 'visual',
    coach_personality: 'encouraging',
    topics: ['travel', 'daily_life'],
  });

  // AI Placement Test state
  const [showPlacementModal, setShowPlacementModal] = useState<boolean>(false);
  const [placementResult, setPlacementResult] = useState<PlacementTestResult | undefined>(undefined);

  // Is viewing summary step?
  const [isSummaryStep, setIsSummaryStep] = useState<boolean>(false);

  // Async state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalQuestions = ONBOARDING_QUESTIONS.length;
  const currentQuestion = ONBOARDING_QUESTIONS[currentStepIndex];

  // Handle single selection
  const handleSingleSelect = (val: string) => {
    if (currentQuestion.id === 'ui_language') {
      setUiLanguage(val);
    }

    if (currentQuestion.id === 'current_level' && val === 'placement_test') {
      setShowPlacementModal(true);
      return;
    }

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  // Handle multi selection (target languages & topics)
  const handleMultiToggle = (val: string) => {
    const key = currentQuestion.id as 'target_languages' | 'topics';
    setAnswers((prev) => {
      const currentList = prev[key] || [];
      const updatedList = currentList.includes(val)
        ? currentList.filter((item) => item !== val)
        : [...currentList, val];
      return { ...prev, [key]: updatedList };
    });
  };

  // Step validation check
  const canContinue = () => {
    if (currentQuestion.id === 'target_languages') {
      return answers.target_languages.length > 0;
    }
    if (currentQuestion.id === 'topics') {
      return answers.topics.length > 0;
    }
    return Boolean(answers[currentQuestion.id as keyof typeof answers]);
  };

  // Advance step
  const handleNext = () => {
    if (!canContinue()) return;

    if (currentStepIndex < totalQuestions - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsSummaryStep(true);
    }
  };

  // Back step
  const handleBack = () => {
    if (isSummaryStep) {
      setIsSummaryStep(false);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  // Completion callback from Placement Test Modal
  const handlePlacementComplete = (result: PlacementTestResult) => {
    setPlacementResult(result);
    setAnswers((prev) => ({ ...prev, current_level: result.assignedLevel }));
    setShowPlacementModal(false);
    // Advance step automatically after test
    if (currentStepIndex < totalQuestions - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsSummaryStep(true);
    }
  };

  // Final confirmation & profile saving
  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const onboardingData: OnboardingData = {
      uiLanguage,
      nativeLanguage: answers.native_language,
      targetLanguages: answers.target_languages,
      primaryGoal: answers.primary_goal,
      dailyCommitmentMinutes: parseInt(answers.daily_commitment || '15', 10),
      currentLevel: answers.current_level,
      learningStyle: answers.learning_style,
      coachStyle: answers.coach_personality,
      interests: answers.topics,
      placementResult,
      answers,
    };

    const res = await saveOnboardingProfile(onboardingData);
    setIsSubmitting(false);

    if (res.success && res.profile) {
      if (onComplete) {
        onComplete(res.profile);
      }
    } else {
      setSubmitError(res.error || 'Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Header with progress & UI Language switcher */}
      <OnboardingHeader
        currentStep={isSummaryStep ? totalQuestions : currentStepIndex}
        totalSteps={totalQuestions + 1}
        uiLanguage={uiLanguage}
        onUiLanguageChange={(lang) => {
          setUiLanguage(lang);
          setAnswers((prev) => ({ ...prev, ui_language: lang }));
        }}
        onBack={handleBack}
        canGoBack={true}
      />

      {/* Main Container */}
      <main className="my-auto py-8 w-full">
        {/* If Placement Test Modal open */}
        {showPlacementModal ? (
          <PlacementTestModal
            targetLanguage={answers.target_languages[0] || 'es'}
            uiLanguage={uiLanguage}
            onComplete={handlePlacementComplete}
            onCancel={() => setShowPlacementModal(false)}
          />
        ) : isSummaryStep ? (
          /* Final Summary Screen */
          <OnboardingStepWrapper stepKey="summary">
            <OnboardingSummary
              data={{
                uiLanguage,
                nativeLanguage: answers.native_language,
                targetLanguages: answers.target_languages,
                primaryGoal: answers.primary_goal,
                dailyCommitmentMinutes: parseInt(answers.daily_commitment || '15', 10),
                currentLevel: answers.current_level,
                learningStyle: answers.learning_style,
                coachStyle: answers.coach_personality,
                interests: answers.topics,
                placementResult,
                answers,
              }}
              isLoading={isSubmitting}
              error={submitError}
              onConfirm={handleSaveProfile}
              onRetry={handleSaveProfile}
            />
          </OnboardingStepWrapper>
        ) : (
          /* Question Screen */
          <OnboardingStepWrapper stepKey={currentQuestion.id}>
            {currentQuestion.allowMultiple ? (
              <MultiSelectStep
                question={currentQuestion}
                uiLanguage={uiLanguage}
                selectedValues={
                  answers[currentQuestion.id as keyof typeof answers] as string[]
                }
                onToggle={handleMultiToggle}
              />
            ) : (
              <SingleSelectStep
                question={currentQuestion}
                uiLanguage={uiLanguage}
                selectedValue={
                  answers[currentQuestion.id as keyof typeof answers] as string
                }
                onSelect={handleSingleSelect}
              />
            )}
          </OnboardingStepWrapper>
        )}
      </main>

      {/* Bottom Sticky Action Footer (Hidden if Summary or Placement Modal open) */}
      {!isSummaryStep && !showPlacementModal && (
        <div className="max-w-2xl mx-auto w-full pb-6 pt-2 px-4 sm:px-0">
          <button
            type="button"
            onClick={handleNext}
            disabled={!canContinue()}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition shadow-xl shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>
              {currentStepIndex === totalQuestions - 1 ? 'Review Persona & Summary' : 'Continue'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
