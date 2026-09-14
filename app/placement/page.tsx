import React from 'react';
import { PlacementTestView } from '@/components/onboarding/PlacementTestView';
import { UserProfile } from '@/types/profile';

interface PlacementPageProps {
  onComplete?: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export default function PlacementPage({ onComplete = () => {}, onCancel }: PlacementPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <PlacementTestView onComplete={onComplete} onCancel={onCancel} />
    </div>
  );
}
