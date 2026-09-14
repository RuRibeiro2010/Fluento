/**
 * Anonymization Module (Fluento Intelligence 1.0 - Phase 16)
 * Ensures GDPR compliance by sanitizing user data and stripping PII
 * before transmitting metrics to global learning analytics engines.
 */

export interface RawUserSessionMetrics {
  userId: string;
  userEmail?: string;
  userName?: string;
  ipAddress?: string;
  ageGroup: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  profession: string;
  targetLanguage: string;
  sessionDurationMinutes: number;
  accuracyScore: number;
  hesitationCount: number;
  retentionScore: number;
}

export interface AnonymizedSessionData {
  cohortHash: string;
  ageGroup: string;
  professionGroup: string;
  targetLanguage: string;
  sessionDurationMinutes: number;
  accuracyScore: number;
  hesitationCount: number;
  retentionScore: number;
  anonymizedTimestampIso: string;
}

export function anonymizeSessionMetrics(raw: RawUserSessionMetrics): AnonymizedSessionData {
  // Hash user identity to prevent reverse-identification while preserving cohort tracking
  const rawId = raw.userId || raw.userEmail || 'anonymous';
  let hashVal = 0;
  for (let i = 0; i < rawId.length; i++) {
    hashVal = (hashVal << 5) - hashVal + rawId.charCodeAt(i);
    hashVal |= 0;
  }
  const cohortHash = `cohort_${Math.abs(hashVal % 1000)}`;

  return {
    cohortHash,
    ageGroup: raw.ageGroup,
    professionGroup: raw.profession.toLowerCase().trim(),
    targetLanguage: raw.targetLanguage,
    sessionDurationMinutes: raw.sessionDurationMinutes,
    accuracyScore: raw.accuracyScore,
    hesitationCount: raw.hesitationCount,
    retentionScore: raw.retentionScore,
    anonymizedTimestampIso: new Date().toISOString(),
  };
}
