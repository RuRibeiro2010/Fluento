import { TrackedWordEntity } from '../entities/tracked-word.entity';
import { CommonErrorEntity } from '../entities/common-error.entity';

export interface IMemoryRepository {
  findWordsByStudentId(studentId: string): Promise<TrackedWordEntity[]>;
  findDueWordsByStudentId(studentId: string, limit?: number): Promise<TrackedWordEntity[]>;
  findErrorsByStudentId(studentId: string): Promise<CommonErrorEntity[]>;
  saveWord(word: TrackedWordEntity): Promise<void>;
  saveError(error: CommonErrorEntity): Promise<void>;
}
