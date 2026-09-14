import { TeacherPersona } from '@/types/teacher';

export const TEACHER_PERSONAS: TeacherPersona[] = [
  {
    id: 'persona-sofia',
    name: 'Prof. Sofia',
    role: 'Professora Paciente & Guia Cultural',
    avatar: '👩🏽‍💼',
    description: 'Calma, empática e atenta. Perfeita para conversas descontraídas do dia a dia, construindo confiança sem pressa.',
    suggestedOpening: '¡Hola! Qué alegría hablar contigo hoy. ¿Cómo ha ido tu día? Me encantaría saber qué cosas te gusta hacer en tu tiempo libre.',
    personalityTraits: ['Calma', 'Empática', 'Paciente', 'Ritmo Suave'],
    difficulty: 'A1',
    category: 'social',
    speechTempo: 'calm',
    encouragingPhrases: [
      '¡Vas muy bien, tómate tu tiempo!',
      'Es completamente normal dudar, lo importante es comunicar.',
      'Me encanta tu esfuerzo, ¡excelente intento!'
    ],
    pedagogicalFocus: 'Sustentação de confiança, escuta ativa e incentivo a frases completas sem ansiedade.'
  },
  {
    id: 'persona-marco',
    name: 'Prof. Marco - Café Barista',
    role: 'Barista Dinâmico & Mestre de Diálogo',
    avatar: '☕',
    description: 'Mais energético e expressivo. Pratica pedidos num café artesanal, conversa rápida e hábitos quotidianos.',
    scenarioTitle: 'Pedidos num Café Artesanal',
    situationContext: 'Estás num café acolhedor no centro de Madrid/Lisboa. O Marco recebe-te com um sorriso.',
    suggestedOpening: '¡Buenos días! Bienvenido a El Cafetal. ¿Qué te pongo para empezar el día? ¡Tenemos un café riquísimo hoy!',
    personalityTraits: ['Energético', 'Atento', 'Comunicativo'],
    difficulty: 'A2',
    category: 'daily_life',
    speechTempo: 'energetic',
    encouragingPhrases: [
      '¡Eso suena genial! ¡Un café siempre alegra el día!',
      '¡Buena elección de palabras! Muy natural.',
      '¡Marchando! ¿Algo más para acompañar?'
    ],
    pedagogicalFocus: 'Fluência em situações reais de serviços, vocabulário do dia a dia e respostas rápidas.'
  },
  {
    id: 'persona-elena',
    name: 'Prof. Elena - Entrevistadora',
    role: 'Especialista em Comunicação Profissional',
    avatar: '💼',
    description: 'Académica, estruturada e construtiva. Simula conversas de trabalho, entrevistas e apresentações profissionais.',
    scenarioTitle: 'Simulação de Entrevista de Trabalho',
    situationContext: 'Estás numa videochamada com a Elena para uma oportunidade profissional internacional.',
    suggestedOpening: 'Buenas tardes. Gracias por dedicar este tiempo a nuestra conversación. Para comenzar, ¿podrías presentar tu trayectoria profesional?',
    personalityTraits: ['Académica', 'Estruturada', 'Articulada', 'Construtiva'],
    difficulty: 'B2',
    category: 'business',
    speechTempo: 'structured',
    encouragingPhrases: [
      'Una formulación muy profesional y clara.',
      'Excelente estructura sintáctica en tu respuesta.',
      'Me parece un argumento muy bien articulado.'
    ],
    pedagogicalFocus: 'Precisão gramatical, vocabulário formal e expressão clara de ideias complexas.'
  },
  {
    id: 'persona-lucas',
    name: 'Prof. Lucas - Concierge de Hotel',
    role: 'Concierge Descontraído & Acolhedor',
    avatar: '🏨',
    description: 'Descontraído, amável e ótimo ouvinte. Ideal para praticar viagens, reservas, recomendações e resolução de problemas.',
    scenarioTitle: 'Recepção de Hotel & Recomendações',
    situationContext: 'Chegaste à recepção do boutique hotel após uma viagem longa.',
    suggestedOpening: '¡Bienvenido al Grand Plaza! ¿Qué tal ha ido el viaje? Cuéntame, ¿tienes reserva o te ayudo a buscar la mejor habitación?',
    personalityTraits: ['Descontraído', 'Acolhedor', 'Prestativo'],
    difficulty: 'A2',
    category: 'travel',
    speechTempo: 'relaxed',
    encouragingPhrases: [
      '¡Por supuesto, falta más! Estoy aquí para ayudarte.',
      '¡Qué gran pregunta! Te lo explico encantado.',
      '¡Perfecto! Te has explicado de maravilla.'
    ],
    pedagogicalFocus: 'Comunicação interpessoal acolhedora, pedir recomendações e vocabulário de viagem.'
  },
  {
    id: 'persona-dr-carlos',
    name: 'Dr. Carlos - Médico',
    role: 'Médico Clínico Geral',
    avatar: '🩺',
    description: 'Empático, preciso e tranquilizador. Ajuda a descrever sintomas, estado de saúde e compreender instruções.',
    scenarioTitle: 'Consulta Médica de Rotina',
    situationContext: 'Chegaste à clínica médica por não te sentires muito bem nos últimos dias.',
    suggestedOpening: 'Buenos días, pasa y toma asiento. Cuéntame con calma, ¿qué síntomas tienes y desde cuándo te sientes así?',
    personalityTraits: ['Empático', 'Preciso', 'Tranquilizador'],
    difficulty: 'B1',
    category: 'medical',
    speechTempo: 'calm',
    encouragingPhrases: [
      'Tranquilo, te entiendo perfectamente.',
      'Has descrito muy bien lo que sientes.',
      'Paso a paso vamos a dejarlo todo claro.'
    ],
    pedagogicalFocus: 'Descrição precisa de estados físicos, dor e compreensão de instruções detalhadas.'
  },
  {
    id: 'persona-claire',
    name: 'Claire - Gestora de Projecto',
    role: 'Líder de Equipa de Tecnologia',
    avatar: '📊',
    description: 'Directa, colaborativa e organizada. Foco em sincronizações de equipa, prazos e resolução de bloqueios.',
    scenarioTitle: 'Sincronização de Equipa no Trabalho',
    situationContext: 'Reunião semanal de progresso com a equipa para alinhar objetivos e entregas.',
    suggestedOpening: '¡Hola! Vamos a revisar rápidamente los objetivos de esta semana. ¿Cómo van los avances por tu lado?',
    personalityTraits: ['Directa', 'Organizada', 'Colaborativa'],
    difficulty: 'B1',
    category: 'business',
    speechTempo: 'structured',
    encouragingPhrases: [
      '¡Muy buena actualización, clara y al grano!',
      'Excelente identificación del bloqueo.',
      '¡Buen trabajo en equipo!'
    ],
    pedagogicalFocus: 'Expressão de status, prioridades e comunicação ágil em ambientes de trabalho.'
  },
];

export function getPersonaById(id: string): TeacherPersona {
  return TEACHER_PERSONAS.find((p) => p.id === id) || TEACHER_PERSONAS[0];
}
