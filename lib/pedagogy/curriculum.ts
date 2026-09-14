import { FrameworkLevelMapping, ProficiencyFramework } from '@/types/pedagogy';
import { CEFRLevel } from '@/types/brain';

export const FRAMEWORK_LEVEL_MAPPINGS: FrameworkLevelMapping[] = [
  // CEFR Standard
  { framework: 'CEFR', levelCode: 'A1', equivalentCefr: 'A1', title: 'A1 Beginner', description: 'Basic expressions and immediate needs' },
  { framework: 'CEFR', levelCode: 'A2', equivalentCefr: 'A2', title: 'A2 Elementary', description: 'Routine information exchange' },
  { framework: 'CEFR', levelCode: 'B1', equivalentCefr: 'B1', title: 'B1 Intermediate', description: 'Unscripted everyday & work conversations' },
  { framework: 'CEFR', levelCode: 'B2', equivalentCefr: 'B2', title: 'B2 Upper-Intermediate', description: 'Complex technical & abstract discussions' },
  { framework: 'CEFR', levelCode: 'C1', equivalentCefr: 'C1', title: 'C1 Advanced', description: 'Fluent, spontaneous & nuanced communication' },
  { framework: 'CEFR', levelCode: 'C2', equivalentCefr: 'C2', title: 'C2 Native Mastery', description: 'Effortless native-like comprehension & precision' },

  // JLPT (Japanese Language Proficiency Test)
  { framework: 'JLPT', levelCode: 'N5', equivalentCefr: 'A1', title: 'JLPT N5', description: 'Basic Japanese hiragana, katakana, and elementary kanji' },
  { framework: 'JLPT', levelCode: 'N4', equivalentCefr: 'A2', title: 'JLPT N4', description: 'Basic Japanese conversations and daily life vocabulary' },
  { framework: 'JLPT', levelCode: 'N3', equivalentCefr: 'B1', title: 'JLPT N3', description: 'Everyday Japanese at natural speed' },
  { framework: 'JLPT', levelCode: 'N2', equivalentCefr: 'B2', title: 'JLPT N2', description: 'Business & social Japanese in general settings' },
  { framework: 'JLPT', levelCode: 'N1', equivalentCefr: 'C1', title: 'JLPT N1', description: 'Complex Japanese across diverse specialized situations' },

  // HSK (Chinese Proficiency Test)
  { framework: 'HSK', levelCode: 'HSK1', equivalentCefr: 'A1', title: 'HSK Level 1', description: 'Understands and uses simple Chinese phrases (150 words)' },
  { framework: 'HSK', levelCode: 'HSK2', equivalentCefr: 'A2', title: 'HSK Level 2', description: 'Direct communication on daily topics (300 words)' },
  { framework: 'HSK', levelCode: 'HSK3', equivalentCefr: 'B1', title: 'HSK Level 3', description: 'Communicates in daily, academic, and professional life (600 words)' },
  { framework: 'HSK', levelCode: 'HSK4', equivalentCefr: 'B2', title: 'HSK Level 4', description: 'Discusses a relatively wide range of topics in Chinese (1200 words)' },
  { framework: 'HSK', levelCode: 'HSK5', equivalentCefr: 'C1', title: 'HSK Level 5', description: 'Reads Chinese newspapers, watches movies, delivers speeches' },
  { framework: 'HSK', levelCode: 'HSK6', equivalentCefr: 'C2', title: 'HSK Level 6', description: 'Fluently comprehends and expresses all spoken & written Chinese' },

  // TOPIK (Test of Proficiency in Korean)
  { framework: 'TOPIK', levelCode: 'TOPIK1', equivalentCefr: 'A1', title: 'TOPIK Level 1', description: 'Basic survival Korean, greetings, ordering food' },
  { framework: 'TOPIK', levelCode: 'TOPIK2', equivalentCefr: 'A2', title: 'TOPIK Level 2', description: 'Conversations at public facilities and phone calls' },
  { framework: 'TOPIK', levelCode: 'TOPIK3', equivalentCefr: 'B1', title: 'TOPIK Level 3', description: 'Social relationships and basic work settings' },
  { framework: 'TOPIK', levelCode: 'TOPIK4', equivalentCefr: 'B2', title: 'TOPIK Level 4', description: 'Understanding news, public issues, and business' },
  { framework: 'TOPIK', levelCode: 'TOPIK5', equivalentCefr: 'C1', title: 'TOPIK Level 5', description: 'Research and professional performance in Korean' },
  { framework: 'TOPIK', levelCode: 'TOPIK6', equivalentCefr: 'C2', title: 'TOPIK Level 6', description: 'Fluent professional and academic competence' },

  // Goethe (German)
  { framework: 'Goethe', levelCode: 'Goethe-A1', equivalentCefr: 'A1', title: 'Goethe-Zertifikat A1', description: 'Start Deutsch 1' },
  { framework: 'Goethe', levelCode: 'Goethe-A2', equivalentCefr: 'A2', title: 'Goethe-Zertifikat A2', description: 'Elementary German' },
  { framework: 'Goethe', levelCode: 'Goethe-B1', equivalentCefr: 'B1', title: 'Goethe-Zertifikat B1', description: 'Independent German speaker' },
  { framework: 'Goethe', levelCode: 'Goethe-B2', equivalentCefr: 'B2', title: 'Goethe-Zertifikat B2', description: 'Upper-Intermediate German' },
  { framework: 'Goethe', levelCode: 'Goethe-C1', equivalentCefr: 'C1', title: 'Goethe-Zertifikat C1', description: 'Advanced German' },
  { framework: 'Goethe', levelCode: 'Goethe-C2', equivalentCefr: 'C2', title: 'Goethe-Zertifikat C2', description: 'Großes Deutsches Sprachdiplom' },

  // DELE (Spanish)
  { framework: 'DELE', levelCode: 'DELE-A1', equivalentCefr: 'A1', title: 'DELE A1', description: 'Diploma de Español A1' },
  { framework: 'DELE', levelCode: 'DELE-A2', equivalentCefr: 'A2', title: 'DELE A2', description: 'Diploma de Español A2' },
  { framework: 'DELE', levelCode: 'DELE-B1', equivalentCefr: 'B1', title: 'DELE B1', description: 'Diploma de Español B1' },
  { framework: 'DELE', levelCode: 'DELE-B2', equivalentCefr: 'B2', title: 'DELE B2', description: 'Diploma de Español B2' },
  { framework: 'DELE', levelCode: 'DELE-C1', equivalentCefr: 'C1', title: 'DELE C1', description: 'Diploma de Español C1' },
  { framework: 'DELE', levelCode: 'DELE-C2', equivalentCefr: 'C2', title: 'DELE C2', description: 'Diploma de Español C2' },

  // DELF (French)
  { framework: 'DELF', levelCode: 'DELF-A1', equivalentCefr: 'A1', title: 'DELF A1', description: 'Diplôme d\'Études en Langue Française A1' },
  { framework: 'DELF', levelCode: 'DELF-A2', equivalentCefr: 'A2', title: 'DELF A2', description: 'Diplôme d\'Études en Langue Française A2' },
  { framework: 'DELF', levelCode: 'DELF-B1', equivalentCefr: 'B1', title: 'DELF B1', description: 'Diplôme d\'Études en Langue Française B1' },
  { framework: 'DELF', levelCode: 'DELF-B2', equivalentCefr: 'B2', title: 'DELF B2', description: 'Diplôme d\'Études en Langue Française B2' },

  // CELPE-Bras (Portuguese)
  { framework: 'CELPE_Bras', levelCode: 'CELPE-Intermediario', equivalentCefr: 'B1', title: 'CELPE-Bras Intermediário', description: 'Certificado de Proficiência em Língua Portuguesa' },
  { framework: 'CELPE_Bras', levelCode: 'CELPE-Avancado', equivalentCefr: 'C1', title: 'CELPE-Bras Avançado', description: 'Proficiência Avançada em Língua Portuguesa' },
];

export class CurriculumRegistry {
  public static getMapping(framework: ProficiencyFramework, levelCode: string): FrameworkLevelMapping {
    const match = FRAMEWORK_LEVEL_MAPPINGS.find(
      (m) => m.framework === framework && m.levelCode.toLowerCase() === levelCode.toLowerCase()
    );
    if (match) return match;

    // Fallback to CEFR mapping
    return (
      FRAMEWORK_LEVEL_MAPPINGS.find((m) => m.framework === 'CEFR' && m.levelCode === 'B1') ||
      FRAMEWORK_LEVEL_MAPPINGS[0]
    );
  }

  public static getCefrEquivalent(framework: ProficiencyFramework, levelCode: string): CEFRLevel {
    const mapping = this.getMapping(framework, levelCode);
    return mapping.equivalentCefr;
  }
}
