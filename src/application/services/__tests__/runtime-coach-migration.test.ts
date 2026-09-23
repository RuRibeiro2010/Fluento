
import { RuntimeCoachAiAdapter } from '../runtime-coach-ai.adapter';
import { AIRuntime } from '@/src/lib/ai-runtime/ai-runtime';
import { ICoachAiService } from '../../contracts/ai.contract';

export async function runRuntimeCoachMigrationTests(): Promise<{ passed: boolean; logs: string[] }> {
  const logs: string[] = [];
  const log = (msg: string) => logs.push(`[COACH-MIGRATION-TEST] ${msg}`);

  try {
    log('1. Setting up mocks for AI Runtime and Legacy Fallback...');
    
    let aiRuntimeCalled = false;
    let lastPrompt = '';
    
    const mockAiRuntime = {
      execute: async (req: any) => {
        aiRuntimeCalled = true;
        lastPrompt = req.prompt;
        
        // Return a valid JSON response for Weekly Review
        if (req.systemInstruction.includes('Sunday Weekly Review')) {
          return {
            content: JSON.stringify({
              id: 'test-weekly-review',
              weekNumber: 1,
              dateRange: 'Mock Date Range',
              achievements: ['Achievement 1'],
              weaknessesIdentified: ['Weakness 1'],
              completedGoals: ['Goal 1'],
              nextWeekPlan: ['Next Week Plan 1'],
              coachPersonalNote: 'Mock Note'
            }),
            provider: 'gemini',
            modelName: 'gemini-pro',
            promptTokens: 10,
            completionTokens: 20,
            totalTokens: 30,
            estimatedCostUsd: 0.001,
            latencyMs: 100,
            attempts: 1,
            timestampIso: new Date().toISOString()
          };
        }

        // Return a valid JSON response for Study Plan
        if (req.systemInstruction.includes('Study Plan')) {
          return {
            content: JSON.stringify({
              title: 'Mastering Spanish',
              goal: 'Be fluent',
              currentLevel: 'A1',
              estimatedWeeks: 10,
              modules: [
                { title: 'Intro', description: 'Basics', focus: 'Vocabulary', totalLessons: 5 }
              ]
            }),
            provider: 'openai'
          };
        }
        
        // Return a valid JSON response for Daily Message
        return {
          content: JSON.stringify({
            greeting: 'Hello',
            advice: 'Keep going',
            focusSkill: 'vocabulary',
            recommendedAction: 'Do more',
            motivationQuote: 'Nice',
            tone: 'encouraging'
          }),
          provider: 'gemini'
        };
      }
    } as unknown as AIRuntime;

    const adapter = new RuntimeCoachAiAdapter(mockAiRuntime);

    log('2. Testing generateSundayWeeklyReview (Migrated)...');
    const profile = { id: 'user123', email: 'test@example.com', coach_personality: 'encouraging' };
    const memory = { userId: 'user123', totalPracticeMinutes: 100 } as any;
    
    const review = await adapter.generateSundayWeeklyReview(profile, memory);
    
    if (!aiRuntimeCalled) throw new Error('AI Runtime was not called for Weekly Review');
    if (review.id !== 'test-weekly-review') throw new Error('Incorrect Weekly Review ID returned');

    log('3. Testing generateDailyCoachMessage (Already Migrated)...');
    aiRuntimeCalled = false;
    await adapter.generateDailyCoachMessage(profile, memory);
    if (!aiRuntimeCalled) throw new Error('AI Runtime was not called for Daily Message');

    log('4. Testing generateStudyPlan (Now Migrated)...');
    aiRuntimeCalled = false;
    const plan = await adapter.generateStudyPlan(profile, 'Spanish', 'Portuguese');
    if (!aiRuntimeCalled) throw new Error('AI Runtime was NOT called for Study Plan');
    if (plan.title !== 'Mastering Spanish') throw new Error('Incorrect Study Plan title');
    if (!plan.id.startsWith('plan-')) throw new Error('Study Plan ID should be deterministic-ish');
    if (plan.modules[0].completedCount !== 0) throw new Error('Initial completedCount must be 0');

    log('5. Testing generateMonthlyEvolutionData (Deterministic Service)...');
    aiRuntimeCalled = false;
    const evolution = adapter.generateMonthlyEvolutionData(profile, memory);
    if (aiRuntimeCalled) throw new Error('AI Runtime was called for non-migrated Monthly Evolution');
    if (!evolution || !evolution.userId) throw new Error('Monthly Evolution data was not returned correctly');

    log('6. Testing AI_NOT_CONFIGURED preservation...');
    const unconfiguredAiRuntime = {
      execute: async () => {
        const err = new Error('AI Provider not configured');
        (err as any).code = 'AI_NOT_CONFIGURED';
        throw err;
      }
    } as unknown as AIRuntime;

    const unconfiguredAdapter = new RuntimeCoachAiAdapter(unconfiguredAiRuntime);
    
    try {
      await unconfiguredAdapter.generateSundayWeeklyReview(profile, memory);
      throw new Error('Should have thrown error for unconfigured AI');
    } catch (err: any) {
      if (err.code !== 'AI_NOT_CONFIGURED') throw new Error(`Expected AI_NOT_CONFIGURED, got ${err.code}`);
    }

    log('ALL COACH MIGRATION TESTS PASSED!');
    return { passed: true, logs };
  } catch (err: any) {
    log(`TEST FAILED: ${err.message}`);
    return { passed: false, logs };
  }
}
