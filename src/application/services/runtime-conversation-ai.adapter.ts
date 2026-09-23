import { IConversationAiService } from '../contracts/ai.contract';
import { 
  StudentMinimalContextDTO, 
  LessonSessionContextDTO 
} from '../dto/conversation.dtos';
import { AIRuntime } from '../../lib/ai-runtime/ai-runtime';
import { SupportedProvider } from '../../lib/ai-runtime/types';
import { conversationPromptBuilder } from './conversation-prompt-builder.service';

/**
 * RUNTIME CONVERSATION AI ADAPTER
 * 
 * Migrates Lesson Conversation AI responsibility to the modern AI Runtime.
 * Handles prompt construction via conversationPromptBuilder and executes
 * via AIRuntime with support for streaming.
 */
export class RuntimeConversationAiAdapter implements IConversationAiService {
  constructor(private readonly aiRuntime: AIRuntime) {}

  public async generateGreeting(
    student: StudentMinimalContextDTO,
    lesson: LessonSessionContextDTO,
    sessionId: string
  ): Promise<string> {
    const promptData = conversationPromptBuilder.buildGreetingPrompt(student, lesson);

    const response = await this.aiRuntime.execute({
      prompt: promptData.prompt,
      systemInstruction: promptData.systemInstruction,
      temperature: 0.7,
      maxTokens: 250,
      sessionId,
      studentId: student.studentId,
      providerPreference: ['gemini', 'openai'] as SupportedProvider[],
    });

    return response.content;
  }

  public async generateResponse(
    student: StudentMinimalContextDTO,
    lesson: LessonSessionContextDTO,
    studentUtterance: string,
    sessionId: string,
    onStreamChunk?: (delta: string) => void
  ): Promise<string> {
    const promptData = conversationPromptBuilder.buildTurnPrompt(
      student, 
      lesson, 
      studentUtterance
    );

    const request = {
      prompt: promptData.prompt,
      systemInstruction: promptData.systemInstruction,
      temperature: 0.7,
      maxTokens: 300,
      sessionId,
      studentId: student.studentId,
      providerPreference: ['gemini', 'openai'] as SupportedProvider[],
    };

    if (onStreamChunk) {
      const response = await this.aiRuntime.executeStream(request, (chunk) => {
        if (chunk.delta) {
          onStreamChunk(chunk.delta);
        }
      });
      return response.content;
    } else {
      const response = await this.aiRuntime.execute(request);
      return response.content;
    }
  }
}
