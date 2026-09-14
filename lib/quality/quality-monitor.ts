/**
 * Quality Monitor Module (Trust, Safety & Quality Platform - Phase 18)
 * Tracks system-wide quality trends, regeneration rates, and quality score logs.
 */

export interface QualityLogEntry {
  timestampIso: string;
  componentName: string;
  status: 'passed' | 'regenerated' | 'flagged';
  score: number;
}

class QualityMonitor {
  private logs: QualityLogEntry[] = [];

  public logValidation(componentName: string, status: QualityLogEntry['status'], score: number): void {
    this.logs.push({
      timestampIso: new Date().toISOString(),
      componentName,
      status,
      score,
    });

    if (this.logs.length > 200) {
      this.logs.shift();
    }
  }

  public getAverageQualityScore(): number {
    if (this.logs.length === 0) return 100;
    const sum = this.logs.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / this.logs.length);
  }

  public getRegenerationRate(): number {
    if (this.logs.length === 0) return 0;
    const regenCount = this.logs.filter((l) => l.status === 'regenerated').length;
    return Number((regenCount / this.logs.length).toFixed(2));
  }
}

export const qualityMonitor = new QualityMonitor();
