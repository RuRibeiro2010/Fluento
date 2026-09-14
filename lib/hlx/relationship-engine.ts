/**
 * Relationship Engine Module (Human Learning Experience - HLX)
 * Builds a natural, empathetic long-term rapport between teacher and student,
 * spontaneously recalling past shared moments, achievements, and overcome challenges.
 */

import { StudentEmotionalState, getTopEmotionalAnchors } from './emotional-memory';

export interface TeacherStudentRapport {
  teacherName: string;
  relationshipStage: 'initial_connection' | 'building_trust' | 'solid_partnership' | 'mentorship';
  sharedSessionCount: number;
  rememberedPersonalFactList: string[];
  lastSpontaneousCallbackTimestampMs: number;
}

export function initializeTeacherRapport(
  teacherName: string = 'Prof. Mateo'
): TeacherStudentRapport {
  return {
    teacherName,
    relationshipStage: 'initial_connection',
    sharedSessionCount: 0,
    rememberedPersonalFactList: [],
    lastSpontaneousCallbackTimestampMs: 0,
  };
}

export function advanceRapportSession(
  rapport: TeacherStudentRapport,
  newFactDiscovered?: string
): TeacherStudentRapport {
  const newCount = rapport.sharedSessionCount + 1;

  let newStage = rapport.relationshipStage;
  if (newCount >= 15) newStage = 'mentorship';
  else if (newCount >= 7) newStage = 'solid_partnership';
  else if (newCount >= 3) newStage = 'building_trust';

  const updatedFacts = newFactDiscovered
    ? [...new Set([...rapport.rememberedPersonalFactList, newFactDiscovered])]
    : rapport.rememberedPersonalFactList;

  return {
    ...rapport,
    relationshipStage: newStage,
    sharedSessionCount: newCount,
    rememberedPersonalFactList: updatedFacts,
  };
}

export function generateSpontaneousRapportCallback(
  rapport: TeacherStudentRapport,
  emotionalState: StudentEmotionalState
): {
  shouldIncludeCallback: boolean;
  callbackText: string;
  audioToneMood: 'warm_nostalgic' | 'proud_encouraging';
} {
  const anchors = getTopEmotionalAnchors(emotionalState);
  if (anchors.length === 0 || rapport.sharedSessionCount < 2) {
    return {
      shouldIncludeCallback: false,
      callbackText: '',
      audioToneMood: 'proud_encouraging',
    };
  }

  const randomAnchor = anchors[Math.floor(Math.random() * anchors.length)];
  const callbackText = `Ainda me lembro de quando praticámos "${randomAnchor.conceptOrTopic}" e superaste essa hesitação com total maestria! Estás no caminho certo.`;

  return {
    shouldIncludeCallback: true,
    callbackText,
    audioToneMood: 'proud_encouraging',
  };
}
