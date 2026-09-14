import { StudentEntity } from '../entities/student.entity';
import { StudentId } from '../value-objects/student-id.vo';

export interface IStudentRepository {
  findById(id: StudentId): Promise<StudentEntity | null>;
  findByEmail(email: string): Promise<StudentEntity | null>;
  save(student: StudentEntity): Promise<void>;
  delete(id: StudentId): Promise<void>;
}
