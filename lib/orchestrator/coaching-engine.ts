/**
 * Coaching Engine Module (AI Teaching Orchestrator - Phase 15)
 * Dynamically assigns the optimal virtual teacher persona based on emotional/cognitive state.
 */

import { StudentLearningState } from './learning-state';

export interface VirtualTeacherPersona {
  id: string;
  name: string;
  styleDescription: string;
  tone: 'calm_empathetic' | 'demanding_exacting' | 'playful_engaging' | 'executive_professional';
  avatarAccentColor: string;
}

export function selectOptimalTeacherPersona(
  studentState: StudentLearningState,
  profession: string = 'general'
): VirtualTeacherPersona {
  if (studentState === 'Needs Confidence' || studentState === 'Mentally Tired' || studentState === 'Burnout Risk') {
    return {
      id: 'teacher-sofia',
      name: 'Prof. Sofia',
      styleDescription: 'Calma, encorajadora e focada no progresso positivo e sem pressão.',
      tone: 'calm_empathetic',
      avatarAccentColor: '#10B981', // emerald
    };
  }

  if (studentState === 'Ready for Challenge' || studentState === 'High Performance') {
    return {
      id: 'teacher-marcos',
      name: 'Prof. Marcos',
      styleDescription: 'Exigente, preciso e focado no apuramento do tom nativo e riqueza vocabular.',
      tone: 'demanding_exacting',
      avatarAccentColor: '#8B5CF6', // purple
    };
  }

  if (profession === 'technology' || profession === 'business') {
    return {
      id: 'teacher-elena',
      name: 'Prof. Elena',
      styleDescription: 'Executiva, estruturada e especialista em comunicação corporativa global.',
      tone: 'executive_professional',
      avatarAccentColor: '#3B82F6', // blue
    };
  }

  return {
    id: 'teacher-lucas',
    name: 'Prof. Lucas',
    styleDescription: 'Divertido, dinâmico e focado em expressões culturais e boa disposição.',
    tone: 'playful_engaging',
    avatarAccentColor: '#F59E0B', // amber
  };
}
