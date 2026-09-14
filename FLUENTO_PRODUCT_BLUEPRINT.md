# Fluento Product Blueprint v1.0
*Official Product Specification & Architectural Vision Document*

---

## 1. Visão e Missão

### Visão
Ser o **AI Language Coach** de referência mundial, redefinindo a forma como adolescentes e adultos aprendem e atingem fluência natural em qualquer idioma. O Fluento não é um mero gerador de aulas nem um chatbot conversacional genérico; é uma plataforma inteligente com consciência pedagógica de longo prazo, capaz de guiar o aluno passo a passo rumo aos seus objetivos reais de vida, carreira e cultura.

### Missão
Proporcionar uma experiência de aprendizagem hiperpersonalizada, imersiva, humana e adaptativa, onde cada segundo investido se traduz em confiança comunicativa, domínio ativo e progresso tangível.

---

## 2. Filosofia de Ensino & Princípios Fundamentais

1. **AI Language Coach, Não Apenas Chatbot:** O Fluento compreende a trajetória completa do aluno, lembra-se do seu histórico de erros e conquistas, e decide proativamente o que ensinar em cada momento.
2. **Suporte Universal Multi-Língua:** O utilizador pode aprender qualquer idioma (`targetLanguage`), definindo livremente a sua língua nativa (`nativeLanguage`). O sistema não assume o inglês como idioma predefinido.
3. **Imersão com Scaffolding Inteligente:** O Professor Virtual fala preferencialmente na língua alvo (`targetLanguage`). Se detetar dificuldades, hesitação ou quando o aluno acionar o botão *"Explain Better"*, explica temporariamente na língua nativa (`nativeLanguage`), usando analogias e exemplos simples, regressando **imediatamente** à língua alvo.
4. **Conversas Naturais e Realistas:** Diálogos fluidos sem interrupções constantes ou correções intrusivas. As correções gramaticais e fonéticas são apresentadas nos momentos pedagógicos certos, acompanhadas de treino direcionado.
5. **Decisão Pedagógica Justificada:** Toda a IA gera um raciocínio/justificação interna (*rationale*) antes de propor qualquer atividade, garantindo que nada é aleatório.
6. **Design Premium para Adolescentes e Adultos:** Estética sofisticada, sóbria e profissional. Sem elementos infantis ou ruído visual desnecessário.
7. **Sentimento de Conversa e Evolução:** O aluno sente que está a manter diálogos reais e a evoluir diariamente, e não apenas a resolver exercícios mecânicos.

---

## 3. Arquitetura do Produto & Clean Architecture

O Fluento segue rigorosamente os princípios de **Clean Architecture**, dividindo responsabilidades em camadas bem delimitadas:

```
[ UI / Presentation Layer ]  --->  React 18 + Tailwind CSS + Lucide Icons
          │
          ▼
[ Application / Domain Layer ] ---> Journey Engine, AI Brain, Teacher Engine
          │
          ▼
[ Memory & Content Layer ]   ---> Longitudinal Memory, Student Model, Lesson Library
          │
          ▼
[ Infrastructure & Services ] ---> Gemini SDK / AI Providers, Supabase / Local Persistence
```

### Módulos Principais (`/lib`)
- `/lib/brain/`: **AI Brain, Student Model, Weakness Engine, Review Engine, Adaptation Engine, Recommendations.**
- `/lib/content/`: **Quality Score Engine, Similarity Engine, Lesson Library, Lesson Ranking, Lesson Builder, Templates.**
- `/lib/journey/`: **Learning Graph, Goal Engine, Checkpoint Engine, Roadmap Engine, Milestones, Unlocks, Path Generator.**
- `/lib/teacher/`: **Adaptive Teaching, Immersion Engine, Help Engine, Translation Engine, Explanation Engine.**
- `/lib/memory/`: **Engine de Memória Longitudinal (Perfil, Vocabulário, Gramática, Conversação, Desempenho, Motivação, DNA).**

---

## 4. Fluxo Completo do Utilizador

1. **Landing Page:** Apresentação clara da proposta de valor — conversas imersivas com um AI Coach personalizado.
2. **Login & Autenticação:** Acesso seguro com perfil persistente.
3. **Onboarding Dinâmico:** Captura de língua nativa, língua alvo, nível estimado CEFR, objetivos de vida (trabalho, viagens, exames), hobbies, profissão e disponibilidade.
4. **Dashboard Principal:** Apresentação da Jornada Inteligente, próximo passo recomendado pelo AI Brain, estatísticas por competência, estado do vocabulário e recomendações do Coach.
5. **Aula Modular:** Sessão interativa com blocos adaptativos (Introdução, Vocabulário, Gramática, Roleplay com Professor Virtual, Desafio e Resumo).
6. **Revisão Inteligente & Feedback:** Processamento automático do desempenho, cálculo da curva de esquecimento (SM-2) e atualização do Student Model.
7. **Próximo Plano de Ação:** Atualização automática do Roadmap de Aprendizagem e das Recomendações.

---

