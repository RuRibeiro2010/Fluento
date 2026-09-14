/**
 * Memory Graph Engine (Student Digital Twin - Sprint 4)
 * Constructs and queries an internal knowledge graph relating:
 * concepts, vocabulary, common errors, competencies, prerequisites, and goals.
 * Allows Fluento to know exactly where every new piece of content fits.
 */

import { MemoryGraphData, MemoryGraphNode, MemoryGraphEdge } from './digital-twin-types';

export class MemoryGraphEngine {
  private graph: MemoryGraphData;

  constructor(initialData?: MemoryGraphData) {
    this.graph = initialData || this.generateDefaultGraph();
  }

  /**
   * Generates a rich initial knowledge graph for language learning.
   */
  private generateDefaultGraph(): MemoryGraphData {
    const nodes: MemoryGraphNode[] = [
      // Competencies
      { id: 'comp_speaking', label: 'Produção Oral Espontânea', category: 'competency', masteryScore: 62, forgettingRiskPercent: 20, lastPracticedIso: new Date().toISOString() },
      { id: 'comp_listening', label: 'Compreensão Auditiva Nativa', category: 'competency', masteryScore: 70, forgettingRiskPercent: 15, lastPracticedIso: new Date().toISOString() },
      { id: 'comp_grammar', label: 'Precisão Gramatical', category: 'competency', masteryScore: 75, forgettingRiskPercent: 30, lastPracticedIso: new Date().toISOString() },

      // Grammar Rules
      { id: 'gram_present_reg', label: 'Presente do Indicativo Regular', category: 'grammar_rule', masteryScore: 92, forgettingRiskPercent: 5, lastPracticedIso: new Date().toISOString() },
      { id: 'gram_ser_estar', label: 'Diferenciação Ser vs Estar', category: 'grammar_rule', masteryScore: 68, forgettingRiskPercent: 45, lastPracticedIso: new Date().toISOString() },
      { id: 'gram_pret_indef', label: 'Pretérito Indefinido', category: 'grammar_rule', masteryScore: 55, forgettingRiskPercent: 65, lastPracticedIso: new Date().toISOString() },
      { id: 'gram_subjuntivo', label: 'Presente do Subjuntivo (Dúvida/Desejo)', category: 'grammar_rule', masteryScore: 40, forgettingRiskPercent: 70, lastPracticedIso: new Date().toISOString() },

      // Communicative Functions
      { id: 'func_order_food', label: 'Pedir Comida e Bebidas em Restaurante', category: 'communicative_function', masteryScore: 88, forgettingRiskPercent: 10, lastPracticedIso: new Date().toISOString() },
      { id: 'func_hotel_checkin', label: 'Check-in e Soluções em Hotel', category: 'communicative_function', masteryScore: 80, forgettingRiskPercent: 20, lastPracticedIso: new Date().toISOString() },
      { id: 'func_express_opinion', label: 'Expressar Opinião e Desacordo Cortês', category: 'communicative_function', masteryScore: 50, forgettingRiskPercent: 50, lastPracticedIso: new Date().toISOString() },

      // User Goals
      { id: 'goal_travel', label: 'Viagem sem Bloqueios para Espanha', category: 'goal', masteryScore: 72, forgettingRiskPercent: 0, lastPracticedIso: new Date().toISOString() },
      { id: 'goal_career', label: 'Apresentações e Standups de Trabalho', category: 'goal', masteryScore: 58, forgettingRiskPercent: 0, lastPracticedIso: new Date().toISOString() },
    ];

    const edges: MemoryGraphEdge[] = [
      { sourceId: 'gram_present_reg', targetId: 'gram_ser_estar', relationship: 'prerequisite_of', strengthWeight: 0.9 },
      { sourceId: 'gram_present_reg', targetId: 'gram_pret_indef', relationship: 'prerequisite_of', strengthWeight: 0.8 },
      { sourceId: 'gram_pret_indef', targetId: 'gram_subjuntivo', relationship: 'prerequisite_of', strengthWeight: 0.85 },
      { sourceId: 'gram_ser_estar', targetId: 'func_hotel_checkin', relationship: 'reinforces', strengthWeight: 0.75 },
      { sourceId: 'gram_pret_indef', targetId: 'func_express_opinion', relationship: 'reinforces', strengthWeight: 0.8 },
      { sourceId: 'func_order_food', targetId: 'goal_travel', relationship: 'part_of_goal', strengthWeight: 0.95 },
      { sourceId: 'func_express_opinion', targetId: 'goal_career', relationship: 'part_of_goal', strengthWeight: 0.9 },
    ];

    return { nodes, edges };
  }

  public getGraph(): MemoryGraphData {
    return JSON.parse(JSON.stringify(this.graph));
  }

  /**
   * Updates or adds a node in the Knowledge Graph.
   */
  public updateNode(nodeId: string, patch: Partial<MemoryGraphNode>): MemoryGraphNode {
    const nodeIndex = this.graph.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex >= 0) {
      this.graph.nodes[nodeIndex] = {
        ...this.graph.nodes[nodeIndex],
        ...patch,
        lastPracticedIso: new Date().toISOString(),
      };
      return this.graph.nodes[nodeIndex];
    } else {
      const newNode: MemoryGraphNode = {
        id: nodeId,
        label: patch.label || nodeId,
        category: patch.category || 'grammar_rule',
        masteryScore: patch.masteryScore ?? 50,
        forgettingRiskPercent: patch.forgettingRiskPercent ?? 20,
        lastPracticedIso: new Date().toISOString(),
      };
      this.graph.nodes.push(newNode);
      return newNode;
    }
  }

  /**
   * Finds prerequisite nodes for a given node to check readiness.
   */
  public getPrerequisites(targetNodeId: string): MemoryGraphNode[] {
    const prereqEdges = this.graph.edges.filter(
      (e) => e.targetId === targetNodeId && e.relationship === 'prerequisite_of'
    );
    const prereqIds = new Set(prereqEdges.map((e) => e.sourceId));
    return this.graph.nodes.filter((n) => prereqIds.has(n.id));
  }

  /**
   * Identifies unfulfilled prerequisites blocking progression.
   */
  public getPrerequisiteBlockers(targetNodeId: string, minMasteryThreshold = 60): MemoryGraphNode[] {
    const prereqs = this.getPrerequisites(targetNodeId);
    return prereqs.filter((p) => p.masteryScore < minMasteryThreshold);
  }

  /**
   * Finds nodes with high forgetting risk (> 50%).
   */
  public getHighRiskNodes(): MemoryGraphNode[] {
    return this.graph.nodes.filter((n) => n.forgettingRiskPercent >= 50);
  }
}
