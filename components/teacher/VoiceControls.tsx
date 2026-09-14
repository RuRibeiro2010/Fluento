import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  autoPlayTts: boolean;
  sttSupported: boolean;
  ttsSupported: boolean;
  onToggleListening: () => void;
  onToggleAutoPlayTts: () => void;
  onStopSpeaking: () => void;
  className?: string;
}

export function VoiceControls({
  isListening,
  isSpeaking,
  autoPlayTts,
  sttSupported,
  ttsSupported,
  onToggleListening,
  onToggleAutoPlayTts,
  onStopSpeaking,
  className = '',
}: VoiceControlsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Microphone Push-to-Talk or Toggle */}
      <button
        type="button"
        onClick={onToggleListening}
        disabled={!sttSupported}
        title={sttSupported ? (isListening ? 'Stop Listening' : 'Speak via Microphone') : 'STT Not Supported'}
        className={`p-3 rounded-full font-bold text-xs transition-all flex items-center gap-2 ${
          isListening
            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 animate-pulse'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
        } ${!sttSupported ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        <span className="hidden sm:inline">
          {isListening ? 'Listening...' : 'Push to Speak'}
        </span>
      </button>

      {/* Stop Active Speech Synthesis */}
      {isSpeaking && (
        <button
          type="button"
          onClick={onStopSpeaking}
          className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
          title="Mute AI Speech"
        >
          <VolumeX className="w-4 h-4" />
        </button>
      )}

      {/* Auto-Play Speech Toggle */}
      <button
        type="button"
        onClick={onToggleAutoPlayTts}
        disabled={!ttsSupported}
        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
          autoPlayTts
            ? 'bg-indigo-950/80 border-indigo-800 text-indigo-300'
            : 'bg-slate-900 border-slate-800 text-slate-500'
        }`}
        title="Toggle Auto Read Aloud"
      >
        <Volume2 className="w-4 h-4" />
        <span className="hidden md:inline">Voice Read Aloud</span>
      </button>
    </div>
  );
}
