import { FrameworkLevelMapping, ProficiencyFramework } from '@/types/pedagogy';
import { CurriculumRegistry } from './curriculum';
import { CEFRLevel } from '@/types/brain';

export interface CurriculumScope {
  framework: ProficiencyFramework;
  levelCode: string;
  targetLanguage: string;
  nativeLanguage: string;
  focusArea: string;
}

/**
 * Curriculum Engine
 * Manages framework conversions, curriculum progression scope, and language agnostic standards.
 */
export class CurriculumEngine {
  /**
   * Resolves appropriate curriculum scope for any target language and framework
   */
  public resolveScope(
    targetLanguage: string,
    nativeLanguage: string,
    framework: ProficiencyFramework = 'CEFR',
    levelCode: string = 'B1',
    customFocus?: string
  ): {
    scope: CurriculumScope;
    mapping: FrameworkLevelMapping;
    cefrEquivalent: CEFRLevel;
  } {
    const mapping = CurriculumRegistry.getMapping(framework, levelCode);
    const cefrEquivalent = mapping.equivalentCefr;

    const focusArea = customFocus || `${mapping.title} Mastery in ${targetLanguage.toUpperCase()}`;

    return {
      scope: {
        framework,
        levelCode: mapping.levelCode,
        targetLanguage,
        nativeLanguage,
        focusArea,
      },
      mapping,
      cefrEquivalent,
    };
  }
}

export const defaultCurriculumEngine = new CurriculumEngine();
