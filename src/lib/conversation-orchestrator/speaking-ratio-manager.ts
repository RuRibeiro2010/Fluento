/**
 * FLUENTO CONVERSATION ORCHESTRATOR - SPEAKING RATIO MANAGER
 * 
 * Enforces the core Fluento mandate:
 * - Student Talk Time (STT) MUST be greater than 60% (target 65% - 75%).
 * - Teacher Talk Time (TTT) MUST be kept under 40%.
 * Tracks talk time ratios continuously and generates alerts when teacher turns are too long.
 */

import { SpeakingRatioMetrics } from './types';
import { ComposedLesson } from '@/src/lib/lesson-composer';

export class SpeakingRatioManager {
  private studentTalkSeconds: number = 0;
  private teacherTalkSeconds: number = 0;
  private silenceSeconds: number = 0;

  /**
   * Resets the talk time counters for a new session.
   */
  public reset(): void {
    this.studentTalkSeconds = 0;
    this.teacherTalkSeconds = 0;
    this.silenceSeconds = 0;
  }

  /**
   * Records speech duration for a specific speaker.
   */
  public recordSpeech(speaker: 'student' | 'teacher' | 'silence', durationSeconds: number): void {
    const validDuration = Math.max(0, durationSeconds);
    if (speaker === 'student') {
      this.studentTalkSeconds += validDuration;
    } else if (speaker === 'teacher') {
      this.teacherTalkSeconds += validDuration;
    } else {
      this.silenceSeconds += validDuration;
    }
  }

  /**
   * Computes current speaking ratio metrics and returns recommendations.
   */
  public calculateMetrics(lesson?: ComposedLesson): SpeakingRatioMetrics {
    const totalActiveTalkSeconds = this.studentTalkSeconds + this.teacherTalkSeconds;
    const totalSessionSeconds = totalActiveTalkSeconds + this.silenceSeconds;

    const targetStudentRatio = lesson?.pedagogicalConfig.targetStudentTalkTimeRatio || 65;

    let studentRatio = 50;
    let teacherRatio = 50;

    if (totalActiveTalkSeconds > 0) {
      studentRatio = Math.round((this.studentTalkSeconds / totalActiveTalkSeconds) * 1000) / 10;
      teacherRatio = Math.round((this.teacherTalkSeconds / totalActiveTalkSeconds) * 1000) / 10;
    }

    const isCompliant = studentRatio >= 60.0;

    let recommendation: SpeakingRatioMetrics['recommendation'] = 'maintain_equilibrium';
    if (studentRatio < 55) {
      recommendation = 'shorten_teacher_turns';
    } else if (studentRatio < 60) {
      recommendation = 'encourage_student';
    } else {
      recommendation = 'maintain_equilibrium';
    }

    return {
      totalSessionSeconds: Math.round(totalSessionSeconds),
      studentTalkSeconds: Math.round(this.studentTalkSeconds),
      teacherTalkSeconds: Math.round(this.teacherTalkSeconds),
      silenceSeconds: Math.round(this.silenceSeconds),
      studentTalkTimeRatio: studentRatio,
      teacherTalkTimeRatio: teacherRatio,
      targetStudentRatio,
      isCompliant,
      recommendation
    };
  }
}

export const speakingRatioManager = new SpeakingRatioManager();
