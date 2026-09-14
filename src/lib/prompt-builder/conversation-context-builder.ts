/**
 * FLUENTO PROMPT BUILDER - CONVERSATION CONTEXT BUILDER
 * 
 * Translates real-time Orchestrator directives (turn state, wait times,
 * recasting instructions, speaking ratios) into clean LLM context directives.
 */

import { ConversationContextSection } from './types';
import { OrchestratorActionDirective } from '@/src/lib/conversation-orchestrator';

export class ConversationContextBuilder {
  public buildSection(directive: OrchestratorActionDirective): ConversationContextSection {
    const recastingText = directive.recastingDirective.shouldCorrect
      ? `Aplica Recasting (${directive.recastingDirective.correctionType}): ${directive.recastingDirective.rationale}`
      : 'Sem correções necessárias neste turno.';

    const ratioText = `STT Atual: ${directive.speakingRatio.studentTalkTimeRatio}% (Meta: >60%). Recomendação: ${directive.speakingRatio.recommendation}`;

    return {
      currentTurnState: directive.currentTurnState,
      nextSpeaker: directive.nextSpeaker === 'student' ? 'Aluno (Aguardar fala do aluno)' : 'Professor (Emitir intervenção)',
      waitTimeInstruction: directive.waitTimeRemainingSeconds > 0
        ? `Aguardar ${directive.waitTimeRemainingSeconds.toFixed(1)}s de tempo de silêncio antes de responder.`
        : 'Tempo de espera cumprido. Livre para responder.',
      recastingDirectiveText: recastingText,
      speakingRatioStatus: ratioText
    };
  }
}

export const conversationContextBuilder = new ConversationContextBuilder();
