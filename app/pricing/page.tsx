import React from 'react';
import { PricingView } from '@/components/pricing/PricingView';

interface PricingPageProps {
  onSelectPlan?: (planId: string) => void;
  onStartFree?: () => void;
}

export default function PricingPage({ onSelectPlan, onStartFree }: PricingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <PricingView onSelectPlan={onSelectPlan} onStartFree={onStartFree} />
    </div>
  );
}
