/**
 * Academy Engine Module (Fluento Platform Ecosystem - Phase 17)
 * School/University curriculum mapping, teacher dashboard controls,
 * classroom assignment creation, and grading scale integration.
 */

export interface ClassroomAssignment {
  assignmentId: string;
  title: string;
  description: string;
  targetCefr: string;
  dueDateIso: string;
  assignedStudentIds: string[];
}

export interface TeacherClassroom {
  classroomId: string;
  className: string;
  gradeLevel: string;
  teacherId: string;
  assignments: ClassroomAssignment[];
}

export function createClassroom(
  className: string,
  gradeLevel: string,
  teacherId: string
): TeacherClassroom {
  return {
    classroomId: `cls_${Date.now()}`,
    className,
    gradeLevel,
    teacherId,
    assignments: [],
  };
}

export function createAssignmentForClassroom(
  classroom: TeacherClassroom,
  title: string,
  description: string,
  targetCefr: string,
  dueDateIso: string
): TeacherClassroom {
  const assignment: ClassroomAssignment = {
    assignmentId: `asg_${Date.now()}`,
    title,
    description,
    targetCefr,
    dueDateIso,
    assignedStudentIds: [],
  };

  return {
    ...classroom,
    assignments: [...classroom.assignments, assignment],
  };
}
