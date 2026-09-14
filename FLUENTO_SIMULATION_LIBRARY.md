# FLUENTO_SIMULATION_LIBRARY.md — Biblioteca Oficial de Simulação Pedagógica do Fluento

> **Documento Oficial Permanente e Vinculativo**  
> **Versão:** 1.0.0  
> **Estatuto:** Especificação de Arquitetura de Simulação, Validação Autómata e Benchmarking Pedagógico  
> **Documentos Correlatos:** `PRODUCT_VISION.md`, `PRODUCT_BLUEPRINT.md`, `BRAND_GUIDELINES.md`, `DESIGN_SYSTEM.md`, `ENGINEERING_STANDARDS.md`, `TEACHER_GUIDELINES.md`, `LEARNING_PRINCIPLES.md`, `FLUENTO_INTELLIGENCE_ARCHITECTURE.md`, `FLUENTO_PLAYBOOK.md`.

---

## 1. Purpose of the Simulation Library

A **Simulation Library do Fluento** é a infraestrutura conceptual e metodológica encarregue do **benchmarking pedagógico contínuo e da validação automatizada de sistemas antes da sua exposição ao utilizador final**.

No Fluento, **nenhuma alteração na Engenharia de Prompts, no Teaching Brain, na matriz de recasting ou nas rotas de personalização entra em produção sem passar por milhares de simulações bem-sucedidas contra a Simulation Library**.

### A Razão de Ser da Biblioteca
1. **Garantia de Não-Regressão Pedagógica:** Assegurar que atualizações nos modelos de linguagem (LLMs) não degradam a empatia, a escuta ativa ou a conformidade com as diretrizes do professor humano.
2. **Ambiente Controlado de Teste Estressante:** Avaliar o comportamento do professor virtual perante perfis extremos (ex.: alunos hiper-ansiosos, exaustos, com dislexia ou sem tempo).
3. **Validação Científica em Escala:** Medir o *Learning ROI*, a retenção e o *Flow State* em milhares de trajetórias sintéticas antes de qualquer lançamento Beta ou público.

---

## 2. Simulation Philosophy

A biblioteca é regida por seis princípios de simulação inegociáveis:

