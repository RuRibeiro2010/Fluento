import { TrackedWordEntity } from '../../../../domain/memory/entities/tracked-word.entity';
import { CommonErrorEntity } from '../../../../domain/memory/entities/common-error.entity';
import { IMemoryRepository } from '../../../../domain/memory/repositories/memory-repository.interface';

/**
 * IN-MEMORY MEMORY REPOSITORY (vocabulary & common errors)
 *
 * Default production implementation of `IMemoryRepository`. See
 * `in-memory-student.repository.ts` for the rationale and Sprint
 * 16A.4.1 relocation notes. Behavior is unchanged from the previous
 * implementation in `src/application/__tests__/fixtures.ts`.
 */
export class InMemoryMemoryRepository implements IMemoryRepository {
  private words = new Map<string, TrackedWordEntity>();
  private errors = new Map<string, CommonErrorEntity>();

  public async findWordsByStudentId(studentId: string): Promise<TrackedWordEntity[]> {
    return Array.from(this.words.values()).filter((w) => w.studentId === studentId);
  }

  public async findDueWordsByStudentId(studentId: string, limit = 10): Promise<TrackedWordEntity[]> {
    const due = Array.from(this.words.values()).filter(
      (w) => w.studentId === studentId && w.srsData.isDueForReview()
    );
    return due.slice(0, limit);
  }

  public async findErrorsByStudentId(studentId: string): Promise<CommonErrorEntity[]> {
    return Array.from(this.errors.values()).filter((e) => e.studentId === studentId);
  }

  public async saveWord(word: TrackedWordEntity): Promise<void> {
    this.words.set(word.id, word);
  }

  public async saveError(error: CommonErrorEntity): Promise<void> {
    this.errors.set(error.id, error);
  }
}
