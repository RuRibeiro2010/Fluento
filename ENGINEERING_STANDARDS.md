# Fluento Official Engineering Standards v1.0

## Contexto
Este documento passa a ser o Engineering Standards oficial do Fluento.
O seu objetivo é definir as regras permanentes de engenharia, arquitetura, qualidade, desempenho, testes pedagógicos e manutenção do projeto.

Estas normas são obrigatórias para qualquer nova funcionalidade, refatoração ou integração futura no Fluento.

---

## 1. Filosofia de Engenharia
O Fluento privilegia:
- **Simplicidade**: Soluções diretas e legíveis sobre abstrações prematuras ou desnecessárias.
- **Clareza**: Código auto-explicativo com nomeação explícita de variáveis, funções e tipos.
- **Manutenção**: Módulos pequenos e isolados de fácil refatoração e substituição.
- **Robustez**: Tratamento defensivo de erros e falhas de rede com recuperação graciosa.
- **Evolução Contínua**: A qualidade da engenharia reflete diretamente a qualidade pedagógica do produto.

---

## 2. Princípios Fundamentais de Engenharia

### 2.1 Code With Purpose
Cada linha de código existe por uma razão pedagógica ou de infraestrutura clara. Eliminar código morto, variáveis não utilizadas ou abstrações sem utilidade imediata.

### 2.2 Modular Before Complex
Sempre preferir módulos pequenos, puros e independentes antes de introduzir arquiteturas complexas.

### 2.3 Replaceable AI
Nenhum fornecedor de IA (Gemini, OpenAI, Anthropic, DeepSeek) deve ser indispensável. Toda a comunicação com modelos externos é feita através de adapters e interfaces abstratas.

### 2.4 Test Learning, Not Only Code
O Fluento testa não apenas a sintaxe e compilação do código, mas também a eficácia e segurança da aprendizagem (proporção de fala aluno/professor, rácio de incentivo/correção, ausência de ansiedade).

### 2.5 Documentation Is Part of the Product
Código e documentação evoluem em conjunto. Mudanças na arquitetura implicam a atualização imediata da documentação técnica e dos blueprints.

---

## 3. Arquitetura e Padrões Permanentes
- **Clean Architecture & Boundary Isolation**:
  - `Presentation Layer`: Componentes React e páginas puramente visuais, desacopladas da lógica de decisão.
  - `Orchestration & Business Layer`: Motores e serviços em `/lib/` gerem a lógica pedagógica e o estado.
  - `Platform & Data Layer`: Persistência local e remota isolada atrás de repositórios.
- **Separation of Concerns & Low Coupling**: Evitar dependências circulares entre módulos.
- **Dependency Injection**: Passar dependências explicitamente para facilitar testes.

---

## 4. Organização do Projeto

```
/src
  /components
    /design-system    # Componentes UI reutilizáveis (Button, Card, Modal, Input, etc.)
  /lib
    /orchestrator     # Motores de orquestração pedagógica e decisões de aula
    /intelligence     # Motores de análise agregada, previsão e personalização
    /quality          # Validação pré-flight, guardrails de segurança e auditoria
    /human            # Motores de empatia, memória, presença e relação humana
    /platform         # Subscrições, offline cache, famílias, organizações e certificações
    /journey          # Roteamento inteligente da jornada do aluno
/public               # Ativos estáticos e recursos
```

---

## 5. Padrões de Integração e "Replaceable AI"
- Toda a chamada a modelos de linguagem ou processadores de voz passa por um adapter unificado (`AIProviderAdapter`).
- O sistema da aplicação nunca importa bibliotecas de terceiros diretamente nos componentes de UI.
- Falhas na API externa ativam automaticamente o modo de fallback gracioso ou recuperação pedagógica local.

---

## 6. Tratamento de Erros e Mensagens
- As mensagens de erro exibidas ao utilizador cumprem os princípios do *Brand Guidelines*:
  - ❌ *"Error 500: Failed to fetch API"*
  - ✅ *"Estamos a preparar a tua próxima lição. Tentar novamente em instantes."*
- Auto-recuperação transparente em falhas temporárias de rede ou indisponibilidade de serviço.

---

## 7. Qualidade, Validação e "AI Quality Gates"
- **Controlo Estático**:
  - Compilação limpa em TypeScript (`tsc --noEmit`).
  - Linter sem erros nem avisos críticos (`npm run lint`).
  - Build de produção sem falhas (`npm run build`).
- **Validação Pré-Flight de IA**:
  - Inspeção automática de respostas de IA por validadores dedicados (`response-validator`, `hallucination-check`, `ai-supervisor`).
  - Verificação do nível CEFR e ausência de falsas regras gramaticais antes da apresentação na UI.

---

## 8. Testes Pedagógicos (Pedagogy Verification)
Garantir em runtime e durante auditorias que:
1. O aluno fala/escreve mais do que o professor virtual durante a sessão prática.
2. A taxa de hesitação diminui com a evolução do nível.
3. As correções nunca interrompem o estado de fluxo (*Flow State*).
4. O *Active Recall* e a *Spaced Repetition* ocorrem nos momentos ideais.

---

## 9. Segurança, Privacidade e RGPD
- Anonimização estrita de dados pedagógicos coletivos (`anonymization.ts`).
- Nenhum dado pessoal identificável (PII) é enviado para modelos de aprendizagem sem hashing prévio.
- Cumprimento total de padrões de privacidade visível.

---

## 10. Checklist de Aprovação para Pull Requests & Refactorings
Antes de qualquer fusão ou atualização no Fluento, o programador deve responder:
1. **Melhora a aprendizagem?**
2. **Mantém a simplicidade e legibilidade?**
3. **Respeita a Clean Architecture e os documentos oficiais?**
4. **Passa na compilação do TypeScript e no Linter com zero erros?**
5. **Preserva a capacidade de substituição de fornecedores de IA?**
