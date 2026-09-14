import { CEFRLevel } from '@/types/brain';

export interface HelpRequestPayload {
  concept: string;
  studentDoubtText?: string;
  targetLanguage: string;
  nativeLanguage: string;
  cefrLevel: CEFRLevel;
  triggerType: 'student_doubt' | 'explain_better_button' | 'proactive_check';
}

export interface HelpResponse {
  nativeExplanation: string;
  analogy?: string;
  nativeComparison?: string;
  simpleExample: string;
  returnToTargetMessage: string;
  fullFormattedText: string;
}

/**
 * Help Engine
 * Manages student comprehension checks and "Explain Better" requests.
 * Explains in native language with analogies & simple examples, then IMMEDIATELY returns to target language.
 */
export class HelpEngine {
  private checkPhrases: string[] = [
    'Did you understand this part?',
    'Would you like another example?',
    'Should I explain that differently?',
    'How does that feel? Ready to try one together?',
  ];

  /**
   * Generates a natural proactive comprehension check question.
   */
  public generateComprehensionCheck(): string {
    const idx = Math.floor(Math.random() * this.checkPhrases.length);
    return this.checkPhrases[idx];
  }

  /**
   * Processes an "Explain Better" request or detected student doubt.
   * Uses native language, simple examples, analogies, native comparisons,
   * answering ONLY what is necessary, then returning to targetLanguage.
   */
  public processHelpRequest(payload: HelpRequestPayload): HelpResponse {
    const { concept, studentDoubtText, targetLanguage, nativeLanguage } = payload;

    const nativeExplanation = `Em ${nativeLanguage.toUpperCase()}: "${concept}" funciona como um conector visual no contexto do que estamos a praticar.`;
    const analogy = `Pensa nisto como um interruptor de luz: só ativa quando a ação está a acontecer no momento.`;
    const nativeComparison = `Na tua língua nativa (${nativeLanguage}), isto é equivalente a trocar "eu sou" por "eu estou".`;
    const simpleExample = `Exemplo simples: "${concept} -> Hoy practico."`;
    
    const returnToTargetMessage = `Now let's jump straight back into ${targetLanguage.toUpperCase()}! Try saying a sentence with this word!`;

    const fullFormattedText = [
      `💡 **Explicação Direta (${nativeLanguage.toUpperCase()}):**`,
      nativeExplanation,
      `✨ **Analogia:** ${analogy}`,
      `🔄 **Comparação:** ${nativeComparison}`,
      `📝 **Exemplo Prático:** ${simpleExample}`,
      ``,
      `🚀 **Vamos voltar ao ${targetLanguage.toUpperCase()}:**`,
      returnToTargetMessage,
    ].join('\n');

    return {
      nativeExplanation,
      analogy,
      nativeComparison,
      simpleExample,
      returnToTargetMessage,
      fullFormattedText,
    };
  }

  /**
   * Handler for permanent "Explain Better" button trigger in UI
   */
  public handleExplainBetter(
    lastTopicOrSentence: string,
    targetLanguage: string,
    nativeLanguage: string,
    cefrLevel: CEFRLevel
  ): HelpResponse {
    return this.processHelpRequest({
      concept: lastTopicOrSentence || 'O último conceito apresentado',
      targetLanguage,
      nativeLanguage,
      cefrLevel,
      triggerType: 'explain_better_button',
    });
  }
}

export const defaultHelpEngine = new HelpEngine();
