/**
 * IN-MEMORY REPOSITORY ADAPTERS (Production defaults)
 *
 * Sprint 16A.4.1 (Architecture Hardening): these implementations used to
 * live in `src/application/__tests__/fixtures.ts` and were imported
 * directly by production code (`application-container.ts`). They have
 * been relocated here so that production no longer depends on the
 * test tree. Test suites now import them from this same path.
 *
 * These remain simple in-memory Maps — no behavior change was made in
 * this hardening pass. Replacing them with a persistent backend
 * (e.g. Supabase) is out of scope and left for a future sprint.
 */
export * from './in-memory-student.repository';
export * from './in-memory-lesson.repository';
export * from './in-memory-session.repository';
export * from './in-memory-study-plan.repository';
export * from './in-memory-analytics.repository';
export * from './in-memory-subscription.repository';
export * from './in-memory-memory.repository';
export * from './in-memory-teacher.repository';
