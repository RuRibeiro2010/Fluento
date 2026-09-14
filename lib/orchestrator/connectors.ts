/**
 * Connectors Module (AI Teaching Orchestrator - Sprint 3)
 * Provides extension plugs and standard interfaces for future system expansions:
 * New AI Models, Custom Teachers, New Target Languages, Enterprise Mode,
 * School/Teacher-Supervised Mode, and Offline Local Execution.
 */

export interface AIModelConnectorConfig {
  modelId: string;
  provider: 'google' | 'custom_finetune' | 'local_ondevice';
  capabilities: ('fast_chat' | 'deep_reasoning' | 'live_audio' | 'image_vision')[];
  maxTokenContext: number;
}

export interface LanguageConnectorConfig {
  languageCode: string; // e.g. 'es', 'en', 'fr', 'de', 'it', 'pt'
  displayName: string;
  nativeName: string;
  cefrSupportedLevels: ('A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2')[];
  defaultCulturalContext: string;
}

export interface EnterpriseModeConfig {
  organizationId: string;
  companyDomain: string;
  corporateGlossaryTerms: string[];
  departmentFocus?: 'engineering' | 'sales' | 'customer_support' | 'executive';
  complianceDataRetentionDays: number;
}

export interface SchoolModeConfig {
  schoolId: string;
  classroomId: string;
  leadTeacherName: string;
  curriculumStandard: 'CEFR' | 'ACTFL' | 'DELE';
  allowStudentSelfPacing: boolean;
  assignedWeeklyHomeworkCount: number;
}

export interface OfflineModeConfig {
  isEnabled: boolean;
  cachedLessonsCount: number;
  localSpeechRecognitionAvailable: boolean;
  lastSyncedTimestampIso: string;
}

/**
 * Standard registry for future orchestrator connectors.
 */
export class OrchestratorConnectorsHub {
  private static aiModels: Map<string, AIModelConnectorConfig> = new Map([
    [
      'gemini-2.5-flash',
      {
        modelId: 'gemini-2.5-flash',
        provider: 'google',
        capabilities: ['fast_chat', 'live_audio'],
        maxTokenContext: 1000000,
      },
    ],
  ]);

  private static languages: Map<string, LanguageConnectorConfig> = new Map([
    [
      'es',
      {
        languageCode: 'es',
        displayName: 'Spanish',
        nativeName: 'Español',
        cefrSupportedLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        defaultCulturalContext: 'Spain & Latin America',
      },
    ],
    [
      'en',
      {
        languageCode: 'en',
        displayName: 'English',
        nativeName: 'English',
        cefrSupportedLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        defaultCulturalContext: 'Global Business English',
      },
    ],
  ]);

  private static enterpriseConfig?: EnterpriseModeConfig;
  private static schoolConfig?: SchoolModeConfig;
  private static offlineConfig: OfflineModeConfig = {
    isEnabled: false,
    cachedLessonsCount: 5,
    localSpeechRecognitionAvailable: true,
    lastSyncedTimestampIso: new Date().toISOString(),
  };

  public static registerAIModel(config: AIModelConnectorConfig): void {
    this.aiModels.set(config.modelId, config);
  }

  public static registerLanguage(config: LanguageConnectorConfig): void {
    this.languages.set(config.languageCode, config);
  }

  public static configureEnterpriseMode(config: EnterpriseModeConfig): void {
    this.enterpriseConfig = config;
  }

  public static configureSchoolMode(config: SchoolModeConfig): void {
    this.schoolConfig = config;
  }

  public static getActiveAIModels(): AIModelConnectorConfig[] {
    return Array.from(this.aiModels.values());
  }

  public static getSupportedLanguages(): LanguageConnectorConfig[] {
    return Array.from(this.languages.values());
  }

  public static getEnterpriseConfig(): EnterpriseModeConfig | undefined {
    return this.enterpriseConfig;
  }

  public static getSchoolConfig(): SchoolModeConfig | undefined {
    return this.schoolConfig;
  }

  public static getOfflineConfig(): OfflineModeConfig {
    return this.offlineConfig;
  }
}
