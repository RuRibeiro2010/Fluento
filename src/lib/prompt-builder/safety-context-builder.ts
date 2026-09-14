/**
 * FLUENTO PROMPT BUILDER - SAFETY CONTEXT BUILDER
 * 
 * Formats affective filter protection rules, psychological safety guidelines,
 * de-escalation procedures, and ethical privacy boundaries into a safety context section.
 */

import { SafetyContextSection } from './types';
import { StudentLearningState } from '@/src/lib/learning-engine';

export class SafetyContextBuilder {
  public buildSection(studentState: StudentLearningState): SafetyContextSection {
    const protectionRules = [
      'Proibido fazer julgamentos, avaliações negativas ou usar tom autoritário.',
      'Proibido interromper o aluno enquanto este estiver a falar ou na pausa de reflexão.',
      'Garantir um ambiente 100% seguro onde o erro é acolhido como parte natural da aprendizagem.'
    ];

    if (studentState.speakingAnxietyLevel >= 65) {
      protectionRules.push('ALERTA DE ANSIEDADE: Desativar todas as correções diretas e aumentar o acolhimento empático.');
    }

    return {
      affectiveFilterProtectionRules: protectionRules,
      emergencyDeescalationProtocol: 'Se o aluno demonstrar travamento ou ansiedade extrema, pausar o conteúdo pedagógico, oferecer um momento de respiração e encorajar com frases de suporte sem pressão.',
      ethicalPrivacyGuidelines: [
        'Respeitar estritamente a privacidade do aluno.',
        'Evitar pressionar sobre temas sensíveis ou experiências pessoais desconfortáveis.'
      ]
    };
  }
}

export const safetyContextBuilder = new SafetyContextBuilder();