1. **Simular Primeiro, Medir Depois, Melhorar Sempre:** Toda a hipótese pedagógica é primeiramente simulada em ambiente fechado com perfis sintéticos antes de medir resultados em utilizadores reais.
2. **Nunca Assumir Qualidade por Defeito:** A saída estocástica de um modelo de IA é assumida como potencialmente defeituosa até ser auditada e comprovada pelas métricas do *Teacher Compliance Auditor*.
3. **Consistência Comportamental Absoluta:** O professor virtual deve atuar com a mesma serenidade, paciência e rigor ético independentemente do fornecedor de tecnologia de IA subjacente.
4. **Respeito Incondicional pelas Emoções do Aluno:** Os cenários de simulação tratam o filtro afetivo (*Krashen's Affective Filter*) e o medo de falhar como as variáveis mais críticas do processo de aquisição.
5. **Aptidão para Contextos do Mundo Real:** O sucesso numa simulação requer a demonstração de transferência prática do idioma para situações profissionais, sociais e de emergência autênticas.
6. **Zero Dados Reais em Simulação:** Toda a biblioteca utiliza exclusivamente **perfis sintéticos e fictícios**, garantindo 100% de privacidade e conformidade ética.

---

## 3. Simulation Dimensions

Cada cenário da biblioteca é construído através de uma matriz multidimensional de parâmetros que refletem a diversidade humana dos alunos.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   MATRIZ DE DIMENSÕES DE SIMULAÇÃO                       │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. PERFIL & DEMOGRAFIA  │ Idade, Profissão, Língua Nativa, Metas         │
│ 2. PROFICIÊNCIA CEFR    │ A0, A1, A2, B1, B2, C1, C2                       │
│ 3. ESTADO EMOCIONAL     │ Ansiedade, Vergonha, Entusiasmo, Fadiga, etc.    │
│ 4. CONTEXTO AMBIENTAL   │ Reunião, Aeroporto, Hospital, Viagem, etc.       │
│ 5. TEMPO DISPONÍVEL     │ 3, 5, 10, 15, 20, 30, 45, 60 ou 90 minutos       │
│ 6. ENERGIA & DISPOSIÇÃO │ Escala de 0 a 10                                 │
│ 7. MÉTRICAS DE CONFIANÇA│ Speaking, Listening, Vocab, Grammar (0–10)       │
│ 8. RETENÇÃO DE MEMÓRIA  │ Taxa de Decaimento de Retenção (0–10)            │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3.1. Proficiência Linguística (Escala CEFR)
- **A0 (Absolute Beginner):** Zero contacto prévio com o idioma. Requer andaimagem (*scaffolding*) total e apoio bilingue inicial.
- **A1 (Breakthrough):** Compreensão de expressões quotidianas e frases simples.
- **A2 (Waystage):** Capacidade de comunicação em tarefas simples e rotineiras.
- **B1 (Threshold):** Capacidade de manter conversas sobre temas familiares e exprimir opiniões.
- **B2 (Vantage):** Compreensão do essencial de textos complexos e fluência sem tensão.
- **C1 (Effective Operational Proficiency):** Expressão fluida, espontânea e flexível para fins sociais e profissionais.
- **C2 (Mastery):** Facilidade em compreender e produzir discurso altamente sofisticado.

### 3.2. Estados Emocionais Mapeados
Ansiedade oral, vergonha do sotaque, entusiasmo elevado, medo de avaliação, confiança robusta, frustração por estagnação, *burnout* profissional, curiosidade intelectual, stress de prazo, fadiga física, orgulho de conquista e desmotivação profunda.

### 3.3. Restrições Temporais de Sessão
`3 min` (micro-checkin), `5 min` (vitória rápida), `10 min` (sessão diária standard), `15 min` (treino focado), `20 min` (diálogo aprofundado), `30 min` (simulação de reunião/entrevista), `45 min` (imersão completa), `60 min` (estudo intensivo) e `90 min` (maratona de consolidação).

---

## 4. Simulation Packs (Os 20 Pacotes Fundamentais)

A biblioteca organiza os seus cenários em 20 pacotes pedagógicos temáticos:

- **Pack 01 — First Lesson & Onboarding:** Acolhimento de novos alunos, desarmamento de ansiedade e diagnóstico inicial sem pressão.
- **Pack 02 — Return After Absence:** Acolhimento sem culpa nem cobrança para alunos que regressam após semanas de inatividade.
- **Pack 03 — Job Interviews & Career:** Preparação intensiva para entrevistas de emprego, pitch profissional e negociação salarial.
- **Pack 04 — Travel & Global Mobility:** Check-in no aeroporto, imigração, reservas de hotel, orientação urbana e compras.
- **Pack 05 — Academic & University Life:** Apresentações de trabalhos, vida universitária em Erasmus e debates académicos.
- **Pack 06 — Corporate Business & Leadership:** Reuniões de equipa, condução de apresentações, negociação comercial e e-mails profissionais.
- **Pack 07 — Healthcare & Medical English:** Comunicação médico-paciente, passagem de turno e conferências clínicas internacionais.
- **Pack 08 — Hospitality & Tourism:** Atendimento ao cliente, gestão de reservas e resolução de reclamações em turismo.
- **Pack 09 — Speaking Anxiety & Blockades:** Desbloqueio oral especializado para alunos congelados pelo medo de errar.
- **Pack 10 — Free Casual Conversation:** Diálogo fluido e descontraído sobre cultura, cinema, viagens e vida quotidiana.
- **Pack 11 — Official Exam Preparation:** Treino tático para exames formais (IELTS, TOEFL, Cambridge FCE/CAE/CPE).
- **Pack 12 — Shadowing & Phonetic Mastery:** Prática de entoação, ritmo, nexo fonético e redução de esforço de pronúncia.
- **Pack 13 — Pronunciation & Accent Confidence:** Aceitação e lapidação da clareza fonética sem apagamento de sotaque nativo.
- **Pack 14 — Active Listening Comprehension:** Treino de compreensão auditiva com sotaques globais e velocidades variadas.
- **Pack 15 — Grammar Recovery & Recasting:** Consolidação de estruturas gramaticais com erros recorrentes via *recasting* natural.
- **Pack 16 — Vocabulary Expansion:** Expansão de repertório lexical e expressões idiomáticas de alto nível.
- **Pack 17 — Emergency & Real-Life Crisis:** Resolução de imprevistos reais (perda de documentos, emergências médicas, avarias).
- **Pack 18 — Micro-Learning & Busy Professional:** Sessões ultracurtas de 5 a 10 minutos para agendas executivas.
- **Pack 19 — Executive English & Negotiation:** Comunicação estratégica para quadros superiores e tomada de decisão.
- **Pack 20 — Advanced Fluency & Nuance:** Refinamento de subtilezas linguísticas, humor, ironia cultural e elegância de discurso.

---

## 5. Simulation Scenario Template

Todo o cenário da Simulation Library é redigido segundo a seguinte especificação rigorosa:

```json
{
  "simulationId": "SIM_PACK03_INT_001",
  "title": "Entrevista de Emprego sob Alta Pressão para Engenheiro de Software",
  "description": "Simulação de resposta a uma pergunta comportamental difícil numa entrevista para uma multinacional.",
  "profile": {
    "archetype": "engineer",
    "name": "Eng. Rodrigo Pereira (Sintético)",
    "age": 32,
    "profession": "Software Engineer",
    "nativeLanguage": "Portuguese",
    "targetLanguage": "English",
    "goal": "Aprovação em entrevista técnica internacional"
  },
  "level": "B1",
  "emotionalState": "Anxious & Perfectionist",
  "availableMinutes": 15,
  "energyLevel": 6,
  "confidences": {
    "speaking": 4,
    "listening": 7,
    "vocabulary": 6,
    "grammar": 5
  },
  "context": "Simulação de Entrevista de Emprego Remota via Videoconferência",
  "teacherStrategy": {
    "scaffoldingLevel": "Medium",
    "focus": "Método STAR (Situation, Task, Action, Result)",
    "recastingMode": "Involuntary & Continuous",
    "waitTimeSeconds": 4
  },
  "teacherForbiddenBehaviours": [
    "Corrigir erros de tempos verbais a meio da resposta da entrevista",
    "Usar frases robóticas ou saudações de assistente de IA",
    "Fazer monólogos teóricos sobre o método STAR"
  ],
  "expectedOutcome": {
    "studentTalkTimeRatio": ">= 65%",
    "flowStateIndex": ">= 70",
    "confidenceGain": "+2.0 points"
  },
  "scientificFoundation": "Krashen's Affective Filter Hypothesis + Sweller's Cognitive Load Theory"
}
```

---

## 6. Simulation Categories (Diversidade de Perfis)

A biblioteca categoriza os seus milhares de cenários por grupos socioprofissionais e perfis psicológicos:

- **Por Grupo Profissional:** Engenheiros, Médicos, Advogados, Programadores, Pilotos, Professores, Estudantes Universitários, Executivos, Empreendedores, Profissionais de Hotelaria e Aposentados.
- **Por Perfil Psicológico:** Pessoas Tímidas, Perfeccionistas Ansiosos, Alunos com Dislexia, Aprendizes Ultrarrápidos, Alunos que Requerem Muitas Revisões, Pessoas sem Tempo, Alunos Altamente Motivados e Alunos Desmotivados.

---

## 7. Evaluation Matrix

Cada cenário simulado é submetido a um cálculo ponderado de impacto pedagógico e comercial:

$$\text{Pedagogical Priority Score} = \frac{(\text{Impact} \times 0.3) + (\text{Frequency} \times 0.25) + (\text{Anxiety Reduction} \times 0.25) + (\text{Retention Value} \times 0.2)}{\text{Cognitive Load} \times 0.1}$$

### Parâmetros Avaliados:
1. **Impacto na Aprendizagem Real (1–10)**
2. **Frequência no Mundo Real (1–10)**
3. **Nível de Redução de Ansiedade (1–10)**
4. **Valor para Retenção de Longo Prazo (1–10)**
5. **Carga Cognitiva e Fator de Stress (1–10)**
6. **Valor Comercial & Propensão ao Cancelamento Evitado (1–10)**

---

## 8. Simulation Rules

Regras inquebráveis aplicadas a todos os testes na Simulation Library:

1. **Proibição de Saídas Artificiais:** Nenhuma resposta do professor pode soar como uma minuta de IA genérica.
2. **Respeito Absoluto pelas Emoções:** Se um perfil simulado exibe sinal de exaustão, o professor deve obrigatoriamente desacelerar.
3. **Fidelidade ao Playbook:** Todas as reações de recasting, tempo de espera e elogios específicos devem obedecer estritamente a `FLUENTO_PLAYBOOK.md`.
4. **Prioridade ao Student Talk Time:** Se o tempo de fala do professor exceder 40% da duração da sessão, a simulação é marcada como **FALHA DE CONFORMIDADE**.

---

## 9. Automated Validation Pipeline

A integração contínua pedagógica do Fluento segue o seguinte fluxo autómato de validação:

```
┌──────────────────────────────────────────────────────────────────────────┐
│              PIPELINE DE VALIDAÇÃO PEDAGÓGICA AUTOMÁTICA                 │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. COMMIT DE PROMPT / ENGINE │ Alteração na camada de IA/Orquestração    │
│                                                                          │
│ 2. EXECUÇÃO DA SIMULAÇÃO     │ Execução autómata contra os 20 Packs da   │
│                              │ Simulation Library (Milhares de sessões)  │
│                                                                          │
│ 3. AUDITORIA COMPORTAMENTAL  │ O Teacher Compliance Auditor avalia:      │
│                              │ - Student Talk Time > 60%                 │
│                              │ - Zero interrupções agressivas            │
│                              │ - Recasting natural aplicado              │
│                              │ - Respeito pelo Wait Time                 │
│                                                                          │
│ 4. EMISSÃO DO LAB REPORT     │ Cálculo de métricas e deteção de          │
│                              │ regressões emocionais ou cognitivas       │
│                                                                          │
│ 5. DECISÃO DE DEPLOYMENT     │ Score >= 90/100 -> Aprovado para Beta      │
│                              │ Score < 90/100  -> Bloqueado em Pipeline  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Continuous Evolution & Hall of Fame

A Simulation Library é um organismo vivo que expande o seu acervo à medida que novos domínios profissionais e especificidades psicológicas são identificados.

### Hall of Fame (Cenários Referência de Excelência)
- 🏆 **Melhor Acolhimento de Onboarding:** `SIM_PACK01_ONB_003` (Adolescente tímido com ansiedade de avaliação).
- 🏆 **Melhor Recuperação de Abandono:** `SIM_PACK02_RET_001` (Profissional que regressa após 60 dias de ausência).
- 🏆 **Melhor Preparação de Entrevista:** `SIM_PACK03_INT_001` (Engenheiro de Software em simulação sob pressão).
- 🏆 **Melhor Desbloqueio Oral:** `SIM_PACK09_ANX_005` (Médico congelado pelo medo de errar perante pacientes).
- 🏆 **Melhor Micro-Sessão Executiva:** `SIM_PACK18_MIC_002` (CEO com apenas 8 minutos livres entre reuniões).

---

## 11. Future Expansion Plan

O roadmap de longo prazo da Simulation Library projeta a expansão contínua para **mais de 10.000 cenários únicos e testáveis** nos próximos anos, cobrindo dezenas de variantes linguísticas, combinações de sotaques globais e nuances culturais de comunicação internacional.

---

## 12. Compatibility Review

### Auditoria Completa de Integração
1. **Compatibilidade de Arquitetura:** 100% compatível com a infraestrutura existente (`/lib/simulation/`). Nenhuma linha de código foi modificada ou quebrada.
2. **Conformidade com os Documentos Oficiais:** Totalmente alinhado com `PRODUCT_VISION.md`, `PRODUCT_BLUEPRINT.md`, `TEACHER_GUIDELINES.md`, `LEARNING_PRINCIPLES.md`, `FLUENTO_INTELLIGENCE_ARCHITECTURE.md` e `FLUENTO_PLAYBOOK.md`.
3. **Ausência de Conflitos ou Duplicações:** Zero redundâncias ou incoerências conceituais.
4. **Confirmação Oficial:** O documento **`FLUENTO_SIMULATION_LIBRARY.md`** passa a integrar a documentação oficial permanente do Fluento.

---
*Documento aprovado e integrado na documentação oficial permanente do Fluento.*
