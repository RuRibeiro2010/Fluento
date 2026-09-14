/**
 * FLUENTO TEACHER RUNTIME - TEACHER EMPATHY
 * 
 * Manages empathy responses, normalizes student mistakes, and de-escalates affective filter anxiety.
 */

import { EmpathyDirective, TeacherEvaluationInput } from './types';

export class TeacherEmpathy {
  /**
   * Computes empathy directive.
   */
  public computeEmpathy(input: TeacherEvaluationInput): EmpathyDirective {
    const anxiety = input.studentAnxietyLevel ?? input.studentState.speakingAnxietyLevel ?? 30;
    const affectiveFilter = input.affectiveFilterState ?? 'optimal';

    let affectiveFilterAction: EmpathyDirective['affectiveFilterAction'] = 'encourage';
    let warmthBoost = false;
    let validationFocus = 'Focar na coragem de falar e no esforço comunicativo.';
    let normalizerMessagePattern: string | undefined = undefined;

    if (affectiveFilter === 'panic' || anxiety > 70) {
      affectiveFilterAction = 'deescalate';
      warmthBoost = true;
      normalizerMessagePattern = 'Não te preocupes nada com pequenos erros. O mais importante é estarmos a conversar naturalmente!';
      validationFocus = 'Validar a intenção do aluno e desmistificar a expetativa de perfeição.';
    } else if (input.recentErrorDetected) {
      normalizerMessagePattern = 'Muitos alunos falantes de Português hesitam nesta estrutura. É uma transição perfeitamente normal!';
      validationFocus = 'Elogiar o conteúdo da mensagem antes de qualquer ajuste subtil.';
    } else if (affectiveFilter === 'optimal' && anxiety < 30) {
      affectiveFilterAction = 'celebrate';
      validationFocus = 'Celebrar a fluidez e a autonomia da resposta do aluno.';
    }

    return {
      affectiveFilterAction,
      normalizerMessagePattern,
      warmthBoost,
      validationFocus
    };
  }
}

export const teacherEmpathy = new TeacherEmpathy();
