
import { RuntimeLessonGeneratorAiAdapter } from '../runtime-lesson-generator.adapter';
import { AIRuntime } from '@/src/lib/ai-runtime/ai-runtime';

export async function runRuntimeLessonMigrationTests(): Promise<{ passed: boolean; logs: string[] }> {
  const logs: string[] = [];
  const log = (msg: string) => logs.push(`[LESSON-MIGRATION-TEST] ${msg}`);

  try {
    log('1. Setting up mocks for AI Runtime...');
    
    let aiRuntimeCalled = false;
    let lastRequest: any = null;
    
    const mockAiRuntime = {
      execute: async (req: any) => {
        aiRuntimeCalled = true;
        lastRequest = req;
        
        // Return a valid JSON response for Lesson (matching new strict requirements)
        return {
          content: JSON.stringify({
            title: 'Test Lesson Title',
            description: 'Test Lesson Description',
            estimatedMinutes: 20,
            content: {
              vocabulary: [{ word: 'test', translation: 'teste', example: 'This is a test' }],
              grammarNotes: ['test grammar'],
              dialogue: [{ speaker: 'Coach', text: 'Hello', translation: 'Olá' }],
              exercises: [{ id: 'ai-ex-1', type: 'multiple_choice', prompt: 'test prompt', correctAnswer: 'A', explanation: 'Because' }],
              explainBetter: { concept: 'test', simpleExplanation: 'test', analogy: 'test', nativeLanguageBridge: 'test' }
            },
            smartIntroduction: { whyThisLessonExists: 't', whyItIsImportant: 't', howItHelpsGoal: 't' },
            smartEnding: { whatImproved: 't', whatNeedsWork: 't', previewTomorrow: 't' },
            pedagogicalDecision: { studentNeeds: 't', rationale: 't', methodology: 't', estimatedMinutes: 20, expectedFriction: 't', motivationalHook: 't' },
            intelligentHomework: { title: 't', type: 'writing', description: 't', estimatedMinutes: 5 }
          }),
          provider: 'gemini'
        };
      }
    } as unknown as AIRuntime;

    const adapter = new RuntimeLessonGeneratorAiAdapter(mockAiRuntime);

    log('2. Testing generateLesson (Migrated)...');
    const profile = { id: 'user123', email: 'test@example.com' };
    
    const lesson = await adapter.generateLesson(
      'Spanish',
      'Portuguese',
      'Business Meeting',
      'B1',
      profile
    );
    
    if (!aiRuntimeCalled) throw new Error('AI Runtime was not called for Lesson Generation');
    if (lesson.title !== 'Test Lesson Title') throw new Error('Incorrect Lesson title returned');
    if (!lesson.id.startsWith('lesson-')) throw new Error('Lesson ID should be application-controlled');
    if (lesson.targetLanguage !== 'Spanish') throw new Error('Target language should be application-controlled');
    
    // Verify Zod validation in action (by testing invalid output)
    log('3. Testing invalid AI output rejection (missing fields)...');
    const invalidAiRuntime = {
      execute: async () => ({
        content: JSON.stringify({ title: 'Missing required fields' }),
        provider: 'gemini'
      })
    } as unknown as AIRuntime;
    
    const invalidAdapter = new RuntimeLessonGeneratorAiAdapter(invalidAiRuntime);
    
    try {
      await invalidAdapter.generateLesson('Spanish', 'Portuguese', 'Topic', 'B1');
      throw new Error('Should have thrown error for invalid AI output');
    } catch (err: any) {
      if (!err.message.includes('invalid content structure')) {
        throw new Error(`Expected validation error, got: ${err.message}`);
      }
      log('Successfully rejected invalid AI output');
    }

    log('4. Testing fallback to deterministic pedagogicalDecision when missing from AI...');
    const missingDecisionAiRuntime = {
      execute: async () => ({
        content: JSON.stringify({
          title: 'Test',
          description: 'Test',
          estimatedMinutes: 10,
          content: {
            vocabulary: [{ word: 't', translation: 't', example: 'e' }],
            grammarNotes: ['g'],
            dialogue: [{ speaker: 's', text: 't', translation: 'tr' }],
            exercises: [{ id: '1', type: 't', prompt: 'p', correctAnswer: 'c', explanation: 'e' }],
            explainBetter: { concept: 'c', simpleExplanation: 's', analogy: 'a', nativeLanguageBridge: 'n' }
          },
          smartIntroduction: { whyThisLessonExists: 't', whyItIsImportant: 't', howItHelpsGoal: 't' },
          smartEnding: { whatImproved: 't', whatNeedsWork: 't', previewTomorrow: 't' },
          // pedagogicalDecision is intentionally missing to test fallback
          intelligentHomework: { title: 't', type: 'writing', description: 't', estimatedMinutes: 5 }
        }),
        provider: 'gemini'
      })
    } as unknown as AIRuntime;

    const fallbackAdapter = new RuntimeLessonGeneratorAiAdapter(missingDecisionAiRuntime);
    const lessonWithFallback = await fallbackAdapter.generateLesson('Spanish', 'Portuguese', 'Topic', 'B1');
    
    if (!lessonWithFallback.pedagogicalDecision) {
      throw new Error('Pedagogical decision should have been filled by deterministic fallback');
    }
    if (!lessonWithFallback.pedagogicalDecision.studentNeeds.includes('Topic')) {
      throw new Error('Deterministic fallback pedagogical decision is incorrect');
    }
    log('Successfully verified deterministic fallback for missing pedagogicalDecision');

    log('5. Testing AI_NOT_CONFIGURED preservation...');
    const unconfiguredAiRuntime = {
      execute: async () => {
        const err = new Error('AI Provider not configured');
        (err as any).code = 'AI_NOT_CONFIGURED';
        throw err;
      }
    } as unknown as AIRuntime;

    const unconfiguredAdapter = new RuntimeLessonGeneratorAiAdapter(unconfiguredAiRuntime);
    
    try {
      await unconfiguredAdapter.generateLesson('Spanish', 'Portuguese', 'Topic', 'B1');
      throw new Error('Should have thrown error for unconfigured AI');
    } catch (err: any) {
      if (err.code !== 'AI_NOT_CONFIGURED') throw new Error(`Expected AI_NOT_CONFIGURED, got ${err.code}`);
      log('Successfully preserved AI_NOT_CONFIGURED');
    }

    log('ALL LESSON MIGRATION TESTS PASSED!');
    return { passed: true, logs };
  } catch (err: any) {
    log(`TEST FAILED: ${err.message}`);
    return { passed: false, logs };
  }
}
