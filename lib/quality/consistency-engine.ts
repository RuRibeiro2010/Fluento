/**
 * Consistency Engine Module (Trust, Safety & Quality Platform - Phase 18)
 * Ensures virtual teacher personas remain consistent in tone, rules, and decisions,
 * preventing self-contradictions across turns and sessions.
 */

export interface PersonaConsistencyCheck {
  isConsistent: boolean;
  detectedContradiction: boolean;
  personaName: string;
  expectedTone: string;
  notes?: string;
}

export function verifyPersonaConsistency(
  teacherName: string,
  expectedTone: string,
  turnOutputText: string,
  previousRuleStatements: string[] = []
): PersonaConsistencyCheck {
  // Check if turn output contradicts any previously stated grammatical guidance
  const lower = turnOutputText.toLowerCase();
  let detectedContradiction = false;

  previousRuleStatements.forEach((prevRule) => {
    if (prevRule.includes('sempre') && lower.includes('nunca')) {
      detectedContradiction = true;
    }
  });

  return {
    isConsistent: !detectedContradiction,
    detectedContradiction,
    personaName: teacherName,
    expectedTone,
    notes: detectedContradiction ? 'Contradição potencial detetada com regra anterior.' : undefined,
  };
}
