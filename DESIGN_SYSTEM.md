# Fluento Official Design System v1.0

## Contexto
Este documento passa a ser o Design System oficial do Fluento.
O seu objetivo é transformar os princípios definidos no Product Vision, Product Blueprint e Brand Guidelines em regras concretas de design, interatividade e desenvolvimento.

Este documento não altera a arquitetura existente nem implementa novas funcionalidades. Serve como padrão normativo permanente para toda a interface visual e comportamental do Fluento.

---

## 1. Filosofia Visual
Inspirado na precisão, clareza e elegância das melhores interfaces de produtividade e ecossistemas contemporâneos (Apple, Linear, Stripe, OpenAI), o Fluento possui uma identidade visual própria:
- **Calm & Focused**: Ambiente sóbrio em tons escuros e ardósia com elevado contraste e tipografia cristalina.
- **Invisible Design**: O design desaparece para dar destaque total ao conteúdo e à aprendizagem.
- **Premium & Acolhedor**: Nunca infantil, nunca excessivamente saturado, refinado e focado na maturidade do aluno.

---

## 2. Novos Princípios Oficiais de Interação

### 2.1 Calm Motion
As animações transmitem calma, confiança e fluidez. Nunca competem com a atenção do aluno nem causam fadiga visual.

### 2.2 Motion With Purpose
Toda a animação ou transição existe para responder a um objetivo pedagógico ou de usabilidade (orientar o scroll, confirmar ações, indicar carregamento ou celebrar um marco).

### 2.3 Invisible Design
O melhor design é aquele que o utilizador não nota conscientemente, permitindo foco absoluto na retenção linguística e no diálogo.

### 2.4 One Goal Per Screen
Cada ecrã ou modal possui um único objetivo principal. Elementos secundários são organizados com menor hierarquia visual para evitar sobrecarga cognitiva.

### 2.5 Every Click Has a Purpose
Nenhuma interação ou botão existe sem uma consequência clara para o progresso do aluno. Os rótulos indicam exatamente o resultado da ação (`Começar Aula`, `Rever Vocabulário`, `Continuar`).

---

## 3. Cores e tokens de Design

| Categoria | Token / Valor | Utilização |
| :--- | :--- | :--- |
| **Fundo Principal** | `slate-950` (`#020617`) | Canvas imersivo de fundo para reduzir o cansaço ocular. |
| **Superfície / Card** | `slate-900` (`#0f172a`) | Contentores de informação, modais e cartões. |
| **Bordas & Divisores**| `slate-800` (`#1e293b`) | Linhas de separação e bordas subtis com contraste suave. |
| **Texto Principal** | `slate-100` / `white` | Títulos e corpo de texto com conformidade WCAG AAA/AA. |
| **Texto Secundário** | `slate-400` | Subtítulos, descrições secundárias e legendas. |
| **Acento Confiança** | `indigo-600` / `indigo-500`| Botões de ação primários, marcas de foco e destaques. |
| **Progresso / Sucesso**| `emerald-500` / `emerald-400`| Confirmação de acertos, mestria de vocabulário e conquistas. |
| **Atenção / Alerta** | `amber-500` / `amber-400` | Alertas pedagógicos de revisão pendente ou foco necessário. |
| **Erro Crítico** | `rose-600` / `rose-400` | Erros estritamente críticos ou ações de eliminação. |

---

## 4. Tipografia e Hierarquia

- **Fonte Principal**: Sans-serif moderna, otimizada para legibilidade em ecrãs de alta densidade (Inter / system-ui).
- **Escala Tipográfica Padronizada**:
  - `Heading 1` (`text-3xl sm:text-4xl font-extrabold text-white`): Títulos principais de páginas e modais de destaque.
  - `Heading 2` (`text-2xl sm:text-3xl font-bold text-slate-100`): Seções de dashboard e títulos de lição.
  - `Heading 3` (`text-xl font-bold text-slate-100`): Títulos de cartões e passos da jornada.
  - `BodyText` (`text-sm text-slate-300 leading-relaxed`): Diálogos, explicações e textos de suporte.
  - `CaptionText` (`text-xs text-slate-400 font-medium`): Metadados, horários e badges secundárias.

---

## 5. Espaçamento e Grid System

- **Escala Rítmica (4px Base)**: `p-1.5` (6px), `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-6` (24px), `p-8` (32px).
- **Regra de Contentores (`Container`)**: Largura máxima `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Regra do Nested Border Radius**:
  $$\text{Raio Interno} = \text{Raio Externo} - \text{Padding}$$
  Garante harmonia geométrica entre os cartões (`rounded-2xl`) e os botões/inputs internos (`rounded-xl`).

---

## 6. Biblioteca de Componentes Reutilizáveis (`/src/components/design-system/`)

### 6.1 Buttons (`Button.tsx`)
- Variantes: `primary`, `secondary`, `outline`, `ghost`, `danger`, `success`.
- Suporte nativo para estado de carregamento (`isLoading`), ícones e resposta tátil (`active:scale-[0.98]`).

### 6.2 Inputs (`Input.tsx`)
- Suporte para ícones à esquerda, rótulos claros (`label`), mensagens de erro em tempo real (`error`) e textos explicativos (`helperText`).

### 6.3 Cards (`Card.tsx`)
- Variantes: `default`, `glass`, `accent`, `outlined`.
- Sub-componentes: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

### 6.4 Badges (`Badge.tsx`)
- Variantes: `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `cefr`.

### 6.5 Modals (`Modal.tsx`)
- Fecho ao premir `Escape` ou clicar no backdrop de desfoque (`backdrop-blur-sm`).
- Animação suave de abertura (`animate-fade-in` / `animate-scale-up`).

### 6.6 States (`States.tsx`)
- `LoadingSpinner`: Indicador de progresso circular.
- `Skeleton`: Carregamento esquelético fluido.
- `EmptyState`: Apresentação elegante quando não existem dados.
- `ErrorState`: Caixa de diálogo de erro com botão de ação para tentar novamente.
- `SuccessState`: Ecrã de celebração e confirmação.

---

## 7. Alive Interface & Professor Virtual

O ambiente de conversação com o Professor Virtual transmite presença viva e atenciosa de forma subtil:
- **Micro-interações de Fala**: Indicadores discretos de áudio e pulsação suave enquanto o professor fala ou ouve o aluno.
- **Ritmo Humano**: Transições e pausas calculadas para simular o tempo de raciocínio de um professor humano real.
- **Expressão de Empatia**: Ajuste visual de tom quando o aluno reporta fadiga ou alcança uma vitória.

---

## 8. Acessibilidade (WCAG 2.1 AA)

- **Contraste de Cor**: Rácio superior a 4.5:1 para todo o corpo de texto.
- **Teclado**: Foco visível (`focus:ring-2 focus:ring-indigo-500`) em todas as interações e controlos.
- **Leitores de Ecrã**: Rótulos e atributos semânticos (`aria-label`, `htmlFor`, `id`).

---

## 9. Regra de Ouro para Novos Componentes
Nenhum novo componente ou ecrã pode ser adicionado à plataforma sem:
1. Reutilizar a biblioteca do Design System (`/src/components/design-system`).
2. Respeitar o princípio *One Goal Per Screen*.
3. Garantir resposta tátil e visual a todas as interações.
4. Passar pela validação de TypeScript (`tsc --noEmit`) e Linter sem avisos nem erros.
