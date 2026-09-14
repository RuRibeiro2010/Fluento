import React from 'react';
import { AnalyticsDashboardView } from '@/components/analytics/AnalyticsDashboardView';

interface AnalyticsPageProps {
  studentId?: string;
  onBackToDashboard?: () => void;
}

export default function AnalyticsPage({ studentId, onBackToDashboard }: AnalyticsPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <AnalyticsDashboardView studentId={studentId} onBackToDashboard={onBackToDashboard} />
    </div>
  );
}
