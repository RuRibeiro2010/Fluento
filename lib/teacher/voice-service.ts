import { VoiceSettings } from '@/types/teacher';

/**
 * Abstraction layer for Speech-to-Text and Text-to-Speech
 * Supports browser native Web Speech API with fail-safe fallbacks.
 */
export class VoiceService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Check Speech Recognition support
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }

      // Check Speech Synthesis support
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    }
  }

  public getVoiceCapabilities(): { sttSupported: boolean; ttsSupported: boolean } {
    return {
      sttSupported: Boolean(this.recognition),
      ttsSupported: Boolean(this.synthesis),
    };
  }

  /**
   * Start listening via Speech-to-Text
   */
  public startListening(
    languageCode: string,
    onTranscript: (text: string, isFinal: boolean) => void,
    onError?: (err: string) => void
  ): boolean {
    if (!this.recognition) {
      if (onError) onError('Speech Recognition is not supported in this browser environment.');
      return false;
    }

    try {
      this.recognition.lang = languageCode || 'en-US';
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        onTranscript(text, Boolean(finalTranscript));
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        if (onError) onError(event.error || 'Speech recognition error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      if (onError) onError(err?.message || 'Failed to start microphone listener.');
      return false;
    }
  }

  /**
   * Stop Speech-to-Text listening
   */
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
      this.isListening = false;
    }
  }

  /**
   * Speak text out loud using Text-to-Speech
   */
  public speakText(
    text: string,
    languageCode: string = 'en-US',
    speechRate: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    if (!this.synthesis) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCode;
    utterance.rate = Math.min(1.2, Math.max(0.7, speechRate));

    // Try finding matching voice
    const voices = this.synthesis.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.startsWith(languageCode.split('-')[0]) || v.lang === languageCode
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.synthesis.speak(utterance);
  }

  /**
   * Stop Speech Synthesis
   */
  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }
}

export const defaultVoiceService = new VoiceService();
