/**
 * Subscription Engine Module (Fluento Platform Ecosystem - Phase 17)
 * Handles tier capabilities, permission checks, seat allocations, and feature access
 * for Free, Plus, Pro, Teams, Enterprise, Education, and Family plans.
 */

export type SubscriptionTier =
  | 'free'
  | 'plus'
  | 'pro'
  | 'teams'
  | 'enterprise'
  | 'education'
  | 'family';

export interface TierCapabilities {
  tier: SubscriptionTier;
  maxSeats: number;
  hasUnlimitedConversations: boolean;
  hasAdvancedAIOrchestration: boolean;
  hasCustomProfessionalScenarios: boolean;
  hasOfficialCertificationPrep: boolean;
  hasOrganizationAnalytics: boolean;
  hasOfflineDownloads: boolean;
}

export const TIER_CAPABILITIES_MAP: Record<SubscriptionTier, TierCapabilities> = {
  free: {
    tier: 'free',
    maxSeats: 1,
    hasUnlimitedConversations: false,
    hasAdvancedAIOrchestration: false,
    hasCustomProfessionalScenarios: false,
    hasOfficialCertificationPrep: false,
    hasOrganizationAnalytics: false,
    hasOfflineDownloads: false,
  },
  plus: {
    tier: 'plus',
    maxSeats: 1,
    hasUnlimitedConversations: true,
    hasAdvancedAIOrchestration: true,
    hasCustomProfessionalScenarios: false,
    hasOfficialCertificationPrep: false,
    hasOrganizationAnalytics: false,
    hasOfflineDownloads: true,
  },
  pro: {
    tier: 'pro',
    maxSeats: 1,
    hasUnlimitedConversations: true,
    hasAdvancedAIOrchestration: true,
    hasCustomProfessionalScenarios: true,
    hasOfficialCertificationPrep: true,
    hasOrganizationAnalytics: false,
    hasOfflineDownloads: true,
  },
  family: {
    tier: 'family',
    maxSeats: 6,
    hasUnlimitedConversations: true,
    hasAdvancedAIOrchestration: true,
    hasCustomProfessionalScenarios: true,
    hasOfficialCertificationPrep: true,
    hasOrganizationAnalytics: false,
    hasOfflineDownloads: true,
  },
  teams: {
    tier: 'teams',
    maxSeats: 25,
    hasUnlimitedConversations: true,
    hasAdvancedAIOrchestration: true,
    hasCustomProfessionalScenarios: true,
    hasOfficialCertificationPrep: true,
    hasOrganizationAnalytics: true,
    hasOfflineDownloads: true,
  },
  education: {
    tier: 'education',
    maxSeats: 100,
    hasUnlimitedConversations: true,
    hasAdvancedAIOrchestration: true,
    hasCustomProfessionalScenarios: true,
    hasOfficialCertificationPrep: true,
    hasOrganizationAnalytics: true,
    hasOfflineDownloads: true,
  },
  enterprise: {
    tier: 'enterprise',
    maxSeats: 1000,
    hasUnlimitedConversations: true,
    hasAdvancedAIOrchestration: true,
    hasCustomProfessionalScenarios: true,
    hasOfficialCertificationPrep: true,
    hasOrganizationAnalytics: true,
    hasOfflineDownloads: true,
  },
};

export function hasPermissionForFeature(
  userTier: SubscriptionTier,
  permissionKey: keyof Omit<TierCapabilities, 'tier' | 'maxSeats'>
): boolean {
  const capabilities = TIER_CAPABILITIES_MAP[userTier] || TIER_CAPABILITIES_MAP.free;
  return Boolean(capabilities[permissionKey]);
}
