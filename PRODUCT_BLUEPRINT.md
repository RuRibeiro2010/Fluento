# Fluento Official Product Blueprint v1.0

## Documento de Consolidação e Arquitetura do Produto

Este documento é a referência técnica e funcional oficial do Fluento ("Product Blueprint v1.0").
O seu propósito é estruturar e documentar de forma detalhada a jornada do aluno, a arquitetura de software de cada módulo, a interação entre motores pedagógicos e de Inteligência Artificial, e os modelos de dados e decisão que sustentam a plataforma.

---

## 1. Visão Geral do Produto

### 1.1 Resumo
O **Fluento** é uma plataforma avançada de aprendizagem personalizada de línguas orientada por IA e ciência cognitiva. Combina orquestração pedagógica adaptativa, modelação de esquecimento (curva de Ebbinghaus), tutoria baseada em empatia e presença contínua para formar o mais eficaz Professor Virtual do mundo.

### 1.2 Missão
Transformar vidas através da fluência linguística, capacitando alunos de todas as idades a comunicarem com confiança em situações reais (trabalho, viagens, estudos no estrangeiro, exames e vida pessoal).

### 1.3 Público-Alvo
- **Profissionais e Executivos**: Necessitam de inglês/espanhol/alemão para reuniões, entrevistas, apresentações e negociações corporativas.
- **Estudantes e Académicos**: Preparação para exames internacionais (IELTS, TOEFL, Cambridge, DELE, Goethe, HSK, TOPIK).
- **Viajantes e Expatriados**: Pessoas que procuram integração social rápida e conversação fluida sem ansiedade.
- **Empresas e Instituições de Ensino**: Multi-seat corporate e pacotes de educação para formação de equipas.

### 1.4 Princípios Pedagógicos Fundamentais
1. **Confiança e Redução de Ansiedade**: Priorizar a capacidade de resposta espontânea em vez da perfeição gramatical imediata.
2. **Ciência Cognitiva Ativa**: Uso exclusivo de métodos validados (*Active Recall*, *Spaced Repetition*, *Interleaving*, *Comprehensible Input*).
3. **Hiperpersonalização Continuada**: Nenhum aluno possui o mesmo plano ou a mesma aula que outro.

---

## 2. Jornada Completa do Utilizador

### 2.1 Mapeamento do Percurso

```
[Website / Landing] ──► [Demonstração Rápida] ──► [Autenticação / Signup]
                                                            │
┌───────────────────────────────────────────────────────────┘
▼
[Onboarding & Anamnese] ──► [Avaliação Adaptativa (Diagnostic)]
                                          │
┌─────────────────────────────────────────┘
▼
[Plano Personalizado Gerado] ──► [Primeira Missão Prática]
                                          │
┌─────────────────────────────────────────┘
▼
[Primeira Aula com Professor Virtual] ──► [Dashboard & Daily Flow]
                                                  │
                                                  ▼
                                    [Revisões Espaçadas & Certificação]
```

### 2.2 Detalhe de Cada Etapa

