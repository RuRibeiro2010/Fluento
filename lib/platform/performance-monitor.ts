/**
 * Performance Monitor Module (Production & Reliability Platform - Phase 14)
 * Measures voice latency, UI render times, and API roundtrip durations to guarantee
 * instant responsiveness during live conversational lessons.
 */

export interface PerformanceMetric {
  name: string;
  durationMs: number;
  timestampIso: string;
  context?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxLogs: number = 100;

  public startTimer(name: string): () => void {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    return (context?: Record<string, unknown>) => {
      const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const durationMs = Math.round(endTime - startTime);

      const metric: PerformanceMetric = {
        name,
        durationMs,
        timestampIso: new Date().toISOString(),
        context,
      };

      this.metrics.push(metric);
      if (this.metrics.length > this.maxLogs) {
        this.metrics.shift();
      }

      if (durationMs > 1500) {
        console.warn(`[PerformanceMonitor] Slow operation detected (${name}): ${durationMs}ms`);
      }
    };
  }

  public getRecentMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

export const performanceMonitor = new PerformanceMonitor();
