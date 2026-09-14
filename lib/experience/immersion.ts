import { CEFRLevel } from '@/types/brain';
import { ImmersionModeState } from '@/types/experience';

/**
 * Immersion Mode Service
 * Controls full target language UI immersion, dynamic label translation maps,
 * and temporary native scaffolding triggers with instant return to target language.
 */
export class ImmersionService {
  private state: ImmersionModeState;

  constructor(
    targetLanguage: string = 'es',
    nativeLanguage: string = 'en',
    cefrLevel: CEFRLevel = 'B1'
  ) {
    this.state = {
      isFullImmersionActive: true,
      targetLanguage,
      nativeLanguage,
      cefrLevel,
      targetUiLabels: this.generateUiLabels(targetLanguage),
      nativeUiLabels: this.generateUiLabels(nativeLanguage),
    };
  }

  public setFullImmersion(active: boolean): void {
    this.state.isFullImmersionActive = active;
  }

  public getImmersionState(): ImmersionModeState {
    return { ...this.state };
  }

  /**
   * Translates common UI labels based on immersion toggle
   */
  public getLabel(labelKey: string): string {
    if (this.state.isFullImmersionActive) {
      return this.state.targetUiLabels[labelKey] || labelKey;
    }
    return this.state.nativeUiLabels[labelKey] || labelKey;
  }

  /**
   * Generates localized UI labels map for target or native language
   */
  private generateUiLabels(lang: string): Record<string, string> {
    const l = lang.toLowerCase();
    if (l === 'es' || l === 'spanish') {
      return {
        dashboard: 'Panel Principal',
        start_lesson: 'Comenzar Lección',
        explain_better: 'Explicar Mejor',
        progress: 'Progreso',
        review: 'Repaso Inteligente',
        settings: 'Ajustes',
        coach_advice: 'Consejo del Coach',
      };
    }
    if (l === 'pt' || l === 'portuguese') {
      return {
        dashboard: 'Painel Principal',
        start_lesson: 'Iniciar Aula',
        explain_better: 'Explicar Melhor',
        progress: 'Progresso',
        review: 'Revisão Inteligente',
        settings: 'Definições',
        coach_advice: 'Conselho do Coach',
      };
    }
    return {
      dashboard: 'Dashboard',
      start_lesson: 'Start Lesson',
      explain_better: 'Explain Better',
      progress: 'Progress',
      review: 'Smart Review',
      settings: 'Settings',
      coach_advice: 'Coach Advice',
    };
  }

  /**
   * Handles student help request or doubt, producing native explanation followed by mandatory return to target language.
   */
  public handleNativeFallback(
    doubtContext: string,
    targetExplanation: string,
    nativeExplanation: string
  ): {
    formattedResponse: string;
    shouldReturnToTarget: boolean;
  } {
    const targetCap = this.state.targetLanguage.toUpperCase();
    const nativeCap = this.state.nativeLanguage.toUpperCase();

    const formattedResponse = [
      `💡 *Explicación en ${nativeCap}:* ${nativeExplanation}`,
      ``,
      `💬 *¡Regresando inmediatamente a ${targetCap}!*`,
      `${targetExplanation}`,
    ].join('\n');

    return {
      formattedResponse,
      shouldReturnToTarget: true,
    };
  }
}

export const defaultImmersionService = new ImmersionService();
