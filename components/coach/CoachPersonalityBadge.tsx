import React from 'react';
import { Sparkles, Brain, Smile, GraduationCap } from 'lucide-react';
import { Badge } from '@/src/components/design-system';

interface CoachPersonalityBadgeProps {
  personality: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CoachPersonalityBadge({ personality, size = 'md' }: CoachPersonalityBadgeProps) {
  const normalized = (personality || 'encouraging').toLowerCase();

  let icon = <Sparkles className="w-3.5 h-3.5" />;
  let label = 'Encouraging Coach';
  let variant: 'warning' | 'secondary' | 'success' | 'info' | 'primary' = 'warning';
  let customClasses = '';

  if (normalized.includes('strict') || normalized.includes('academic')) {
    icon = <GraduationCap className="w-3.5 h-3.5" />;
    label = 'Academic Coach';
    // Mapping purple to info or primary since Badge lacks purple, or keep original purple via className
    variant = 'secondary'; 
    customClasses = 'bg-purple-950/80 border-purple-500/40 text-purple-300';
  } else if (normalized.includes('casual')) {
    icon = <Smile className="w-3.5 h-3.5" />;
    label = 'Casual Coach';
    variant = 'success';
  } else if (normalized.includes('socratic')) {
    icon = <Brain className="w-3.5 h-3.5" />;
    label = 'Socratic Coach';
    variant = 'info';
  }

  const badgeSize = size === 'lg' ? 'md' : size;
  const lgSizeClasses = size === 'lg' ? 'text-sm px-3.5 py-1.5 gap-2' : 'gap-1.5';

  return (
    <Badge 
      variant={variant} 
      size={badgeSize} 
      className={`uppercase tracking-wider ${lgSizeClasses} ${customClasses}`}
    >
      {icon}
      <span>{label}</span>
    </Badge>
  );
}

