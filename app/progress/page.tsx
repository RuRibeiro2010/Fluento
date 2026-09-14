import React from 'react';
import { ComprehensiveProgressView } from '@/components/progress/ComprehensiveProgressView';
import { UserProfile } from '@/types/profile';

interface ProgressPageProps {
  userProfile?: UserProfile;
}

export default function ProgressPage({ userProfile }: ProgressPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <ComprehensiveProgressView userProfile={userProfile} />
    </div>
  );
}
