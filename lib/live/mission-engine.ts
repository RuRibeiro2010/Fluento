/**
 * Mission Engine Module (Live Experience Engine)
 * Transforms live conversation sessions into immersive real-world missions:
 * Hotel check-in, airport navigation, executive work meeting, university campus,
 * restaurant ordering, medical consultation, apartment renting, etc.
 */

export interface MissionObjective {
  id: string;
  description: string;
  isCompleted: boolean;
  requiredKeyConcepts: string[];
}

export interface RealWorldMission {
  id: string;
  title: string;
  category: 'travel' | 'business' | 'daily_life' | 'academic' | 'emergency';
  setting: string;
  iconName: string;
  description: string;
  targetCEFRLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  objectives: MissionObjective[];
  isFullyCompleted: boolean;
}

export const MISSION_CATALOG: RealWorldMission[] = [
  {
    id: 'hotel_checkin',
    title: 'Check-in no Hotel de Madrid',
    category: 'travel',
    setting: 'Recepção do Hotel Gran Vía, Madrid',
    iconName: 'Building',
    description: 'Fazer o check-in, solicitar um quarto silencioso com vista e confirmar o horário do pequeno-almoço.',
    targetCEFRLevel: 'A2',
    objectives: [
      { id: 'obj-1', description: 'Apresentar a reserva com cortesia', isCompleted: false, requiredKeyConcepts: ['reserva', 'buenas tardes'] },
      { id: 'obj-2', description: 'Pedir um quarto com preferências específicas', isCompleted: false, requiredKeyConcepts: ['habitación', 'vista', 'tranquila'] },
      { id: 'obj-3', description: 'Perguntar sobre o horário do pequeno-almoço e Wi-Fi', isCompleted: false, requiredKeyConcepts: ['desayuno', 'contraseña'] },
    ],
    isFullyCompleted: false,
  },
  {
    id: 'restaurant_order',
    title: 'Jantar num Restaurante Típico',
    category: 'daily_life',
    setting: 'Restaurante El Botín',
    iconName: 'Utensils',
    description: 'Reservar mesa, pedir recomendações do chef, solicitar adaptações alimentares e pagar a conta.',
    targetCEFRLevel: 'A2',
    objectives: [
      { id: 'obj-1', description: 'Pedir uma mesa para duas pessoas', isCompleted: false, requiredKeyConcepts: ['mesa para dos', 'por favor'] },
      { id: 'obj-2', description: 'Solicitar recomendações de prato e bebida', isCompleted: false, requiredKeyConcepts: ['recomienda', 'plato'] },
      { id: 'obj-3', description: 'Pedir a conta e confirmar forma de pagamento', isCompleted: false, requiredKeyConcepts: ['la cuenta', 'tarjeta'] },
    ],
    isFullyCompleted: false,
  },
  {
    id: 'business_meeting',
    title: 'Apresentação Executiva de Proposta',
    category: 'business',
    setting: 'Sala de Reuniões de Empresa Internacional',
    iconName: 'Briefcase',
    description: 'Apresentar uma proposta de parceria, responder a objeções diplomáticas e fechar acordo.',
    targetCEFRLevel: 'B2',
    objectives: [
      { id: 'obj-1', description: 'Introduzir a proposta com tom diplomático', isCompleted: false, requiredKeyConcepts: ['quisiera proponer', 'propuesta'] },
      { id: 'obj-2', description: 'Clarificar prazos e orçamento com elegância', isCompleted: false, requiredKeyConcepts: ['plazo', 'presupuesto'] },
      { id: 'obj-3', description: 'Acordar os próximos passos', isCompleted: false, requiredKeyConcepts: ['siguientes pasos', 'de acuerdo'] },
    ],
    isFullyCompleted: false,
  },
  {
    id: 'airport_navigation',
    title: 'Navegação e Escala no Aeroporto',
    category: 'travel',
    setting: 'Aeroporto Barajas - Terminal 4',
    iconName: 'Plane',
    description: 'Resolver um voo atrasado, perguntar pelo portão de embarque e remarcar voo de conexão.',
    targetCEFRLevel: 'B1',
    objectives: [
      { id: 'obj-1', description: 'Informar-se sobre o estado do voo atrasado', isCompleted: false, requiredKeyConcepts: ['vuelo', 'retraso'] },
      { id: 'obj-2', description: 'Solicitar assistência na porta de embarque', isCompleted: false, requiredKeyConcepts: ['puerta de embarque', 'conexión'] },
    ],
    isFullyCompleted: false,
  },
];

export function initializeMission(missionId: string): RealWorldMission {
  const found = MISSION_CATALOG.find((m) => m.id === missionId) || MISSION_CATALOG[0];
  // Deep clone to avoid mutating static catalog
  return JSON.parse(JSON.stringify(found));
}

export function evaluateMissionUtterance(
  mission: RealWorldMission,
  userUtteranceText: string
): {
  updatedMission: RealWorldMission;
  newlyCompletedObjectives: MissionObjective[];
  isMissionAccomplished: boolean;
} {
  const normalizedUtterance = userUtteranceText.toLowerCase();
  const newlyCompleted: MissionObjective[] = [];

  const updatedObjectives = mission.objectives.map((obj) => {
    if (obj.isCompleted) return obj;

    const matches = obj.requiredKeyConcepts.some((concept) =>
      normalizedUtterance.includes(concept.toLowerCase())
    );

    if (matches) {
      const completedObj = { ...obj, isCompleted: true };
      newlyCompleted.push(completedObj);
      return completedObj;
    }

    return obj;
  });

  const isFullyCompleted = updatedObjectives.every((obj) => obj.isCompleted);

  return {
    updatedMission: {
      ...mission,
      objectives: updatedObjectives,
      isFullyCompleted,
    },
    newlyCompletedObjectives: newlyCompleted,
    isMissionAccomplished: isFullyCompleted,
  };
}
