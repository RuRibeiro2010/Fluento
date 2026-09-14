import { AiPromptContextEntity } from '../entities/ai-prompt-context.entity';
import { ModelAlias } from '../value-objects/model-alias.vo';
import { PedagogicalDirective } from '../value-objects/pedagogical-directive.vo';

export class AiPromptFactory {
  public static createDefaultContext(teacherName = 'Prof. Sofia', level = 'A2'): AiPromptContextEntity {
    return AiPromptContextEntity.create(`ctx_${Date.now()}`, {
      systemInstructions: 'Atuar como mentora pedagógica de idiomas.',
      teacherPersonaName: teacherName,
      studentLevel: level,
      directive: PedagogicalDirective.create({
        correctionPatienceLevel: 'balanced',
        focusSkill: 'Fluência e gramática conversacional',
        maxSentenceLengthWords: 20,
        useSocraticQuestions: true,
      }),
      modelAlias: ModelAlias.create('gemini-3.6-flash'),
      temperature: 0.7,
    });
  }
}
