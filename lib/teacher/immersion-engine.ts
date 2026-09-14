import { CEFRLevel } from '@/types/brain';

export interface ImmersionRatio {
  targetPercent: number;
  nativePercent: number;
}

export interface ImmersionConfig {
  cefrLevel: CEFRLevel;
  targetLanguage: string;
  nativeLanguage: string;
}

/**
 * Immersion Engine
 * Controls target language vs native language ratio based on CEFR level.
 * A1: 40% target / 60% native
 * A2: 60% target / 40% native
 * B1: 80% target / 20% native
 * B2: 90% target / 10% native
 * C1/C2: 100% target / 0% native
 */
export class ImmersionEngine {
  /**
   * Calculates language ratio based strictly on CEFR level
   */
  public calculateRatio(cefrLevel: CEFRLevel): ImmersionRatio {
    switch (cefrLevel) {
      case 'A1':
        return { targetPercent: 40, nativePercent: 60 };
      case 'A2':
        return { targetPercent: 60, nativePercent: 40 };
      case 'B1':
        return { targetPercent: 80, nativePercent: 20 };
      case 'B2':
        return { targetPercent: 90, nativePercent: 10 };
      case 'C1':
      case 'C2':
      default:
        return { targetPercent: 100, nativePercent: 0 };
    }
  }

  /**
   * Formats speech output keeping the teacher preferably in targetLanguage
   * while adding necessary nativeLanguage support according to immersion ratio.
   */
  public applyImmersionScaffold(
    targetContent: string,
    nativeScaffold: string,
    config: ImmersionConfig,
    isHelpRequested: boolean = false
  ): string {
    const { cefrLevel } = config;
    const ratio = this.calculateRatio(cefrLevel);

    // If help is explicitly requested, native language takes temporary priority
    if (isHelpRequested) {
      return `${nativeScaffold}\n\n💬 *Back to ${config.targetLanguage.toUpperCase()}:* ${targetContent}`;
    }

    // For 100% target language (C1/C2), omit native scaffold entirely
    if (ratio.nativePercent === 0 || !nativeScaffold.trim()) {
      return targetContent;
    }

    // For lower levels, embed clean bilingual scaffold
    return `${targetContent}\n\n*(Scaffold in ${config.nativeLanguage.toUpperCase()}: ${nativeScaffold})*`;
  }
}

export const defaultImmersionEngine = new ImmersionEngine();
