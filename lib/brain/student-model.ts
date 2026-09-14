import { StudentModel, CEFRLevel } from '@/types/brain';
import { TrackedWord, CommonErrorItem, VocabularyState } from '@/types/profile';
import { StudentDigitalTwinEngine } from '@/lib/twin/student-digital-twin';

/**
 * Student Model Engine
 * Maintains a deep, permanent internal model of the learner's competencies,
 * psychological mindset, active vs passive vocabulary, and personalization attributes.
 */
export class StudentModelEngine {
  private model: StudentModel;

  constructor(initialData?: Partial<StudentModel>) {
    this.model = {
      userId: initialData?.userId || 'usr_guest',
      currentCefr: initialData?.currentCefr || 'A2',
      nativeLanguage: initialData?.nativeLanguage || 'en',
      targetLanguage: initialData?.targetLanguage || 'es',

      // Independent Skill Competencies (%)
      grammarMasteryPercent: initialData?.grammarMasteryPercent ?? 74,
      vocabularyMasteryPercent: initialData?.vocabularyMasteryPercent ?? 68,
      listeningMasteryPercent: initialData?.listeningMasteryPercent ?? 62,
      speakingMasteryPercent: initialData?.speakingMasteryPercent ?? 58,
      readingMasteryPercent: initialData?.readingMasteryPercent ?? 85,
      writingMasteryPercent: initialData?.writingMasteryPercent ?? 65,

      // Longitudinal Mindset Metrics
      confidenceScore: initialData?.confidenceScore ?? 72,
      learningSpeed: initialData?.learningSpeed || 'steady',
      motivationScore: initialData?.motivationScore ?? 85,
      consistencyScore: initialData?.consistencyScore ?? 80,
      burnoutIndex: initialData?.burnoutIndex ?? 15,

      // Preferences & Context
      preferredTopics: initialData?.preferredTopics || ['Travel', 'Coffee & Dining', 'Tech & Business'],
      learningStyle: initialData?.learningStyle || 'auditory',
      teacherPersonality: initialData?.teacherPersonality || 'encouraging',
      preferredSessionLengthMinutes: initialData?.preferredSessionLengthMinutes ?? 15,
      currentFocusArea: initialData?.currentFocusArea || 'Past Tenses & Conversational Fluency',
      weakTopics: initialData?.weakTopics || ['Subjunctive Mood', 'Past Irregular Verbs', 'Prepositions por/para'],
      strongTopics: initialData?.strongTopics || ['Present Tense Regular', 'Ordering Food', 'Basic Greetings'],

      // Deep Personalization
      objectives: initialData?.objectives || ['Travel with confidence', 'Career advancement', 'Make local friends'],
      hobbies: initialData?.hobbies || ['Coffee roasting', 'Photography', 'Hiking', 'Coding'],
      interests: initialData?.interests || ['Technology', 'Gastronomy', 'World Literature'],
      profession: initialData?.profession || 'Software Engineer',
      age: initialData?.age || 29,
      reasonsToLearn: initialData?.reasonsToLearn || ['Trip to Spain in 3 months', 'Work remote from Lisbon'],
      preferredTimeOfDay: initialData?.preferredTimeOfDay || 'evening',
      humorStyle: initialData?.humorStyle || 'witty',

      // Vocabulary Inventory with Active/Passive State Progression
      vocabularyInventory: initialData?.vocabularyInventory || [
        {
          id: 'w1',
          word: 'estacionamiento',
          translation: 'parking lot',
          state: 'understands',
          errorCount: 2,
          timesUsedCorrectly: 3,
          lastUsedDate: new Date().toISOString(),
          confidenceScore: 55,
          categoryTag: 'travel',
        },
        {
          id: 'w2',
          word: 'quisiera',
          translation: 'I would like',
          state: 'uses_naturally',
          errorCount: 0,
          timesUsedCorrectly: 12,
          lastUsedDate: new Date().toISOString(),
          confidenceScore: 95,
          categoryTag: 'dining',
        },
        {
          id: 'w3',
          word: 'desarrollar',
          translation: 'to develop',
          state: 'uses_with_help',
          errorCount: 1,
          timesUsedCorrectly: 4,
          lastUsedDate: new Date().toISOString(),
          confidenceScore: 70,
          categoryTag: 'business',
        },
      ],

      // Common Errors Inventory
      commonErrorsList: initialData?.commonErrorsList || [
        {
          id: 'e1',
          concept: 'Ser vs Estar for temporary states',
          category: 'grammar',
          frequency: 4,
          lastOccurred: new Date().toISOString(),
          examples: ['Saying "soy cansado" instead of "estoy cansado"'],
        },
        {
          id: 'e2',
          concept: 'Preposition "por" vs "para" for purpose',
          category: 'syntax',
          frequency: 3,
          lastOccurred: new Date().toISOString(),
          examples: ['Saying "gracias para la ayuda" instead of "por la ayuda"'],
        },
      ],

      lastActivityTimestamp: initialData?.lastActivityTimestamp || new Date().toISOString(),
    };
  }

  public getModel(): StudentModel {
    return { ...this.model };
  }

  public updateModel(patch: Partial<StudentModel>): StudentModel {
    this.model = {
      ...this.model,
      ...patch,
      lastActivityTimestamp: new Date().toISOString(),
    };
    return { ...this.model };
  }

