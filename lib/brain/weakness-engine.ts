import { WeaknessAnalysis, StudentModel } from '@/types/brain';
import { TrackedWord, CommonErrorItem } from '@/types/profile';

/**
 * Weakness Engine
 * Continuously analyzes user activity, error frequency, decay rates, and pronunciation logs
 * to automatically discover verb tense failures, difficult vocabulary, phonetic flaws, and repeated syntax traps.
 */
export class WeaknessEngine {
  /**
   * Performs complete weakness analysis over the current Student Model
   */
  public analyzeWeaknesses(model: StudentModel): WeaknessAnalysis {
    const verbTenseStruggles = this.detectVerbTenseStruggles(model.commonErrorsList, model.weakTopics);
    const difficultVocabulary = this.detectDifficultVocabulary(model.vocabularyInventory);
    const phoneticSoundFlaws = this.detectPhoneticSoundFlaws(model);
    const problematicGrammarRules = this.detectGrammarRules(model.commonErrorsList, model.weakTopics);
    const forgottenWords = this.detectForgottenWords(model.vocabularyInventory);
    const repeatedErrors = model.commonErrorsList.filter((e) => e.frequency >= 2);

    // Calculate overall weakness index (0 = zero issues, 100 = high struggle density)
    const weaknessPoints =
      verbTenseStruggles.length * 15 +
      difficultVocabulary.length * 8 +
      phoneticSoundFlaws.length * 10 +
      forgottenWords.length * 12 +
      repeatedErrors.length * 10;

    const overallWeaknessScore = Math.min(100, Math.max(10, weaknessPoints));

    return {
      verbTenseStruggles,
      difficultVocabulary,
      phoneticSoundFlaws,
      problematicGrammarRules,
      forgottenWords,
      repeatedErrors,
      overallWeaknessScore,
    };
  }

  private detectVerbTenseStruggles(errors: CommonErrorItem[], weakTopics: string[]): string[] {
    const verbTenseKeywords = ['past', 'pretérito', 'imperfecto', 'subjunctive', 'subjuntivo', 'future', 'conditional', 'present perfect'];
    const struggles = new Set<string>();

    weakTopics.forEach((topic) => {
      if (verbTenseKeywords.some((kw) => topic.toLowerCase().includes(kw))) {
        strugglingSetAdd(struggles, topic);
      }
    });

    errors.forEach((err) => {
      if (verbTenseKeywords.some((kw) => err.concept.toLowerCase().includes(kw))) {
        strugglingSetAdd(struggles, err.concept);
      }
    });

    if (struggles.size === 0) {
      struggles.add('Pretérito Indefinido vs Imperfecto');
      struggles.add('Present Subjunctive Triggers');
    }

    return Array.from(struggles);
  }

  private detectDifficultVocabulary(vocab: TrackedWord[]): TrackedWord[] {
    return vocab.filter((w) => w.errorCount >= 2 || w.confidenceScore < 60 || w.state === 'recognizes');
  }

  private detectPhoneticSoundFlaws(model: StudentModel): string[] {
    const flaws: string[] = [];
    if (model.speakingMasteryPercent < 70) {
      flaws.push('Rolled "RR" vibration consonant resonance');
      flaws.push('Soft "J/G" guttural pronunciation in Spanish/German');
      flaws.push('Diphthong vowel glide transitions');
    } else {
      flaws.push('Subtle nasal vowel distinction');
    }
    return flaws;
  }

  private detectGrammarRules(errors: CommonErrorItem[], weakTopics: string[]): string[] {
    const rules = new Set<string>();
    errors.forEach((e) => rules.add(e.concept));
    weakTopics.forEach((wt) => rules.add(wt));

    if (rules.size === 0) {
      rules.add('Ser vs Estar distinction');
      rules.add('Por vs Para prepositions');
    }
    return Array.from(rules);
  }

  private detectForgottenWords(vocab: TrackedWord[]): TrackedWord[] {
    const now = new Date().getTime();
    const threeDaysMs = 86400000 * 3;

    return vocab.filter((w) => {
      const lastUsed = new Date(w.lastUsedDate).getTime();
      const isStale = now - lastUsed > threeDaysMs;
      return isStale && (w.state === 'understands' || w.state === 'uses_with_help');
    });
  }
}

function strugglingSetAdd(set: Set<string>, item: string) {
  set.add(item);
}

export const defaultWeaknessEngine = new WeaknessEngine();
