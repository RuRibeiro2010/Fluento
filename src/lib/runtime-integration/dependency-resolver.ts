/**
 * FLUENTO RUNTIME INTEGRATION - DEPENDENCY RESOLVER
 * 
 * Verifies that all required module facades in the intelligence pipeline are available,
 * correctly wired, and non-null.
 */

import { studentDigitalTwin } from '@/src/lib/student-digital-twin';
import { learningAnalyticsEngine } from '@/src/lib/learning-analytics';
import { adaptivePlanner } from '@/src/lib/adaptive-planner';
import { learningEngine } from '@/src/lib/learning-engine';
import { lessonComposer } from '@/src/lib/lesson-composer';
import { conversationOrchestrator } from '@/src/lib/conversation-orchestrator';
import { teacherRuntime } from '@/src/lib/teacher-runtime';
import { promptBuilder } from '@/src/lib/prompt-builder';
import { aiRuntime } from '@/src/lib/ai-runtime';
import { sessionRuntime } from '@/src/lib/session-runtime';
import { learningThreadsRuntime } from '@/src/lib/learning-threads';

export interface DependencyCheckResult {
  allResolved: boolean;
  missingDependencies: string[];
}

export class DependencyResolver {
  public resolveDependencies(): DependencyCheckResult {
    const missingDependencies: string[] = [];

    if (!studentDigitalTwin) missingDependencies.push('studentDigitalTwin');
    if (!learningAnalyticsEngine) missingDependencies.push('learningAnalyticsEngine');
    if (!adaptivePlanner) missingDependencies.push('adaptivePlanner');
    if (!learningEngine) missingDependencies.push('learningEngine');
    if (!lessonComposer) missingDependencies.push('lessonComposer');
    if (!conversationOrchestrator) missingDependencies.push('conversationOrchestrator');
    if (!teacherRuntime) missingDependencies.push('teacherRuntime');
    if (!promptBuilder) missingDependencies.push('promptBuilder');
    if (!aiRuntime) missingDependencies.push('aiRuntime');
    if (!sessionRuntime) missingDependencies.push('sessionRuntime');
    if (!learningThreadsRuntime) missingDependencies.push('learningThreadsRuntime');

    return {
      allResolved: missingDependencies.length === 0,
      missingDependencies
    };
  }
}

export const dependencyResolver = new DependencyResolver();