## 5. Módulos Inteligentes em Detalhe

### A. AI Brain & Student Model
Mantém o estado permanente do aluno:
- **Nível CEFR Atual:** (A1, A2, B1, B2, C1, C2).
- **Competências Independentes (%):** Grammar, Vocabulary, Listening, Speaking, Reading, Writing.
- **Métricas Psicológicas:** Confiança, Velocidade de Aprendizagem, Motivação, Consistência, Índice de Burnout.
- **Inventário de Vocabulário Ativo vs Passivo:** Estado de progressão (*Recognizes* → *Understands* → *Uses with help* → *Uses naturally*).

### B. Weakness Engine & Review Engine
- **Detecta Automaticamente:** Tempos verbais problemáticos, palavras esquecidas, falhas fonéticas e vícios de sintaxe.
- **Revisão Espaçada (Spaced Repetition):** Algoritmo baseado na curva de esquecimento $R = e^{-t/S}$. Se a retenção de um tópico descer abaixo dos **70%**, este reentra automaticamente no plano de estudo sem intervenção manual.

### C. Biblioteca Inteligente de Aulas & Reutilização Pedagógica
- **Quality Score (0-100):** Calculado por $0.30 \times \text{Completion} + 0.25 \times \text{Retention} + 0.20 \times \text{Improvement} + 0.15 \times \text{Satisfaction} + 0.10 \times \text{Confidence}$.
- **Membros Premium:** Aulas com $\text{QualityScore} \ge 90$ integram o catálogo de inspiração.
- **Garantia de Não-Repetição:** O mesmo aluno nunca recebe a mesma aula. O sistema inspira-se em aulas de sucesso de alunos semelhantes (via *Similarity Engine*), mas adapta sempre exemplos, contextos, nomes e frases.

### D. Learning Journey Engine & Learning Graph
- **Grafo Pedagógico Directo (DAG):** Garante que pré-requisitos gramaticais e lexicais são dominados antes do desbloqueio de nós avançados.
- **Checkpoints CEFR:** Avaliações rigorosas nos patamares A1 a C2.
- **Missões Adaptativas:** Percursos estruturados de vários cenários (ex: *Missão Londres: Aeroporto → Hotel → Restaurante → Conversa Final*).

### E. Professor Virtual & Immersion Engine
- **Imersão Escalonada:**
  - A1: 40% Língua Alvo / 60% Língua Nativa
  - A2: 60% Língua Alvo / 40% Língua Nativa
  - B1: 80% Língua Alvo / 20% Língua Nativa
  - B2: 90% Língua Alvo / 10% Língua Nativa
  - C1/C2: 100% Língua Alvo
- **Help Engine & Botão "Explain Better":** Explicações imediatas na língua nativa com analogias e comparações, regressando de seguida à língua alvo.
- **Translation Engine:** Tradução direta é sempre o **último recurso**. A prioridade é: Contexto → Exemplo → Imagem/Visual → Analogia → Tradução Direta.

---

## 6. Gamificação Profissional & Progresso

- **Marcos Importantes (Milestones):** Primeiras conversas completas, 100 palavras dominadas, streaks de 7 dias, entrevistas simuladas e XP acumulado.
- **Sistema de Desbloqueios:** Novos cenários de roleplay, novos professores virtuais, novos desafios de sotaque e novos formatos de debate.
- **Aesthetic:** Interface sóbria, elegante, sem bonecos caricaturais ou distrações infantis.

---

## 7. Preparação para o Futuro & Roadmap de Evolução

### Roadmap Tecnológico
- **Versão 1.0 (Atual):** AI Brain Core, Student Model, Longitudinal Memory, Learning Graph, Journey Engine, Adaptive Teaching Engine, Modular Lesson Builder, Quality Score e Biblioteca de Aulas.
- **Versão 2.0:** Suporte nativo a voz em tempo real (Gemini Live & OpenAI Realtime API), múltiplos avatares virtuais com suporte de vídeo e sincronização multi-dispositivo offline-first.
- **Versão 3.0:** Aplicativos nativos iOS/Android, Marketplace de Cenários e Professores Especialistas, e integrações para empresas/universidades.

### Isolamento de Fornecedor de IA
Todas as chamadas a modelos de linguagem e voz utilizam interfaces abstratas (`AIProviderAdapter`), permitindo alternar suavemente entre Gemini, OpenAI, Claude, DeepSeek ou modelos locais sem quebrar as regras de negócio.

---

## 8. Critérios de Qualidade e Aceitação

Para qualquer futura funcionalidade do Fluento:
1. **0 Erros e 0 Warnings:** Compilação TypeScript 100% limpa.
2. **Nenhuma Regressão:** Manutenção rigorosa das funcionalidades e arquitetura existentes.
3. **Separação de Camadas:** Zero regras de negócio dentro de componentes de UI.
4. **Experiência Responsiva e Fluida:** Execução rápida, estados de carregamento elegantes e acessibilidade universal.

---
*Fluento Product Blueprint v1.0 — Confidencial & Propriedade do Projeto Fluento*