  /**
   * Evaluates and updates active vs passive state of a word.
   * Transition ladder: recognizes -> understands -> uses_with_help -> uses_naturally
   */
  public updateWordState(wordText: string, translation: string, usedCorrectlyInContext: boolean): TrackedWord {
    const existingIndex = this.model.vocabularyInventory.findIndex(
      (w) => w.word.toLowerCase() === wordText.toLowerCase()
    );

    let wordItem: TrackedWord;

    if (existingIndex >= 0) {
      const existing = this.model.vocabularyInventory[existingIndex];
      const timesUsed = existing.timesUsedCorrectly + (usedCorrectlyInContext ? 1 : 0);
      const errors = existing.errorCount + (usedCorrectlyInContext ? 0 : 1);

      let newState: VocabularyState = existing.state;

      if (usedCorrectlyInContext) {
        if (existing.state === 'recognizes') newState = 'understands';
        else if (existing.state === 'understands' && timesUsed >= 3) newState = 'uses_with_help';
        else if (existing.state === 'uses_with_help' && timesUsed >= 6) newState = 'uses_naturally';
      } else {
        if (errors >= 3 && existing.state === 'uses_naturally') newState = 'uses_with_help';
        else if (errors >= 4 && existing.state === 'uses_with_help') newState = 'understands';
      }

      const confidenceScore = Math.min(100, Math.max(0, Math.round((timesUsed / (timesUsed + errors || 1)) * 100)));

      wordItem = {
        ...existing,
        state: newState,
        timesUsedCorrectly: timesUsed,
        errorCount: errors,
        confidenceScore,
        lastUsedDate: new Date().toISOString(),
      };

      this.model.vocabularyInventory[existingIndex] = wordItem;
    } else {
      const initialState: VocabularyState = usedCorrectlyInContext ? 'understands' : 'recognizes';
      wordItem = {
        id: `word-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        word: wordText,
        translation,
        state: initialState,
        errorCount: usedCorrectlyInContext ? 0 : 1,
        timesUsedCorrectly: usedCorrectlyInContext ? 1 : 0,
        lastUsedDate: new Date().toISOString(),
        confidenceScore: usedCorrectlyInContext ? 70 : 30,
      };

      this.model.vocabularyInventory.push(wordItem);
    }

    // Re-evaluate vocabulary mastery percentage
    this.recalculateMasteries();
    return wordItem;
  }

  /**
   * Recalculates competency percentages independently for each of the 6 skills
   */
  public recalculateMasteries(): void {
    const words = this.model.vocabularyInventory;
    const naturallyUsedCount = words.filter((w) => w.state === 'uses_naturally').length;
    const TotalWords = words.length || 1;

    // Vocabulary mastery calculation based on percentage of naturally used words
    this.model.vocabularyMasteryPercent = Math.min(
      98,
      Math.max(20, Math.round((naturallyUsedCount / TotalWords) * 70 + 30))
    );

    // Recalculate CEFR overall estimate
    const avgCompetency = Math.round(
      (this.model.grammarMasteryPercent +
        this.model.vocabularyMasteryPercent +
        this.model.listeningMasteryPercent +
        this.model.speakingMasteryPercent +
        this.model.readingMasteryPercent +
        this.model.writingMasteryPercent) /
        6
    );

    if (avgCompetency >= 92) this.model.currentCefr = 'C2';
    else if (avgCompetency >= 84) this.model.currentCefr = 'C1';
    else if (avgCompetency >= 75) this.model.currentCefr = 'B2';
    else if (avgCompetency >= 65) this.model.currentCefr = 'B1';
    else if (avgCompetency >= 50) this.model.currentCefr = 'A2';
    else this.model.currentCefr = 'A1';
  }

  /**
   * Generates a synchronized Student Digital Twin Engine instance from the current Student Model state.
   */
  public toDigitalTwinEngine(): StudentDigitalTwinEngine {
    return new StudentDigitalTwinEngine({
      userId: this.model.userId,
      linguistic: {
        overallCEFR: this.model.currentCefr,
        skillCEFR: {
          speaking: this.model.currentCefr,
          listening: this.model.currentCefr,
          reading: this.model.currentCefr,
          writing: this.model.currentCefr,
          grammar: this.model.currentCefr,
          vocabulary: this.model.currentCefr,
          pronunciation: this.model.currentCefr,
          fluency: this.model.currentCefr,
          confidence: this.model.currentCefr,
        },
        skillScores: {
          speaking: this.model.speakingMasteryPercent,
          listening: this.model.listeningMasteryPercent,
          reading: this.model.readingMasteryPercent,
          writing: this.model.writingMasteryPercent,
          grammar: this.model.grammarMasteryPercent,
          vocabulary: this.model.vocabularyMasteryPercent,
          pronunciation: Math.round((this.model.speakingMasteryPercent + this.model.listeningMasteryPercent) / 2),
          fluency: this.model.speakingMasteryPercent,
          confidence: this.model.confidenceScore,
        },
        activeVocabularyCount: this.model.vocabularyInventory.filter((w) => w.state === 'uses_naturally').length * 20 + 150,
        passiveVocabularyCount: this.model.vocabularyInventory.length * 30 + 300,
        masteredGrammarConceptsCount: 16,
        strugglingGrammarConcepts: this.model.weakTopics,
        phoneticFlaws: ['Pronúncia de consoantes duplas'],
      },
      emotional: {
        confidenceScore: this.model.confidenceScore,
        anxietyScore: Math.max(0, 100 - this.model.confidenceScore),
        motivationScore: this.model.motivationScore,
        persistenceScore: this.model.consistencyScore,
        frustrationIndex: this.model.burnoutIndex,
      },
      context: {
        profession: this.model.profession,
        hobbies: this.model.hobbies,
        goals: this.model.objectives,
        upcomingEvents: this.model.reasonsToLearn,
        specificInterests: this.model.interests,
        nativeLanguage: this.model.nativeLanguage,
      },
    });
  }
}

export const defaultStudentModel = new StudentModelEngine();

