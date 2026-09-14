/**
 * FLUENTO CONVERSATION ORCHESTRATOR - TURN MANAGER
 * 
 * Manages floor control, active speaker state, and turn state transitions.
 * Enforces the core rule that the student holds floor priority in learning sessions.
 */

import { SpeakerRole, TurnState, TurnEvent } from './types';

export class TurnManager {
  private currentTurnState: TurnState = 'idle';
  private activeSpeaker: SpeakerRole = 'teacher';
  private turnHistory: { speaker: SpeakerRole; durationSeconds: number; timestampIso: string }[] = [];

  /**
   * Resets the turn manager for a new session or block.
   */
  public reset(initialSpeaker: SpeakerRole = 'teacher'): void {
    this.currentTurnState = 'idle';
    this.activeSpeaker = initialSpeaker;
    this.turnHistory = [];
  }

  public getTurnState(): TurnState {
    return this.currentTurnState;
  }

  public getActiveSpeaker(): SpeakerRole {
    return this.activeSpeaker;
  }

  public getTurnHistory() {
    return [...this.turnHistory];
  }

  /**
   * Processes a turn event and updates turn state and active speaker.
   */
  public processTurnEvent(event: TurnEvent): TurnState {
    switch (event.eventType) {
      case 'speech_started':
        this.activeSpeaker = event.speaker;
        this.currentTurnState = event.speaker === 'student' ? 'student_speaking' : 'teacher_speaking';
        break;

      case 'speech_ended':
        if (event.durationSeconds && event.durationSeconds > 0) {
          this.turnHistory.push({
            speaker: event.speaker,
            durationSeconds: event.durationSeconds,
            timestampIso: event.timestampIso
          });
        }

        if (event.speaker === 'teacher') {
          // After teacher speaks, move to Wait Time 1 (waiting for student to begin response)
          this.currentTurnState = 'wait_time_1';
        } else if (event.speaker === 'student') {
          // After student speaks, move to Wait Time 2 (waiting to ensure student finished elaboration)
          this.currentTurnState = 'wait_time_2';
        }
        break;

      case 'silence_detected':
        // Silence while waiting for student
        if (this.currentTurnState === 'teacher_speaking') {
          this.currentTurnState = 'wait_time_1';
        }
        break;

      case 'interruption_attempt':
        this.currentTurnState = 'interruption_evaluated';
        break;

      default:
        break;
    }

    return this.currentTurnState;
  }

  /**
   * Explicitly sets the turn state (used by higher-level orchestrator).
   */
  public setTurnState(state: TurnState, speaker?: SpeakerRole): void {
    this.currentTurnState = state;
    if (speaker) {
      this.activeSpeaker = speaker;
    }
  }
}

export const turnManager = new TurnManager();
