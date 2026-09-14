/**
 * Relationship Engine Module (Fluento Human Experience - Phase 19)
 * Builds a long-term, professional relationship between virtual teachers and students
 * by maintaining memory of goals, achievements, preferences, and key milestones.
 */

export interface StudentRelationshipProfile {
  userId: string;
  teacherPersonaId: string;
  relationshipStage: 'initial_introduction' | 'building_trust' | 'established_mentorship' | 'deep_mastery_coaching';
  rememberedMilestones: string[];
  sharedTopicsOfInterest: string[];
  perceivedRapportScore: number; // 0 to 100
  lastInteractedIso: string;
}

export function initializeTeacherStudentRelationship(
  userId: string,
  teacherPersonaId: string,
  userInterests: string[] = []
): StudentRelationshipProfile {
  return {
    userId,
    teacherPersonaId,
    relationshipStage: 'initial_introduction',
    rememberedMilestones: [],
    sharedTopicsOfInterest: userInterests,
    perceivedRapportScore: 50,
    lastInteractedIso: new Date().toISOString(),
  };
}

export function updateRelationshipRapport(
  profile: StudentRelationshipProfile,
  sessionSuccessRating: number // 1 to 5
): StudentRelationshipProfile {
  const delta = (sessionSuccessRating - 3) * 5;
  const newRapport = Math.min(100, Math.max(10, profile.perceivedRapportScore + delta));

  let stage = profile.relationshipStage;
  if (newRapport >= 85) stage = 'deep_mastery_coaching';
  else if (newRapport >= 70) stage = 'established_mentorship';
  else if (newRapport >= 55) stage = 'building_trust';

  return {
    ...profile,
    perceivedRapportScore: newRapport,
    relationshipStage: stage,
    lastInteractedIso: new Date().toISOString(),
  };
}