| Etapa | Objetivo Pedagógico | Informação Recolhida / Processada | Decisão Tomada pela IA | Próximo Passo |
| :--- | :--- | :--- | :--- | :--- |
| **1. Landing / Demo** | Apresentar o conceito e demonstrar empatia do Professor Virtual. | Nível percebido inicial, idioma desejado. | Seleção de excerto conversacional de demonstração. | Criar conta. |
| **2. Onboarding** | Mapear motivações profundas, rotina diária e contexto profissional. | Profissão, objetivos específicos (ex: reuniões, exames), disponibilidade diária, nível de ansiedade. | Definição da persona do professor e carga cognitiva ideal. | Avaliação Adaptativa. |
| **3. Avaliação Adaptativa** | Determinar o nível CEFR real (A1 a C2) sem causar stress. | Precisão gramatical, vocabulário ativo, tempo de resposta (hesitação), escuta. | Mapeamento no `progression-engine` (pontuação 0-100 por competência). | Plano Personalizado. |
| **4. Plano Personalizado** | Estabelecer a rota de aprendizagem ajustada ao objetivo. | Frequência de estudo, prazos e metas profissionais/pessoais. | Formulação de currículo dinâmico e sessões prioritárias. | Primeira Missão. |
| **5. Primeira Missão** | Quebrar o gelo e gerar uma vitória rápida de confiança. | Primeira interação oral/escrita real em contexto imersivo. | Cálculo do índice de segurança psicológica (`trust-engine`). | Primeira Aula. |
| **6. Primeira Aula** | Estabelecer o relacionamento com o Professor Virtual escolhido. | Reação a correções, fadiga inicial, clareza nas explicações. | Atribuição de tom e ritmo adaptativo (`empathy-engine`). | Dashboard Principal. |
| **7. Dashboard Diário** | Oferecer clareza sobre prioridades do dia (Revisão vs. Novo Conteúdo). | Estado de retenção (curva de Ebbinghaus) e fadiga acumulada. | Cálculo da prioridade de revisão (`review-priority`). | Início da Sessão Diária. |
| **8. Evolução & Certificação** | Validar competências adquiridas e certificar o progresso. | Pontuações acumuladas nas missões e simuladores de exames. | Emissão de relatórios e recomendações de progresso CEFR. | Nível Seguinte. |

---

## 3. Arquitetura Funcional

O Fluento é estruturado em sub-sistemas modulares com responsabilidades estritamente isoladas:

### 3.1 AI Teaching Orchestrator (`/lib/orchestrator/`)
- **`learning-state.ts`**: Classifica o estado dinâmico do aluno (*Flow State*, *Burnout Risk*, *Needs Review*, *Needs Confidence*).
- **`coaching-engine.ts`**: Atribui e gere as personas dos professores virtuais (*Prof. Sofia*, *Prof. Marcos*, *Prof. Elena*, *Prof. Lucas*).
- **`strategy-selector.ts`**: Determina a estratégia de ensino (*Socratic Guidance*, *Immersive Roleplay*, *Passive Recovery*).
- **`decision-engine.ts`**: Produz justificações pedagógicas explícitas para cada decisão do sistema.
- **`review-priority.ts`**: Modela a retenção baseada na curva de esquecimento de Ebbinghaus.
- **`progression-engine.ts`**: Avalia o progresso contínuo nas competências CEFR.
- **`teaching-orchestrator.ts`**: Ponto central de orquestração de sessões diárias.

### 3.2 Fluento Intelligence 1.0 (`/lib/intelligence/`)
- **`anonymization.ts`**: Anonimiza métricas do aluno em conformidade com o RGPD.
- **`pattern-engine.ts`**: Analisa padrões agregados por profissão e dados demográficos.
- **`personalization-engine.ts`**: Refina os modelos de afinidade individual.
- **`prediction-engine.ts`**: Prevê risco de abandono e calcula a probabilidade de esquecimento.
- **`benchmarking.ts`**: Compara a velocidade de progresso com coortes equivalentes.

### 3.3 Trust, Safety & Quality Platform (`/lib/quality/`)
- **`response-validator.ts`**: Inspeção pré-flight da coerência, naturalidade e nível CEFR.
- **`hallucination-check.ts`**: Proteção contra regras gramaticais falsas ou incorretas.
- **`ai-supervisor.ts`**: Middleware de supervisão que refina ou regenera respostas fracas.
- **`safety-engine.ts`**: Filtro de conteúdos impróprios, profanidade e viés cultural.
- **`lesson-auditor.ts`**: Auditoria de lições avaliando carga cognitiva e probabilidade de sucesso.
- **`explanation-validator.ts` & `pedagogy-validator.ts`**: Garantia de simplicidade e clareza pedagógica.

