import { BaseDomainEvent } from '../../shared/domain-event';

export class TeacherAssignedEvent extends BaseDomainEvent {
  constructor(studentId: string, teacherId: string, teacherName: string) {
    super('TeacherAssigned', studentId, {
      studentId,
      teacherId,
      teacherName,
    });
  }
}
