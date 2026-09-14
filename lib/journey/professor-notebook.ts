/**
 * Professor Notebook (Sprint A)
 * Internal pedagogical observations log recorded by the AI Teacher.
 * Examples: "Student spoke spontaneously", "Confidence increased", "Avoids past tense".
 * CRITICAL RULE: Never shown directly to the user in the UI. Used solely to refine future decisions.
 */

import { ProfessorNotebookEntry } from './journey-orchestrator-types';

export class ProfessorNotebook {
  private entries: ProfessorNotebookEntry[];

  constructor(initialEntries?: ProfessorNotebookEntry[]) {
    this.entries = initialEntries || this.generateInitialNotebookEntries();
  }

  private generateInitialNotebookEntries(): ProfessorNotebookEntry[] {
    return [
      {
        id: 'note_1',
        timestampIso: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        observationCategory: 'spontaneous_speaking',
        observationText: 'Aluno respondeu espontaneamente com frases completas sem pausar para tradução mental.',
        pedagogicalActionTaken: 'Aumentada velocidade de fala do professor para 1.0x na sessão seguinte.',
        internalOnlyFlag: true,
      },
      {
        id: 'note_2',
        timestampIso: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        observationCategory: 'grammar_avoidance',
        observationText: 'Demonstra ligeira hesitação em conectar frases com subjuntivo; tende a simplificar.',
        pedagogicalActionTaken: 'Injetado conector de discurso na revisão espaçada de forma natural em contexto.',
        internalOnlyFlag: true,
      },
      {
        id: 'note_3',
        timestampIso: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        observationCategory: 'effective_pedagogy',
        observationText: 'Analogias do ambiente de tecnologia aumentaram a retenção imediata em +30%.',
        pedagogicalActionTaken: 'Registada preferência por analogias corporativas no Lesson DNA.',
        internalOnlyFlag: true,
      },
    ];
  }

  /**
   * Adds an internal pedagogical entry to the Professor's Notebook.
   */
  public logObservation(
    category: ProfessorNotebookEntry['observationCategory'],
    observationText: string,
    pedagogicalActionTaken: string
  ): ProfessorNotebookEntry {
    const newEntry: ProfessorNotebookEntry = {
      id: `prof_note_${Date.now()}`,
      timestampIso: new Date().toISOString(),
      observationCategory: category,
      observationText,
      pedagogicalActionTaken,
      internalOnlyFlag: true,
    };
    this.entries.unshift(newEntry);
    if (this.entries.length > 50) {
      this.entries.pop();
    }
    return { ...newEntry };
  }

  /**
   * Retrieves all internal entries for orchestrator consumption.
   */
  public getEntries(): ProfessorNotebookEntry[] {
    return this.entries.map((e) => ({ ...e }));
  }

  /**
   * Generates a concise summary of recent pedagogical insights.
   */
  public getRecentInsightsSummary(): string {
    if (this.entries.length === 0) return 'Sem observações suficientes ainda.';
    return this.entries
      .slice(0, 3)
      .map((e) => `[${e.observationCategory}] ${e.observationText}`)
      .join(' | ');
  }
}
