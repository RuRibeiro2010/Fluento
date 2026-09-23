import React from 'react';
import { Bot, MessageSquare } from 'lucide-react';
import { Card, Heading3, CaptionText, Button } from '@/src/components/design-system';

interface CoachCardProps {
  personality?: string;
  advice?: string;
  onInteract?: () => void;
}

export function CoachCard({ personality = 'Encouraging', advice, onInteract }: CoachCardProps) {
  return (
    <Card 
      variant="default" 
      className="p-5 space-y-3 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 border-indigo-100 dark:border-indigo-950"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <Heading3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Language Coach</Heading3>
            <CaptionText className="text-indigo-600 dark:text-indigo-400 capitalize">{personality} Style</CaptionText>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
        "{advice || 'Ready to boost your fluency? Let’s work on your vocabulary and speaking confidence today!'}"
      </p>

      {onInteract && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onInteract}
          className="w-fit p-0 h-auto text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:bg-transparent shadow-none"
          icon={<MessageSquare className="w-3.5 h-3.5" />}
        >
          Speak with Coach
        </Button>
      )}
    </Card>
  );
}
