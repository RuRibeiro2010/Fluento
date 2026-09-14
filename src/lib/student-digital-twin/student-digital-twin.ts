/**
 * FLUENTO STUDENT DIGITAL TWIN - MAIN FACADE
 * 
 * Single source of truth for the Student Digital Twin state.
 * Manages profile lifecycle, partial mutations, snapshot persistence, telemetry recording,
 * and seamless export/import adapters for LearningEngine & SessionRuntime integration.
 * 
 * STRICT MANDATES:
 * - NO pedagogical decision logic.
 * - NO prompt generation logic.
 * - NO LLM or AI model interactions.
 * - NO direct UI coupling.
 */

import { StudentLearningState, MemoryThreadsContext } from '@/src/lib/learning-engine';
import {
  StudentDigitalTwinState,
  PartialStudentDigitalTwinState,
  TwinMutationEvent
} from './types';
import { identityProfileManager } from './identity-profile';
import { learningProfileManager } from './learning-profile';
import { languageProfileManager } from './language-profile';
import { emotionalProfileManager } from './emotional-profile';
import { behaviourProfileManager } from './behaviour-profile';
import { goalProfileManager } from './goal-profile';
import { memoryProfileManager } from './memory-profile';
import { recommendationProfileManager } from './recommendation-profile';
import { profileValidator } from './profile-validator';
import { profileMerger } from './profile-merger';
import { twinPersistenceAdapter } from './persistence-adapter';
import { twinTelemetry } from './telemetry';

export class StudentDigitalTwin {
  /**
   * Retrieves or initializes a Student Digital Twin by studentId.
   */
  public getOrCreateTwin(studentId: string, name?: string, email?: string): StudentDigitalTwinState {
    const existing = twinPersistenceAdapter.loadTwin(studentId);
    if (existing) {
      return existing;
    }

    const nowIso = new Date().toISOString();
    const newTwin: StudentDigitalTwinState = {
      identity: identityProfileManager.createDefaultIdentity(studentId, name, email),
      learning: learningProfileManager.createDefaultLearningProfile(),
      language: languageProfileManager.createDefaultLanguageProfile(),
      emotional: emotionalProfileManager.createDefaultEmotionalProfile(),
      behaviour: behaviourProfileManager.createDefaultBehaviourProfile(),
      goal: goalProfileManager.createDefaultGoalProfile(),
      memory: memoryProfileManager.createDefaultMemoryProfile(),
      recommendation: recommendationProfileManager.createDefaultRecommendationProfile(),
      revision: 1,
      lastUpdatedIso: nowIso
    };

    const validation = profileValidator.validateProfile(newTwin);
    if (!validation.isValid) {
      throw new Error(`Failed to create valid Digital Twin: ${validation.issues.join('; ')}`);
    }

    twinPersistenceAdapter.saveTwin(newTwin);
    return newTwin;
  }

  /**
   * Immutably updates twin profile with partial state changes.
   */
  public updateTwin(
    studentId: string,
    partial: PartialStudentDigitalTwinState
  ): StudentDigitalTwinState {
    const current = this.getOrCreateTwin(studentId);

    const partialValidation = profileValidator.validatePartialProfile(partial);
    if (!partialValidation.isValid) {
      throw new Error(`Invalid partial update: ${partialValidation.issues.join('; ')}`);
    }

    const updated = profileMerger.mergeProfiles(current, partial);

    const fullValidation = profileValidator.validateProfile(updated);
    if (!fullValidation.isValid) {
      throw new Error(`Merged profile failed validation: ${fullValidation.issues.join('; ')}`);
    }

    twinPersistenceAdapter.saveTwin(updated);

    // Record Telemetry Event
    const mutatedFields = Object.keys(partial);
    const event: TwinMutationEvent = {
      eventId: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      timestampIso: new Date().toISOString(),
      mutatedFields,
      previousRevision: current.revision,
      newRevision: updated.revision
    };
    twinTelemetry.recordMutation(event);

    return updated;
  }

  /**
   * Exports Digital Twin parameters as a `StudentLearningState` for Learning Engine & Session Runtime.
   */
  public exportToLearningState(studentId: string): StudentLearningState {
    const twin = this.getOrCreateTwin(studentId);

    return {
      studentId: twin.identity.studentId,
      currentCefr: twin.language.currentCefr,
      targetCefr: twin.goal.targetCefrGoal,
      framework: 'CEFR',
      frameworkLevel: {
        framework: 'CEFR',
        levelCode: twin.language.currentCefr,
        equivalentCefr: twin.language.currentCefr,
        title: `Nível ${twin.language.currentCefr}`,
        description: `Grau de proficiência ${twin.language.currentCefr} no Quadro Europeu Comum de Referência`
      },
      energyLevel: 8, // Peak operational baseline
      motivationLevel: 9,
      speakingAnxietyLevel: twin.emotional.baselineAnxietyLevel,
      confidenceScores: { ...twin.emotional.confidenceScores },
      fatigueScore: 10,
      availableMinutes: twin.recommendation.recommendedSessionDurationMinutes,
      daysSinceLastSession: 1,
      primaryGoal: twin.goal.primaryMotivation,
      preferredContext: twin.goal.professionalDomain
    };
  }

  /**
   * Exports MemoryProfile as a `MemoryThreadsContext` for Learning Engine & Prompt Builder.
   */
  public exportToMemoryThreads(studentId: string): MemoryThreadsContext {
    const twin = this.getOrCreateTwin(studentId);

    return {
      permanentSuccessMemories: [...twin.memory.permanentSuccessMemories],
      permanentTraumaOrBlocks: [...twin.memory.permanentTraumaOrBlocks],
      intermediateDecayingItemsCount: twin.memory.reviewItems.length,
      intermediateReviewItems: [...twin.memory.reviewItems],
      ephemeralSessionNotes: [...twin.memory.ephemeralSessionNotes]
    };
  }

  /**
   * Synchronizes post-session learning state and memory updates back into the Digital Twin.
   */
  public syncFromSessionEnd(
    studentId: string,
    updatedState: StudentLearningState,
    updatedThreads: MemoryThreadsContext
  ): StudentDigitalTwinState {
    return this.updateTwin(studentId, {
      language: {
        currentCefr: updatedState.currentCefr,
        targetCefr: updatedState.targetCefr
      },
      emotional: {
        baselineAnxietyLevel: updatedState.speakingAnxietyLevel,
        confidenceScores: { ...updatedState.confidenceScores }
      },
      memory: {
        permanentSuccessMemories: [...updatedThreads.permanentSuccessMemories],
        permanentTraumaOrBlocks: [...updatedThreads.permanentTraumaOrBlocks],
        reviewItems: [...updatedThreads.intermediateReviewItems],
        ephemeralSessionNotes: updatedThreads.ephemeralSessionNotes ? [...updatedThreads.ephemeralSessionNotes] : []
      },
      behaviour: {
        completedSessionsCount: (this.getOrCreateTwin(studentId).behaviour.completedSessionsCount || 0) + 1
      }
    });
  }

  /**
   * Creates an explicit immutable snapshot clone of the current Digital Twin.
   */
  public createSnapshot(studentId: string): StudentDigitalTwinState {
    const twin = this.getOrCreateTwin(studentId);
    return JSON.parse(JSON.stringify(twin));
  }
}

export const studentDigitalTwin = new StudentDigitalTwin();
