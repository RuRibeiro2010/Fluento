/**
 * Feature Flags Module (Fluento Platform Ecosystem - Phase 17)
 * Decouples feature enablement from subscription tiers via dynamic permission flags.
 */

export interface FeatureFlagConfig {
  flagKey: string;
  isEnabledGlobal: boolean;
  allowedTiers: string[];
  betaPercentage: number; // 0 to 100
}

export const PLATFORM_FEATURE_FLAGS: Record<string, FeatureFlagConfig> = {
  live_voice_synthesis: {
    flagKey: 'live_voice_synthesis',
    isEnabledGlobal: true,
    allowedTiers: ['free', 'plus', 'pro', 'family', 'teams', 'education', 'enterprise'],
    betaPercentage: 100,
  },
  ai_teaching_orchestrator: {
    flagKey: 'ai_teaching_orchestrator',
    isEnabledGlobal: true,
    allowedTiers: ['plus', 'pro', 'family', 'teams', 'education', 'enterprise'],
    betaPercentage: 100,
  },
  official_certification_prep: {
    flagKey: 'official_certification_prep',
    isEnabledGlobal: true,
    allowedTiers: ['pro', 'family', 'teams', 'education', 'enterprise'],
    betaPercentage: 100,
  },
  organization_dashboard: {
    flagKey: 'organization_dashboard',
    isEnabledGlobal: true,
    allowedTiers: ['teams', 'education', 'enterprise'],
    betaPercentage: 100,
  },
};

export function isFeatureFlagActive(
  flagKey: string,
  userTier: string = 'free',
  userCohortHash: number = 0
): boolean {
  const config = PLATFORM_FEATURE_FLAGS[flagKey];
  if (!config || !config.isEnabledGlobal) return false;

  const tierAllowed = config.allowedTiers.includes(userTier);
  const rolloutAllowed = userCohortHash % 100 < config.betaPercentage;

  return tierAllowed && rolloutAllowed;
}
