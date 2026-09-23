import { lessonRulesService } from '../../../domain/lesson/services/lesson-rules.service';
import { RuntimeLessonGeneratorAiAdapter } from '../runtime-lesson-generator.adapter';
import { UserProfile } from '@/types/profile';
import { LongitudinalMemory } from '@/types/coach';

/**
 * LESSON MIGRATION TEST (Micro-Sprint 6B.5)
 * 
 * Verifies that deterministic lesson pedagogical logic was successfully extracted
 * from legacy AI module and that behaviors are preserved across adapters.
 */
async function runTests() {
  const log = (msg: string) => console.log(`[LESSON-MIGRATION-TEST] ${msg}`);
  
  try {
    const topic = 'Negotiation Skills';
    const difficulty = 'B2';
    const profile: Partial<UserProfile> = {
      motivation: 'Career Advancement',
      profession: 'Software Engineer',
      minutes_per_day: 20
    };
    const memory: LongitudinalMemory = {
      userId: 'user-123',
      targetLanguage: 'es',
      weakWords: [],
      weakGrammar: [{ concept: 'Past Tense', errorRate: 0.5, lastReviewed: new Date().toISOString() }],
      confidenceTrend: [],
      learningVelocity: 'steady',
      masteredTopics: [],
      totalPracticeMinutes: 100,
      streakDays: 5,
      pastErrorsMemory: ['irregular verbs']
    };

    log('1. Testing lessonRulesService.computePedagogicalDecision (Deterministic)...');
    const decision = lessonRulesService.computePedagogicalDecision(topic, difficulty, profile, memory);
    
    if (!decision.studentNeeds.includes('Negotiation Skills')) throw new Error('Student needs missing topic');
    if (!decision.studentNeeds.includes('Past Tense')) throw new Error('Student needs missing past error from memory');
    if (!decision.rationale.includes('Career Advancement')) throw new Error('Rationale missing motivation goal');
    if (decision.estimatedMinutes !== 20) throw new Error('Estimated minutes mismatch');
    if (!decision.motivationalHook.includes('Software Engineer')) throw new Error('Motivational hook missing profession');

    log('2. Testing lessonRulesService deterministic smart components...');
    const intro = lessonRulesService.generateSmartIntroduction(topic, profile);
    if (!intro.howItHelpsGoal.includes('Career Advancement')) throw new Error('Smart intro missing goal');
    
    const ending = lessonRulesService.generateSmartEnding();
    if (!ending.previewTomorrow) throw new Error('Smart ending missing preview');

    log('3. Verifying RuntimeLessonGeneratorAiAdapter uses Domain Rules as fallback/enrichment...');
    const mockAiRuntime: any = { 
      execute: () => Promise.resolve({ 
        content: JSON.stringify({ 
          title: 'AI Generated Lesson',
          description: 'Desc',
          estimatedMinutes: 20,
          content: { vocabulary: [], grammarNotes: [], dialogue: [], exercises: [], explainBetter: { concept: 'C', simpleExplanation: 'E', analogy: 'A', nativeLanguageBridge: 'B' } }
          // Omitting smart fields to test fallback to domain rules
        }) 
      }) 
    };
    const runtimeAdapter = new RuntimeLessonGeneratorAiAdapter(mockAiRuntime);
    const runtimeLesson = await runtimeAdapter.generateLesson('es', 'pt', topic, difficulty, profile, memory);
    
    if (runtimeLesson.pedagogicalDecision?.studentNeeds !== decision.studentNeeds) {
      throw new Error('Runtime adapter did not fallback to domain pedagogical decision correctly');
    }
    if (runtimeLesson.smartIntroduction?.howItHelpsGoal !== intro.howItHelpsGoal) {
      throw new Error('Runtime adapter did not fallback to domain smart introduction correctly');
    }

    log('ALL LESSON MIGRATION TESTS PASSED!');
  } catch (error: any) {
    console.error(`[LESSON-MIGRATION-TEST] TEST FAILED: ${error.message}`);
    process.exit(1);
  }
}

runTests();