### 3.4 Fluento Human Experience (`/lib/human/`)
- **`relationship-engine.ts`**: Gestão do relacionamento de longo prazo entre professor e aluno.
- **`conversation-memory.ts`**: Memória episódica de vitórias e dificuldades anteriores.
- **`empathy-engine.ts`**: Modulação do tom de voz e energia segundo o estado emocional do aluno.
- **`celebration-engine.ts`**: Celebração madura e profissional de marcos atingidos.
- **`trust-engine.ts`**: Avaliação da segurança psicológica do aluno.
- **`coach-presence.ts`**: Presença atenciosa e saudações ajustadas à hora do dia.

### 3.5 Platform Ecosystem (`/lib/platform/`)
- **`subscription-engine.ts`**: Controlo de acesso por plano (Free, Plus, Pro, Teams, Enterprise, Education, Family).
- **`organization-engine.ts` & `family-engine.ts`**: Gestão de equipas, atribuição de licenças e controlos familiares.
- **`certification-engine.ts`**: Preparação direcionada para exames oficiais internacionais.
- **`notification-engine.ts`**: Agendamento inteligente de notificações respeitando horários de descanso.
- **`localization-engine.ts`**: Suporte para tradução da interface em múltiplos idiomas.
- **`offline-cache.ts` & `autosave.ts`**: Sincronização offline e persistência local resiliente.

### 3.6 Design System Reutilizável (`/src/components/design-system/`)
- Componentes padronizados (`Button`, `Input`, `Card`, `Badge`, `Modal`, `Typography`, `Layout`, `States`).

---

## 4. Fluxos Entre Módulos

```
                                 ┌───────────────────────────┐
                                 │   Aluno Interage na UI    │
                                 └─────────────┬─────────────┘
                                               │
                                               ▼
                                 ┌───────────────────────────┐
                                 │   Smart Journey Router    │
                                 └─────────────┬─────────────┘
                                               │
                                               ▼
                                 ┌───────────────────────────┐
                                 │ Teaching Orchestrator Hub │
                                 └─────────────┬─────────────┘
                                               │
              ┌────────────────────────────────┼────────────────────────────────┐
              ▼                                ▼                                ▼
   ┌────────────────────┐            ┌───────────────────┐            ┌───────────────────┐
   │ Fluento Human Exp. │            │  AI Quality Guard │            │ Fluento Intel.    │
   │ - Empathy Engine   │            │ - Response Valid. │            │ - Prediction Eng. │
   │ - Memory Callbacks │            │ - AI Supervisor   │            │ - Personalization │
   └──────────┬─────────┘            └─────────┬─────────┘            └─────────┬─────────┘
              │                                │                                │
              └────────────────────────────────┼────────────────────────────────┘
                                               │
                                               ▼
                                 ┌───────────────────────────┐
                                 │ Output Refinado no Ecrã   │
                                 └─────────────┬─────────────┘
                                               │
                                               ▼
                                 ┌───────────────────────────┐
                                 │ Persistência & Sync Local │
                                 └───────────────────────────┘
```

---

## 5. Dados Mantidos Sobre o Aluno

1. **Perfil Demográfico e Profissional**: Profissão (ex: Engenharia, Medicina, Vendas), áreas de interesse, objetivos explícitos.
2. **Modelo Gramatical e Léxico**: Banco de vocabulário dominado, lista de palavras frágeis, erros gramaticais recorrentes.
3. **Métricas Cognitivas**: Taxa de esquecimento calculada, tempo de hesitação médio, carga cognitiva percebida.
4. **Histórico Emocional e Relação**: Nível de ansiedade auto-reportado, índice de confiança, registo de momentos marcantes.
5. **Progresso CEFR por Domínio**: Pontuações separadas para *Listening*, *Speaking*, *Reading*, *Writing*, *Fluency* e *Grammar*.

---

## 6. Personalização

A IA personaliza dinamicamente:
- **Dificuldade e Ritmo**: Ajuste automático da velocidade de fala e complexidade do vocabulário conforme o nível CEFR.
- **Exemplos e Contexto**: Utilização de cenários práticos da profissão do aluno (ex: código e arquitetura para programadores; diagnósticos para profissionais de saúde).
- **Seleção de Professor**: Atribuição da persona pedagógica mais adequada à personalidade e objetivos do estudante.
- **Estratégia de Correção**: Alternância entre correção imediata (em fases de precisão) e correção diferida (em fases de fluência).

