/**
 * Memory Threads Engine (Sprint 5)
 * Creates permanent links between learned concepts and evolving real-world contexts:
 * e.g., "appointment" -> conversation -> email -> hotel -> business -> interview -> podcast -> roleplay -> review.
 * Ensures knowledge deepens naturally across contexts without artificial repetition.
 */

import { MemoryThreadNode, MemoryThreadContext } from './lesson-composer-types';

export class MemoryThreadsEngine {
  private threads: Map<string, MemoryThreadNode>;

  private static contextSequence: MemoryThreadContext[] = [
    'conversation',
    'email',
    'hotel',
    'business',
    'interview',
    'podcast',
    'roleplay',
    'review',
  ];

  constructor(initialThreads?: MemoryThreadNode[]) {
    this.threads = new Map();
    if (initialThreads && initialThreads.length > 0) {
      initialThreads.forEach((t) => this.threads.set(t.concept.toLowerCase(), t));
    } else {
      this.populateDefaultThreads();
    }
  }

  private populateDefaultThreads(): void {
    const defaults: MemoryThreadNode[] = [
      {
        id: 'thread_appointment',
        concept: 'appointment',
        currentDepthScore: 45,
        contextsConnected: ['conversation', 'email'],
        lastContextUsed: 'email',
        nextRecommendedContext: 'hotel',
        lastPracticedIso: new Date().toISOString(),
      },
      {
        id: 'thread_past_simple',
        concept: 'Past Simple Conjugations',
        currentDepthScore: 60,
        contextsConnected: ['conversation', 'interview', 'roleplay'],
        lastContextUsed: 'roleplay',
        nextRecommendedContext: 'business',
        lastPracticedIso: new Date().toISOString(),
      },
      {
        id: 'thread_reschedule',
        concept: 'reschedule meeting',
        currentDepthScore: 30,
        contextsConnected: ['conversation'],
        lastContextUsed: 'conversation',
        nextRecommendedContext: 'email',
        lastPracticedIso: new Date().toISOString(),
      },
      {
        id: 'thread_connectors',
        concept: 'Discourse Connectors (Sin embargo, Por lo tanto)',
        currentDepthScore: 50,
        contextsConnected: ['conversation', 'podcast'],
        lastContextUsed: 'podcast',
        nextRecommendedContext: 'interview',
        lastPracticedIso: new Date().toISOString(),
      },
    ];

    defaults.forEach((t) => this.threads.set(t.concept.toLowerCase(), t));
  }

  /**
   * Connects a concept to a new context in the Memory Thread chain.
   */
  public linkContext(concept: string, context: MemoryThreadContext): MemoryThreadNode {
    const key = concept.toLowerCase();
    let thread = this.threads.get(key);

    if (!thread) {
      thread = {
        id: `thread_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        concept,
        currentDepthScore: 20,
        contextsConnected: [context],
        lastContextUsed: context,
        nextRecommendedContext: this.calculateNextContext([context]),
        lastPracticedIso: new Date().toISOString(),
      };
    } else {
      if (!thread.contextsConnected.includes(context)) {
        thread.contextsConnected.push(context);
      }
      thread.lastContextUsed = context;
      thread.currentDepthScore = Math.min(100, thread.currentDepthScore + 15);
      thread.nextRecommendedContext = this.calculateNextContext(thread.contextsConnected);
      thread.lastPracticedIso = new Date().toISOString();
    }

    this.threads.set(key, thread);
    return { ...thread };
  }

  /**
   * Determines the next recommended context to deepen mastery for a thread.
   */
  private calculateNextContext(used: MemoryThreadContext[]): MemoryThreadContext {
    for (const ctx of MemoryThreadsEngine.contextSequence) {
      if (!used.includes(ctx)) {
        return ctx;
      }
    }
    return 'roleplay'; // default fallback for deep mastery
  }

  /**
   * Retrieves active threads that need cross-context reinforcement for lesson composition.
   */
  public getActiveThreadsForLesson(limit = 3): MemoryThreadNode[] {
    const sorted = Array.from(this.threads.values()).sort(
      (a, b) => a.currentDepthScore - b.currentDepthScore
    );
    return sorted.slice(0, limit).map((t) => ({ ...t }));
  }

  /**
   * Returns all stored Memory Threads.
   */
  public getAllThreads(): MemoryThreadNode[] {
    return Array.from(this.threads.values()).map((t) => ({ ...t }));
  }
}
