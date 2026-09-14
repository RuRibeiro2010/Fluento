/**
 * FLUENTO ADAPTIVE LEARNING PLANNER - CONVERSATION PLANNER
 * 
 * Selects or generates conversation scenario configurations tailored to the student's
 * professional domain, interests, and target CEFR level.
 */

import { StudentDigitalTwinState } from '@/src/lib/student-digital-twin';
import { ConversationScenarioConfig } from './types';
import { CEFRLevel } from '@/types/brain';

export class ConversationPlanner {
  private predefinedScenarios: ConversationScenarioConfig[] = [
    {
      scenarioId: 'scen_tech_sync',
      title: 'Daily Standup Sync em TI',
      roleplayRole: 'Tech Lead / Scrum Master',
      contextDescription: 'Apresentar progresso de sprint, desbloqueios e tarefas do dia em equipa de tecnologia.',
      professionalDomain: 'Tecnologia / Engenharia de Software',
      suggestedCefr: 'B1'
    },
    {
      scenarioId: 'scen_exec_update',
      title: 'Atualização de Projeto para Direção',
      roleplayRole: 'Diretor / VP Executivo',
      contextDescription: 'Apresentar métricas chave, riscos e próximos passos de um projeto estratégico.',
      professionalDomain: 'Gestão / Negócios',
      suggestedCefr: 'B2'
    },
    {
      scenarioId: 'scen_client_onboarding',
      title: 'Acolhimento de Novo Cliente Internacional',
      roleplayRole: 'Cliente Internacional',
      contextDescription: 'Reunião inicial para alinhar expetativas, prazos e requisitos de serviço.',
      professionalDomain: 'Vendas / Apoio ao Cliente',
      suggestedCefr: 'B1'
    },
    {
      scenarioId: 'scen_casual_coffee',
      title: 'Café Casual & Networking',
      roleplayRole: 'Colega de Trabalho de Filial Estrangeira',
      contextDescription: 'Conversa informal de networking durante uma pausa para café num evento do setor.',
      suggestedCefr: 'A2'
    }
  ];

  public planScenario(
    twin: StudentDigitalTwinState,
    targetCefr: CEFRLevel
  ): ConversationScenarioConfig {
    const domain = twin.goal.professionalDomain;

    // Try matching domain
    if (domain) {
      const match = this.predefinedScenarios.find(
        s => s.professionalDomain && s.professionalDomain.toLowerCase().includes(domain.toLowerCase())
      );
      if (match) return match;
    }

    // Default fallback based on CEFR
    const cefrMatch = this.predefinedScenarios.find(s => s.suggestedCefr === targetCefr);
    if (cefrMatch) return cefrMatch;

    return this.predefinedScenarios[3]; // Casual coffee
  }
}

export const conversationPlanner = new ConversationPlanner();
