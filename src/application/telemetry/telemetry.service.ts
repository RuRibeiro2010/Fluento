export interface TelemetrySpan {
  useCaseName: string;
  startTimeMs: number;
  endTimeMs?: number;
  durationMs?: number;
  success: boolean;
  error?: string;
  publishedEventsCount: number;
  retryCount: number;
  metadata?: Record<string, unknown>;
}

export class TelemetryService {
  private spans: TelemetrySpan[] = [];

  public startSpan(useCaseName: string, metadata?: Record<string, unknown>): TelemetrySpan {
    return {
      useCaseName,
      startTimeMs: Date.now(),
      success: false,
      publishedEventsCount: 0,
      retryCount: 0,
      metadata,
    };
  }

  public endSpan(span: TelemetrySpan, success: boolean, options?: { error?: string; publishedEventsCount?: number; retryCount?: number }): TelemetrySpan {
    span.endTimeMs = Date.now();
    span.durationMs = span.endTimeMs - span.startTimeMs;
    span.success = success;
    if (options?.error) span.error = options.error;
    if (options?.publishedEventsCount !== undefined) span.publishedEventsCount = options.publishedEventsCount;
    if (options?.retryCount !== undefined) span.retryCount = options.retryCount;

    this.spans.push(span);
    return span;
  }

  public getSpans(): ReadonlyArray<TelemetrySpan> {
    return [...this.spans];
  }

  public clear(): void {
    this.spans = [];
  }
}

export const applicationTelemetry = new TelemetryService();
