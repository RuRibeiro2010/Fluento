/**
 * FLUENTO STUDENT DIGITAL TWIN - PROFILE VALIDATOR
 * 
 * Validates structural integrity, score ranges, and enum values of Student Digital Twin profiles.
 */

import { StudentDigitalTwinState, PartialStudentDigitalTwinState, ProfileValidationResult } from './types';

export class ProfileValidator {
  public validateProfile(state: StudentDigitalTwinState): ProfileValidationResult {
    const issues: string[] = [];

    // Identity validation
    if (!state.identity || !state.identity.studentId) {
      issues.push('Missing or invalid studentId in IdentityProfile');
    }

    // Language validation
    if (state.language) {
      if (state.language.grammarMasteryScore < 0 || state.language.grammarMasteryScore > 100) {
        issues.push('grammarMasteryScore out of bounds [0, 100]');
      }
      if (state.language.pronunciationScore < 0 || state.language.pronunciationScore > 100) {
        issues.push('pronunciationScore out of bounds [0, 100]');
      }
    }

    // Emotional validation
    if (state.emotional) {
      if (state.emotional.baselineAnxietyLevel < 0 || state.emotional.baselineAnxietyLevel > 100) {
        issues.push('baselineAnxietyLevel out of bounds [0, 100]');
      }
      if (state.emotional.confidenceScores) {
        const { speaking, listening, vocabulary, grammar, pronunciation } = state.emotional.confidenceScores;
        [speaking, listening, vocabulary, grammar, pronunciation].forEach((score, idx) => {
          if (score < 0 || score > 100) {
            issues.push(`confidenceScore at index ${idx} out of bounds [0, 100]`);
          }
        });
      }
    }

    // Behaviour validation
    if (state.behaviour) {
      if (state.behaviour.avgTalkTimeRatio < 0 || state.behaviour.avgTalkTimeRatio > 1) {
        issues.push('avgTalkTimeRatio out of bounds [0.0, 1.0]');
      }
      if (state.behaviour.dropoffRiskScore < 0 || state.behaviour.dropoffRiskScore > 100) {
        issues.push('dropoffRiskScore out of bounds [0, 100]');
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  public validatePartialProfile(partial: PartialStudentDigitalTwinState): ProfileValidationResult {
    const issues: string[] = [];

    if (partial.language && partial.language.grammarMasteryScore !== undefined) {
      if (partial.language.grammarMasteryScore < 0 || partial.language.grammarMasteryScore > 100) {
        issues.push('Partial grammarMasteryScore out of bounds [0, 100]');
      }
    }

    if (partial.emotional && partial.emotional.baselineAnxietyLevel !== undefined) {
      if (partial.emotional.baselineAnxietyLevel < 0 || partial.emotional.baselineAnxietyLevel > 100) {
        issues.push('Partial baselineAnxietyLevel out of bounds [0, 100]');
      }
    }

    if (partial.behaviour && partial.behaviour.avgTalkTimeRatio !== undefined) {
      if (partial.behaviour.avgTalkTimeRatio < 0 || partial.behaviour.avgTalkTimeRatio > 1) {
        issues.push('Partial avgTalkTimeRatio out of bounds [0.0, 1.0]');
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

export const profileValidator = new ProfileValidator();