---

## 7. Experiência de Aprendizagem

- **Conversação Imersiva**: Diálogo natural em tempo real com o Professor Virtual.
- **Simulações do Mundo Real**: Missões práticas como entrevistas de emprego, reuniões de negociação e check-in em aeroportos.
- **Técnica de Shadowing & Pronúncia**: Prática ativa de repetição e ritmo fonético.
- **Revisão Inteligente**: Sessões diárias focadas estritamente em itens com elevado risco de esquecimento.
- **Reflexão Metacognitiva**: Pequenos momentos no final da aula para avaliar como o aluno se sentiu e o que achou difícil.

---

## 8. Filosofia Pedagógica

| Técnica Científica | Quando é Utilizada? | Porquê? |
| :--- | :--- | :--- |
| **Active Recall** | Em todas as sessões de revisão. | Força o cérebro a recuperar ativamente a informação, consolidando conexões sinápticas. |
| **Spaced Repetition** | Calculado diariamente via Ebbinghaus. | Previne o esquecimento ao rever a matéria exatamente antes da curva de retenção cair. |
| **Comprehensible Input** | Durante o diálogo do Professor Virtual. | Fornece input no nível $i+1$ (ligeiramente acima do nível atual do aluno) para incentivar a evolução. |
| **Flow State Matching** | Ajustado durante a aula. | Mantém o desafio equilibrado com a habilidade, evitando aborrecimento ou ansiedade. |
| **Deliberate Practice** | Em missões e roleplays. | Foco intensivo em pontos fracos específicos até alcançar a mestria. |

---

## 9. Inteligência Artificial e Limites éticos

- **Transparência**: O sistema indica sempre o motivo pedagógico de uma recomendação.
- **Supervisão Contínua**: Respostas geradas por modelos de linguagem são inspecionadas por validadores de qualidade (`ai-supervisor` e `safety-engine`) antes de serem exibidas.
- **Não-Manipulação**: Banimento estrito de ganchos de culpa (*guilt trips* ou contadores agressivos de sequência).

---

## 10. Escalabilidade e Extensibilidade

- **Suporte Multi-Idioma**: Arquitetura pronta para adicionar novos idiomas de destino (Inglês, Espanhol, Francês, Alemão, Italiano, Mandarim, Japonês, Coreano).
- **Multi-Tenant e Enterprise**: Gestão corporativa para empresas e escolas com dashboards agregados.
- **Resiliência Offline**: Operação contínua do cliente mesmo com interrupções temporárias de rede.

---

## 11. Roadmap Técnico e Funcional

- **[Fase 1 a 19 - Concluído]**: Módulos core de orquestração, inteligência, qualidade, empatia, presença e experiência humana.
- **[Fase 20 - Concluído]**: Integração do Design System, consolidação arquitetural e documentação do Product Blueprint.
- **[Fases Futuras - Planeado]**:
  - Expansão de modelos nativos de voz em tempo real.
  - Avaliação fonética com feedback espectrográfico.
  - Certificação oficial verificada por entidades parceiras.

---

## 12. Regras Permanentes Oficiais

1. **Foco no Aluno**: Qualquer funcionalidade deve responder a *"Como é que isto ajuda o aluno a aprender melhor?"*.
2. **Regra de Ouro**: Perguntar sempre *"O que faria um excelente professor humano nesta situação?"* e reproduzir essa experiência com tecnologia.
3. **Respeito Emocional**: Nunca culpar ou pressionar o utilizador.
4. **Excelência Técnica**: Manter o código limpo, sem warnings, sem erros de compilação, com arquitetura modular e documentada.
5. **Prevalência Documental**: Este Product Blueprint v1.0 e o Product Vision v1.0 prevalecem sobre quaisquer opiniões temporárias em decisões de desenvolvimento.
