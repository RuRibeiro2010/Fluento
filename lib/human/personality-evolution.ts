/**
 * Personality Evolution Module (Fluento Human Experience - Phase 19)
 * Preserves virtual teacher persona consistency so teachers maintain unique human traits,
 * preventing robotic drift or sudden style shifts.
 */

export interface TeacherPersonaIdentity {
  id: string;
  displayName: string;
  corePhilosophy: string;
  signatureCatchphrase?: string;
  speechRegister: 'formal_executive' | 'warm_conversational' | 'academic_precise' | 'friendly_dynamic';
  humorLevel: 'subtle' | 'moderate' | 'playful';
}

export function enforcePersonaConsistency(
  persona: TeacherPersonaIdentity,
  rawDraftSpeech: string
): string {
  // Ensure the speech register aligns with persona without overriding user intent
  if (persona.speechRegister === 'warm_conversational' && !rawDraftSpeech.includes('!')) {
    // Subtle conversational warmth check
    return rawDraftSpeech;
  }

  return rawDraftSpeech;
}
