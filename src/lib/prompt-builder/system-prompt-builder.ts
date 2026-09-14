/**
 * FLUENTO PROMPT BUILDER - SYSTEM PROMPT BUILDER
 * 
 * Combines all individual context sections (Teacher, Student, Lesson, Conversation, Memory, Safety)
 * into a structured, highly organized System Prompt formatted for LLMs.
 */

import { PromptContextPackage, SupportedModelProvider } from './types';

export class SystemPromptBuilder {
  /**
   * Generates a complete system prompt string from a PromptContextPackage.
   */
  public buildSystemPrompt(pkg: PromptContextPackage, provider: SupportedModelProvider = 'generic'): string {
    const { teacherSection, studentSection, lessonSection, conversationSection, memorySection, safetySection } = pkg;

    const sections: string[] = [];

    // 1. Identity & Role
    sections.push(`# DIRETA DE IDENTIDADE DO PROFESSOR FLUENTO
${teacherSection.roleIdentity}

## Tom e Empatia
${teacherSection.toneAndEmpathyGuidelines}`);

    // 2. Core Pedagogical Rules & Forbidden Behaviours
    sections.push(`## Regras Pedagógicas Cardinais
${teacherSection.corePedagogicalRules.map(r => `- ${r}`).join('\n')}

## Comportamentos Estritamente Proibidos
${teacherSection.forbiddenBehaviours.map(f => `- ${f}`).join('\n')}`);

    // 3. Student Profile & Affective State
    sections.push(`## Perfil e Estado do Aluno
- **Resumo**: ${studentSection.studentProfileSummary}
- **Nível Proficiência**: ${studentSection.currentCefrLevel}
- **Estado Emocional**: ${studentSection.emotionalStateAndAnxiety}
- **Objetivos**: ${studentSection.primaryGoalsAndInterests.join(', ')}`);

    // 4. Current Lesson Block
    sections.push(`## Contexto da Lição Ativa
- **Bloco**: ${lessonSection.activeBlockTitle}
- **Objetivo**: ${lessonSection.activeBlockObjective}
- **Padrão de Interação**: ${lessonSection.interactionPattern}
- **Scaffolding**: ${lessonSection.scaffoldingLevel}
- **Meta de Fala**: ${lessonSection.targetStudentTalkTimeRatio}`);

    // 5. Turn Orchestration & Recasting
    sections.push(`## Diretivas do Módulo de Orquestração
- **Próximo a Falar**: ${conversationSection.nextSpeaker}
- **Tempo de Espera**: ${conversationSection.waitTimeInstruction}
- **Diretiva de Recasting**: ${conversationSection.recastingDirectiveText}
- **Indicador de Talk Time**: ${conversationSection.speakingRatioStatus}`);

    // 6. Memory & SRS Threads
    if (memorySection.scheduledReviewItemsText.length > 0 || memorySection.permanentTraumasAndBlocks.length > 0) {
      const memoryLines: string[] = [];
      if (memorySection.scheduledReviewItemsText.length > 0) {
        memoryLines.push(`- **Revisões Espaçadas (SRS)**: ${memorySection.scheduledReviewItemsText.join('; ')}`);
      }
      if (memorySection.permanentTraumasAndBlocks.length > 0) {
        memoryLines.push(`- **Tópicos Sensíveis a Evitar**: ${memorySection.permanentTraumasAndBlocks.join('; ')}`);
      }
      sections.push(`## Memória de Aprendizagem\n${memoryLines.join('\n')}`);
    }

    // 7. Safety & Affective Filter
    sections.push(`## Protocolos de Segurança Afetiva
${safetySection.affectiveFilterProtectionRules.map(p => `- ${p}`).join('\n')}
- **Protocolo de Emergência**: ${safetySection.emergencyDeescalationProtocol}`);

    return sections.join('\n\n');
  }
}

export const systemPromptBuilder = new SystemPromptBuilder();
