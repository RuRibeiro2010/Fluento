/**
 * Life Events Engine (Sprint A)
 * Handles major real-world milestones (job interviews, travel, exams, presentations).
 * Automatically temporarily adjusts the journey focus when a Life Event is active,
 * and seamlessly restores the core long-term trajectory after completion.
 */

import { LifeEvent } from './journey-orchestrator-types';

export class LifeEventsEngine {
  private events: LifeEvent[];

  constructor(initialEvents?: LifeEvent[]) {
    this.events = initialEvents || this.generateDefaultLifeEvents();
  }

  private generateDefaultLifeEvents(): LifeEvent[] {
    return [
      {
        id: 'event_interview_1',
        type: 'job_interview',
        title: 'Entrevista de Emprego em Espanhol',
        eventDateIso: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks out
        urgencyLevel: 'high',
        status: 'upcoming',
        temporaryFocusTopics: [
          'Apresentação Profissional & Trajetória',
          'Vocabulário do Setor de Tecnologia',
          'Perguntas de Situações Passadas (Past Tenses)',
        ],
        postEventAction: 'resume_standard_journey',
      },
    ];
  }

  /**
   * Retrieves all registered Life Events.
   */
  public getEvents(): LifeEvent[] {
    return this.events.map((e) => ({ ...e }));
  }

  /**
   * Checks if there is an active or high-urgency upcoming event.
   */
  public getActiveLifeEvent(): LifeEvent | null {
    const now = new Date().getTime();
    const active = this.events.find((e) => {
      if (e.status === 'completed') return false;
      const eventTime = new Date(e.eventDateIso).getTime();
      const diffDays = (eventTime - now) / (1000 * 60 * 60 * 24);
      return diffDays <= 21; // Within 3 weeks
    });

    return active ? { ...active } : null;
  }

  /**
   * Adds a new real-world Life Event.
   */
  public addLifeEvent(event: Omit<LifeEvent, 'id' | 'status'>): LifeEvent {
    const newEvent: LifeEvent = {
      ...event,
      id: `life_evt_${Date.now()}`,
      status: 'upcoming',
    };
    this.events.push(newEvent);
    return { ...newEvent };
  }

  /**
   * Marks a Life Event as completed and triggers trajectory recovery.
   */
  public markEventCompleted(eventId: string): void {
    const evt = this.events.find((e) => e.id === eventId);
    if (evt) {
      evt.status = 'completed';
    }
  }
}
