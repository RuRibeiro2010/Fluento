/**
 * Certification Engine Module (Fluento Platform Ecosystem - Phase 17)
 * Exam preparation structure, simulation drills, and rubric scoring for major global exams:
 * IELTS, TOEFL, Cambridge, Goethe, JLPT, HSK, TOPIK, DELF, DELE, CELPE-Bras.
 */

export type GlobalCertificationExam =
  | 'IELTS'
  | 'TOEFL'
  | 'Cambridge'
  | 'Goethe'
  | 'JLPT'
  | 'HSK'
  | 'TOPIK'
  | 'DELF'
  | 'DELE'
  | 'CELPE-Bras';

export interface CertificationPrepTrack {
  exam: GlobalCertificationExam;
  targetScoreDescription: string;
  cefrEquivalent: string;
  mockExamSections: { sectionName: string; durationMinutes: number; questionCount: number }[];
}

export const OFFICIAL_CERTIFICATIONS_CATALOG: Record<GlobalCertificationExam, CertificationPrepTrack> = {
  IELTS: {
    exam: 'IELTS',
    targetScoreDescription: 'Band 7.5+ Academic/General',
    cefrEquivalent: 'C1',
    mockExamSections: [
      { sectionName: 'Listening', durationMinutes: 30, questionCount: 40 },
      { sectionName: 'Reading', durationMinutes: 60, questionCount: 40 },
      { sectionName: 'Writing', durationMinutes: 60, questionCount: 2 },
      { sectionName: 'Speaking', durationMinutes: 15, questionCount: 3 },
    ],
  },
  TOEFL: {
    exam: 'TOEFL',
    targetScoreDescription: 'Score 100+ iBT',
    cefrEquivalent: 'C1',
    mockExamSections: [
      { sectionName: 'Reading', durationMinutes: 35, questionCount: 20 },
      { sectionName: 'Listening', durationMinutes: 36, questionCount: 28 },
      { sectionName: 'Speaking', durationMinutes: 16, questionCount: 4 },
      { sectionName: 'Writing', durationMinutes: 29, questionCount: 2 },
    ],
  },
  Cambridge: {
    exam: 'Cambridge',
    targetScoreDescription: 'C1 Advanced (CAE)',
    cefrEquivalent: 'C1',
    mockExamSections: [
      { sectionName: 'Reading & Use of English', durationMinutes: 90, questionCount: 56 },
      { sectionName: 'Writing', durationMinutes: 90, questionCount: 2 },
      { sectionName: 'Listening', durationMinutes: 40, questionCount: 30 },
      { sectionName: 'Speaking', durationMinutes: 15, questionCount: 4 },
    ],
  },
  Goethe: {
    exam: 'Goethe',
    targetScoreDescription: 'Goethe-Zertifikat B2/C1',
    cefrEquivalent: 'B2',
    mockExamSections: [
      { sectionName: 'Lesen', durationMinutes: 65, questionCount: 30 },
      { sectionName: 'Hören', durationMinutes: 40, questionCount: 30 },
      { sectionName: 'Schreiben', durationMinutes: 75, questionCount: 2 },
      { sectionName: 'Sprechen', durationMinutes: 15, questionCount: 2 },
    ],
  },
  JLPT: {
    exam: 'JLPT',
    targetScoreDescription: 'Japanese Language Proficiency Test N2/N1',
    cefrEquivalent: 'B2',
    mockExamSections: [
      { sectionName: 'Language Knowledge & Reading', durationMinutes: 105, questionCount: 60 },
      { sectionName: 'Listening', durationMinutes: 50, questionCount: 30 },
    ],
  },
  HSK: {
    exam: 'HSK',
    targetScoreDescription: 'Hanyu Shuiping Kaoshi Level 5/6',
    cefrEquivalent: 'B2',
    mockExamSections: [
      { sectionName: 'Listening', durationMinutes: 45, questionCount: 45 },
      { sectionName: 'Reading', durationMinutes: 45, questionCount: 45 },
      { sectionName: 'Writing', durationMinutes: 40, questionCount: 10 },
    ],
  },
  TOPIK: {
    exam: 'TOPIK',
    targetScoreDescription: 'Test of Proficiency in Korean TOPIK II',
    cefrEquivalent: 'B2',
    mockExamSections: [
      { sectionName: 'Listening', durationMinutes: 60, questionCount: 50 },
      { sectionName: 'Writing', durationMinutes: 50, questionCount: 4 },
      { sectionName: 'Reading', durationMinutes: 70, questionCount: 50 },
    ],
  },
  DELF: {
    exam: 'DELF',
    targetScoreDescription: 'DELF B2 / DALF C1 Diplôme d\'Études en Langue Française',
    cefrEquivalent: 'B2',
    mockExamSections: [
      { sectionName: 'Compréhension de l\'oral', durationMinutes: 30, questionCount: 25 },
      { sectionName: 'Compréhension des écrits', durationMinutes: 60, questionCount: 25 },
      { sectionName: 'Production écrite', durationMinutes: 60, questionCount: 1 },
      { sectionName: 'Production orale', durationMinutes: 20, questionCount: 1 },
    ],
  },
  DELE: {
    exam: 'DELE',
    targetScoreDescription: 'Diploma de Español como Lengua Extranjera B2/C1',
    cefrEquivalent: 'B2',
    mockExamSections: [
      { sectionName: 'Comprensión de lectura', durationMinutes: 70, questionCount: 36 },
      { sectionName: 'Comprensión auditiva', durationMinutes: 40, questionCount: 30 },
      { sectionName: 'Expresión e interacción escritas', durationMinutes: 80, questionCount: 2 },
      { sectionName: 'Expresión e interacción orales', durationMinutes: 20, questionCount: 3 },
    ],
  },
  'CELPE-Bras': {
    exam: 'CELPE-Bras',
    targetScoreDescription: 'Certificado de Proficiência em Língua Portuguesa para Estrangeiros',
    cefrEquivalent: 'B2',
    mockExamSections: [
      { sectionName: 'Parte Escrita (Vídeo e Áudio)', durationMinutes: 180, questionCount: 4 },
      { sectionName: 'Parte Oral (Interação face a face)', durationMinutes: 20, questionCount: 1 },
    ],
  },
};

export function getCertificationPrepTrack(exam: GlobalCertificationExam): CertificationPrepTrack {
  return OFFICIAL_CERTIFICATIONS_CATALOG[exam] || OFFICIAL_CERTIFICATIONS_CATALOG.IELTS;
}
