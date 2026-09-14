import React from 'react';
import { ConversationMessage } from '@/types/teacher';
import { Volume2, Sparkles, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

interface ConversationBubbleProps {
  key?: React.Key;
  message: ConversationMessage;
  teacherName?: string;
  onPlayAudio?: (text: string) => void;
}

export function ConversationBubble({
  message,
  teacherName = 'Teacher',
  onPlayAudio,
}: ConversationBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 max-w-2xl`}>
      {/* Sender Header */}
      <div className="flex items-center gap-2 px-1 text-[11px] font-bold text-slate-400">
        <span>{isUser ? 'You' : teacherName}</span>
        <span>•</span>
        <span className="font-normal text-slate-500">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Message Box */}
      <div
        className={`p-4 rounded-2xl border text-sm leading-relaxed space-y-3 shadow-md relative ${
          isUser
            ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
            : 'bg-slate-900 text-slate-100 border-slate-800 rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap font-medium">{message.text}</p>

        {/* Audio Listen Trigger */}
        {!isUser && onPlayAudio && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onPlayAudio(message.text)}
              className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 text-indigo-300 transition border border-slate-800 text-xs flex items-center gap-1 font-semibold"
              title="Listen to pronunciation"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>
        )}

        {/* Corrections Callout Box (if present) */}
        {message.corrections && message.corrections.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs space-y-2 text-slate-200">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" /> Grammar & Expression Correction
            </span>
            {message.corrections.map((corr, idx) => (
              <div key={idx} className="space-y-1 border-t border-slate-800 pt-1.5">
                <div className="flex items-center gap-2">
                  <span className="line-through text-rose-400 font-mono text-[11px]">
                    {corr.originalText}
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="text-emerald-400 font-bold font-mono text-[11px]">
                    {corr.correctedText}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 italic">{corr.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Phonetic Tip */}
        {message.phoneticTip && (
          <div className="p-2.5 rounded-lg bg-sky-950/60 border border-sky-800/40 text-[11px] text-sky-200 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
            <span>{message.phoneticTip}</span>
          </div>
        )}

        {/* Vocabulary Notes */}
        {message.vocabularyNotes && message.vocabularyNotes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.vocabularyNotes.map((vocab, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-indigo-300 font-semibold flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3 text-indigo-400" />
                <span className="font-bold">{vocab.word}:</span> {vocab.definition}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
