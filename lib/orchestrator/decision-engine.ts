/**
 * Decision Engine Module (AI Teaching Orchestrator - Phase 15)
 * Formulates transparent, explicit pedagogical rationales answering
 * "Why this lesson?", "Why now?", "Why this duration?", "Why this teacher?", etc.
 */

import { StudentLearningState } from './learning-state';

export interface PedagogicalRationale {
  whyThisLesson: string;
  whyNow: string;
  whyNotOtherTopic: string;
  whyThisDuration: string;
  whyThisTeacher: string;
  whyThisMode: string;
  whyThisMission: string;
  whyThisCEFRLevel: string;
}

export function generatePedagogicalRationale(
  studentState: StudentLearningState,
  lessonTitle: string,
  teacherName: string,
  durationMinutes: number,
  cefrLevel: string
): PedagogicalRationale {
  return {
    whyThisLesson: `O tema "${lessonTitle}" alinha-se diretamente com o teu objetivo profissional e histórico de expansão vocabular.`,
    whyNow: `A tua memória longitudinal identifica que este é o momento ideal para aplicar este conceito antes da curva de esquecimento atuar.`,
    whyNotOtherTopic: `Outros temas avançados foram diferidos para priorizar a tua estabilidade e confiança conversacional.`,
    whyThisDuration: `Sessão calibrada para ${durationMinutes} minutos com base no teu estado atual (${studentState}) para maximizar retenção sem causar fadiga.`,
    whyThisTeacher: `A escolha do ${teacherName} assegura a tonalidade pedagógica mais eficaz para o teu momento motivacional.`,
    whyThisMode: `Modo de conversação ativa para converter conhecimento passivo em autonomia espontânea.`,
    whyThisMission: `Missão prática desenhada para consolidar esta aprendizagem no teu ecossistema real de trabalho/estudo.`,
    whyThisCEFRLevel: `Nível ${cefrLevel} para manter a sessão na Zona de Desenvolvimento Proximal (nem demasiado fácil, nem frustrante).`,
  };
}
