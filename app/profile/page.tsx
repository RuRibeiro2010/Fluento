import React from 'react';
import { DigitalTwinProfileView } from '@/components/profile/DigitalTwinProfileView';

interface ProfilePageProps {
  studentId?: string;
}

export default function ProfilePage({ studentId }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <DigitalTwinProfileView studentId={studentId} />
    </div>
  );
}
