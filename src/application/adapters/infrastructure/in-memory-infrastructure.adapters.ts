import { IEventPublisher, ILogger, IClockProvider, IUuidGenerator } from '../../contracts/infrastructure.contracts';

/**
 * IN-MEMORY INFRASTRUCTURE ADAPTERS
 *
 * Default production implementations of the cross-cutting infrastructure
 * ports declared in `contracts/infrastructure.contracts.ts`
 * (`IEventPublisher`, `ILogger`, `IClockProvider`, `IUuidGenerator`).
 *
 * Relocated from `src/application/__tests__/fixtures.ts` during
 * Sprint 16A.4.1 (Architecture Hardening) so that production code
 * (`application-container.ts`) no longer imports from a test directory.
 * Class names and behavior are unchanged from the previous
 * implementation — including known limitations noted below — to avoid
 * any functional change in this hardening pass.
 */

/**
 * Publishes domain/application events into an in-memory array instead of
 * a real message bus. Adequate as a safe default while no event
 * infrastructure (queue, webhook, etc.) is wired in.
 */
export class FakeEventPublisher implements IEventPublisher {
  public publishedEvents: any[] = [];

  public async publish(event: any): Promise<void> {
    this.publishedEvents.push(event);
  }

  public async publishAll(events: any[]): Promise<void> {
    this.publishedEvents.push(...events);
  }
}

/**
 * Buffers log entries into an in-memory array instead of writing to
 * console/telemetry. Adequate as a safe default while no logging
 * infrastructure is wired in.
 */
export class FakeLogger implements ILogger {
  public logs: Array<{ level: string; message: string }> = [];

  public info(message: string): void {
    this.logs.push({ level: 'info', message });
  }
  public warn(message: string): void {
    this.logs.push({ level: 'warn', message });
  }
  public error(message: string): void {
    this.logs.push({ level: 'error', message });
  }
  public debug(message: string): void {
    this.logs.push({ level: 'debug', message });
  }
}

/**
 * KNOWN LIMITATION (pre-existing, not modified in this hardening pass):
 * this clock captures `Date` once at construction time and returns that
 * same fixed instant on every subsequent call to `now()`/`timestampMs()`
 * — it does not advance. Since `ApplicationContainer` is a long-lived
 * singleton, any caller relying on this specific instance for "current
 * time" would get a frozen timestamp for the life of the page session.
 * Flagged here for visibility; fixing it is a functional change and is
 * out of scope for this hardening sprint (see Sprint 16A.5 backlog).
 */
export class FakeClockProvider implements IClockProvider {
  constructor(private mockDate = new Date()) {}
  public now(): Date {
    return new Date(this.mockDate.getTime());
  }
  public timestampMs(): number {
    return this.mockDate.getTime();
  }
}

/**
 * Generates simple counter-based identifiers (`${prefix}_${n}_test`)
 * instead of real UUIDs. Adequate as a safe default while no
 * cryptographically-unique ID generator is wired in.
 */
export class FakeUuidGenerator implements IUuidGenerator {
  private counter = 0;
  public generate(prefix = 'id'): string {
    this.counter++;
    return `${prefix}_${this.counter}_test`;
  }
}
