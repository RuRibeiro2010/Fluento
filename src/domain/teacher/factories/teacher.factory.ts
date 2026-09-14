import { TeacherEntity } from '../entities/teacher.entity';
import { TeacherId } from '../value-objects/teacher-id.vo';
import { TeacherPersona } from '../value-objects/teacher-persona.vo';
import { LanguageCode } from '../../shared/value-objects/language-code.vo';

export class TeacherFactory {
  public static createDefaultSofia(): TeacherEntity {
    return TeacherEntity.create(TeacherId.create('tch_sofia_01'), {
      persona: TeacherPersona.create({
        name: 'Prof. Sofia',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        personality: 'encouraging',
        accent: 'es-ES',
        speechRate: 0.9,
        specialty: 'Espanhol Geral, Conversação e Gramática Prática',
        bio: 'Professora nativa de Madrid, especialista em destravar a fala de estudantes lusófonos com empatia e método pedagógico.',
      }),
      targetLanguage: LanguageCode.create('es'),
      supportedCEFRLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      active: true,
    });
  }

  public static createDefaultDiego(): TeacherEntity {
    return TeacherEntity.create(TeacherId.create('tch_diego_02'), {
      persona: TeacherPersona.create({
        name: 'Prof. Diego',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        personality: 'academic',
        accent: 'es-MX',
        speechRate: 1.0,
        specialty: 'Espanhol de Negócios e Preparação para Certificados',
        bio: 'Consultor linguístico com foco em vocabulário profissional, apresentações corporativas e negociações multinacionais.',
      }),
      targetLanguage: LanguageCode.create('es'),
      supportedCEFRLevels: ['B1', 'B2', 'C1', 'C2'],
      active: true,
    });
  }
}
