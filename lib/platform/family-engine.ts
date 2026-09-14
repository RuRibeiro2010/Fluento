/**
 * Family Engine Module (Fluento Platform Ecosystem - Phase 17)
 * Dedicated management for family groups, parental controls, shared goals,
 * and age-appropriate content filters.
 */

export interface FamilyMemberAccount {
  id: string;
  name: string;
  age: number;
  isChildAccount: boolean;
  contentFilterStrictness: 'standard' | 'family_friendly' | 'kids_safe';
  dailyTimeLimitMinutes: number;
}

export interface FamilyGroup {
  familyId: string;
  familyName: string;
  primaryManagerId: string;
  members: FamilyMemberAccount[];
}

export function createFamilyGroup(
  familyName: string,
  managerId: string
): FamilyGroup {
  return {
    familyId: `fam_${Date.now()}`,
    familyName,
    primaryManagerId: managerId,
    members: [],
  };
}

export function addFamilyMember(
  group: FamilyGroup,
  name: string,
  age: number,
  timeLimitMinutes: number = 30
): FamilyGroup {
  if (group.members.length >= 6) {
    throw new Error('O plano familiar permite no máximo 6 membros.');
  }

  const isChild = age < 16;
  const newMember: FamilyMemberAccount = {
    id: `fam_mem_${Date.now()}`,
    name,
    age,
    isChildAccount: isChild,
    contentFilterStrictness: isChild ? 'kids_safe' : 'standard',
    dailyTimeLimitMinutes: timeLimitMinutes,
  };

  return {
    ...group,
    members: [...group.members, newMember],
  };
}
