# Fluento Architecture & Technical Documentation (Phase 20)

## Executive Overview
**Fluento** is an AI-powered personal language learning platform designed around adaptive, real-time cognitive orchestration, long-term memory decay modeling, and humanlike virtual teaching.

This document details the Clean Architecture design, module boundaries, data flows, and subsystem interactions.

---

## Architecture Layers & Clean Design Boundaries

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│ (React Components, Pages, Design System, Smart Router)  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│               AI Teaching Orchestrator                  │
│       (lib/orchestrator/teaching-orchestrator)          │
└────────┬───────────────┬───────────────┬────────────────┘
         │               │               │
         ▼               ▼               ▼
┌────────────────┐ ┌───────────┐ ┌────────────────────────┐
│  Intelligence  │ │   Human   │ │ Quality & Safety Guard │
│(lib/intelligence)│(lib/human)│ │     (lib/quality)      │
└────────┬───────┘ └─────┬─────┘ └───────────┬────────────┘
         │               │                   │
         └───────────────┼───────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Platform Infrastructure              │
│ (lib/platform - Persistence, Subscriptions, Offline)    │
└─────────────────────────────────────────────────────────┘
```

---

## Core Subsystems & Engine Directory

### 1. AI Teaching Orchestrator (`/lib/orchestrator/`)
Coordinates the session lifecycle by synthesizing student fatigue, long-term retention, profession, and cognitive state into a tailored session plan.
- **`learning-state.ts`**: Classifies student state (e.g., *Flow State*, *Burnout Risk*, *Needs Review*, *Needs Confidence*).
- **`coaching-engine.ts`**: Assigns virtual teacher personas (*Prof. Sofia*, *Prof. Marcos*, *Prof. Elena*, *Prof. Lucas*).
- **`strategy-selector.ts`**: Selects pedagogical strategy (*Socratic Guidance*, *Immersive Roleplay*, *Passive Recovery*).
- **`decision-engine.ts`**: Generates explicit, transparent pedagogical rationales ("Why this lesson?", "Why this teacher?").
- **`review-priority.ts`**: Ebbinghaus forgetting curve priority calculations.
- **`progression-engine.ts`**: Granular CEFR score calculation (A1 to C2).

### 2. Fluento Intelligence 1.0 (`/lib/intelligence/`)
Learns continuously across aggregate cohorts while strictly adhering to GDPR privacy boundaries.
- **`anonymization.ts`**: Hashes PII and aggregates cohort metrics.
- **`pattern-engine.ts`**: Uncovers macro demographic & professional study patterns.
- **`personalization-engine.ts`**: Refines individual learner affinity models.
- **`prediction-engine.ts`**: Forecasts churn risk, forgetting probability, and ideal review windows.
- **`benchmarking.ts`**: Compares individual progress velocity against anonymized cohort baselines.

### 3. Trust, Safety & Quality Platform (`/lib/quality/`)
Supervisory middleware ensuring AI outputs meet rigorous pedagogical and safety standards before user display.
- **`response-validator.ts`**: Pre-flight validation pipeline checking CEFR alignment, safety, and clarity.
- **`hallucination-check.ts`**: Guarding against false grammar rule generation.
- **`ai-supervisor.ts`**: Intercepts weak responses for real-time refinement or re-generation.
- **`safety-engine.ts`**: Filters offensive language and cultural bias.
- **`lesson-auditor.ts`**: Scorecards lessons for cognitive load, retention, and success probability.

### 4. Human Experience & Empathy (`/lib/human/`)
Delivers natural, empathetic, and memorable interactions.
- **`relationship-engine.ts`**: Builds long-term teacher-student rapport.
- **`conversation-memory.ts`**: Generates natural callbacks to past learning struggles and victories.
- **`empathy-engine.ts`**: Modulates speech energy and pacing to match student emotional state.
- **`celebration-engine.ts`**: Celebrates mature learning milestones.
- **`trust-engine.ts`**: Protects student psychological safety to foster mistake-friendly learning.

### 5. Platform Ecosystem (`/lib/platform/`)
Enterprise, multi-tenant organization, offline resilience, and monetization engine.
- **`subscription-engine.ts`**: Capability permissions for Free, Plus, Pro, Teams, Enterprise, Education, Family.
- **`organization-engine.ts` & `family-engine.ts`**: Multi-seat roster management and parental controls.
- **`certification-engine.ts`**: Prep tracks for IELTS, TOEFL, Cambridge, Goethe, JLPT, HSK, TOPIK, DELF, DELE, CELPE-Bras.
- **`notification-engine.ts`**: Intelligent notification scheduling adhering to quiet hours and vacation modes.
- **`localization-engine.ts`**: I18n dictionaries for multi-language UI translation.
- **`offline-cache.ts` & `autosave.ts`**: Local resilience and offline state sync.

---

## State Management & Communication Flow

1. **Smart Routing**: `determineNextJourneyStep()` in `src/lib/journey/smart-routing.ts` calculates the user's view (`landing`, `adaptive_assessment`, `personalized_plan`, `first_mission`, `first_lesson`, `dashboard`, `lesson`, `timeline`).
2. **Orchestration Execution**: When starting a live session, `orchestrateLearningSession()` evaluates user fatigue, accuracy, and streak, passing the session plan through `superviseAndRefineOutput()` to guarantee quality.
3. **Data Persistence**: Local storage and offline caches sync session metrics to `anonymizeSessionMetrics()` for global intelligence learning without leaking user identity.

---

## Verification & Build Status
- **TypeScript Compliance**: `tsc --noEmit` completes with 0 errors.
- **Lint Status**: `npm run lint` completes with 0 warnings.
- **Production Build**: `npm run build` succeeds cleanly with compiled bundles in `dist/`.
