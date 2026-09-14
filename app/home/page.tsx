import React from 'react';
import MarketingPage from '@/app/(marketing)/page';

interface HomePageProps {
  onStartOnboarding?: () => void;
  onGoToDashboard?: () => void;
}

export default function HomePage({ onStartOnboarding, onGoToDashboard }: HomePageProps) {
  return (
    <MarketingPage
      onStartOnboarding={onStartOnboarding}
      onGoToDashboard={onGoToDashboard}
    />
  );
}
