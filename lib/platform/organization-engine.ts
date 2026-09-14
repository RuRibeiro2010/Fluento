/**
 * Organization Engine Module (Fluento Platform Ecosystem - Phase 17)
 * Multi-tenant organization support for managing student rosters, licenses,
 * sub-groups, and aggregated fluency progression across teams.
 */

export type OrganizationType = 'company' | 'school' | 'university' | 'academy' | 'family';

export interface OrganizationMember {
  memberId: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'learner';
  cefrLevel: string;
  assignedCohortGroup?: string;
  weeklyActiveMinutes: number;
}

export interface OrganizationProfile {
  orgId: string;
  orgName: string;
  type: OrganizationType;
  licensedSeats: number;
  members: OrganizationMember[];
  createdIso: string;
}

export function createOrganizationProfile(
  orgName: string,
  type: OrganizationType,
  licensedSeats: number = 25
): OrganizationProfile {
  return {
    orgId: `org_${Date.now()}`,
    orgName,
    type,
    licensedSeats,
    members: [],
    createdIso: new Date().toISOString(),
  };
}

export function addMemberToOrganization(
  org: OrganizationProfile,
  member: Omit<OrganizationMember, 'weeklyActiveMinutes'>
): OrganizationProfile {
  if (org.members.length >= org.licensedSeats) {
    throw new Error('Limite de licenças atingido para esta organização.');
  }

  const newMember: OrganizationMember = {
    ...member,
    weeklyActiveMinutes: 0,
  };

  return {
    ...org,
    members: [...org.members, newMember],
  };
}
