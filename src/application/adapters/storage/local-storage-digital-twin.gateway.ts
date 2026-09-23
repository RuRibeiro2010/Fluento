import { IDigitalTwinStorageGateway } from '../../contracts/student-storage.contract';
import { DigitalTwinDomainData } from '../../../domain/student/entities/digital-twin.entity';

export class LocalStorageDigitalTwinGateway implements IDigitalTwinStorageGateway {
  private inMemoryFallback: Map<string, DigitalTwinDomainData> = new Map();

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public async loadTwin(studentId: string): Promise<DigitalTwinDomainData | null> {
    if (this.inMemoryFallback.has(studentId)) {
      return this.inMemoryFallback.get(studentId)!;
    }

    if (!this.isBrowser()) return null;

    try {
      const key = `fluento_digital_twin_${studentId}`;
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as DigitalTwinDomainData;
        this.inMemoryFallback.set(studentId, parsed);
        return parsed;
      }
    } catch (err) {
      console.warn('[LocalStorageDigitalTwinGateway] Error loading twin:', err);
    }

    return null;
  }

  public async saveTwin(twin: DigitalTwinDomainData): Promise<void> {
    this.inMemoryFallback.set(twin.studentId, twin);

    if (this.isBrowser()) {
      try {
        const key = `fluento_digital_twin_${twin.studentId}`;
        window.localStorage.setItem(key, JSON.stringify(twin));
      } catch (err) {
        console.warn('[LocalStorageDigitalTwinGateway] Error saving twin:', err);
      }
    }
  }

  public async deleteTwin(studentId: string): Promise<void> {
    this.inMemoryFallback.delete(studentId);
    if (this.isBrowser()) {
      window.localStorage.removeItem(`fluento_digital_twin_${studentId}`);
    }
  }

  public clearMemory(): void {
    this.inMemoryFallback.clear();
  }
}
