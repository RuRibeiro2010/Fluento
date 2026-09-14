/**
 * FLUENTO SESSION RUNTIME - TURN EXECUTOR
 * 
 * Orchestrates a single turn cycle across:
 * 1. Conversation Orchestrator (evaluates events, wait times, recasting)
 * 2. Prompt Builder (translates pedagogical state into LLM prompt)
 * 3. AI Runtime (executes model generation with fallback/retry)
 * 4. Response Processor (sanitizes model response)
 * 5. Memory & Progress Updaters (syncs state)
 */

import { SessionSnapshot, TurnRecord, ProcessTurnResult } from './types';
import { conversationOrchestrator, TurnEvent, OrchestratorContext } from '@/src/lib/conversation-orchestrator';
import { promptBuilder, PromptBuilderInput } from '@/src/lib/prompt-builder';
import { aiRuntime, ModelRequest } from '@/src/lib/ai-runtime';
import { responseProcessor } from './response-processor';
import { memoryUpdater } from './memory-updater';
import { progressUpdater } from './progress-updater';

export class TurnExecutor {
  /**
   * Executes a complete turn cycle for an active session snapshot.
   */
  public async executeTurn(
    snapshot: SessionSnapshot,
    studentInputText?: string,
    audioDurationSeconds: number = 0,
    turnEventType: TurnEvent['eventType'] = 'speech_ended'
  ): Promise<ProcessTurnResult> {
    const turnNumber = snapshot.turns.length + 1;
    const turnId = `turn_${snapshot.sessionId}_${turnNumber}`;

    // 1. Build TurnEvent for Orchestrator
    const turnEvent: TurnEvent = {
      eventId: `ev_${turnId}`,
      timestampIso: new Date().toISOString(),
      speaker: 'student',
      eventType: turnEventType,
      rawTextSample: studentInputText,
      durationSeconds: audioDurationSeconds
    };

    // 2. Process event with Conversation Orchestrator
    const orchestratorContext: OrchestratorContext = {
      lesson: snapshot.lesson,
      studentState: snapshot.studentState,
      activeBlockIndex: snapshot.activeBlockIndex
    };

    const directive = conversationOrchestrator.processEvent(
      turnEvent,
      orchestratorContext,
      snapshot.activeBlockIndex
    );

    // 3. Assemble Prompt with Prompt Builder
    const promptInput: PromptBuilderInput = {
      studentState: snapshot.studentState,
      memoryThreads: snapshot.memoryThreads,
      lesson: snapshot.lesson,
      activeBlockIndex: snapshot.activeBlockIndex,
      orchestratorDirective: directive,
      provider: 'gemini'
    };

    const promptResult = promptBuilder.buildPrompt(promptInput);

    // 4. Execute prompt via AI Runtime
    const modelRequest: ModelRequest = {
      requestId: `req_${turnId}`,
      prompt: studentInputText ? `Aluno disse: "${studentInputText}"` : 'Aluno aguarda intervenção inicial do professor.',
      systemInstruction: promptResult.systemPrompt,
      temperature: 0.7,
      maxTokens: 500,
      sessionId: snapshot.sessionId,
      studentId: snapshot.studentId,
      providerPreference: ['gemini', 'openai', 'anthropic']
    };

    const modelResponse = await aiRuntime.execute(modelRequest);

    // 5. Clean & process teacher response text
    const teacherResponseText = responseProcessor.processModelResponse(modelResponse);

    // 6. Update Memory & Progress
    const updatedMemoryThreads = memoryUpdater.updateMemoryThreads(
      snapshot.memoryThreads,
      studentInputText,
      directive
    );

    const updatedStudentState = progressUpdater.updateProgress(
      snapshot.studentState,
      directive,
      audioDurationSeconds
    );

    // 7. Create Turn Record
    const turnRecord: TurnRecord = {
      turnId,
      turnNumber,
      speaker: 'student',
      text: studentInputText || '[Silêncio/Aguardando]',
      timestampIso: new Date().toISOString(),
      durationSeconds: audioDurationSeconds,
      orchestratorDirective: directive,
      assembledPrompt: promptResult,
      modelResponse
    };

    const teacherTurnRecord: TurnRecord = {
      turnId: `${turnId}_teacher`,
      turnNumber: turnNumber + 1,
      speaker: 'teacher',
      text: teacherResponseText,
      timestampIso: new Date().toISOString()
    };

    // 8. Update Snapshot
    snapshot.turns.push(turnRecord, teacherTurnRecord);
    snapshot.studentState = updatedStudentState;
    snapshot.memoryThreads = updatedMemoryThreads;
    snapshot.totalStudentTalkTimeSeconds += audioDurationSeconds;
    snapshot.totalTeacherTalkTimeSeconds += Math.ceil(teacherResponseText.length / 15); // est ~15 chars/sec speech
    snapshot.lastActiveTimeIso = new Date().toISOString();
    snapshot.checkpointStateIso = new Date().toISOString();

    return {
      sessionId: snapshot.sessionId,
      turnNumber: snapshot.turns.length,
      teacherResponseText,
      nextTurnState: directive.currentTurnState,
      directive,
      promptResult,
      modelResponse,
      sessionSnapshot: snapshot
    };
  }
}

export const turnExecutor = new TurnExecutor();
