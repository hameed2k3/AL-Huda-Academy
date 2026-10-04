export type AdminCourse = {
  id: string;
  title: string;
  duration: string;
  description: string;
  certificateAvailable: boolean;
  createdAt: string;
};

export type AdminStudent = {
  id: string;
  fullName: string;
  guardianName: string;
  email: string;
  phone: string;
  courseId: string | null;
  status: "active" | "completed";
  createdAt: string;
  completedAt: string | null;
  certificateId: string | null;
  instructorName: string;
};

export type AdminCertificate = {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  completionDate: string;
  instructorName: string;
  grade: string;
  generatedAt: string;
};

export type CreateCourseInput = Omit<AdminCourse, "id" | "createdAt">;
export type UpdateCourseInput = Partial<CreateCourseInput>;

export type CreateStudentInput = Omit<
  AdminStudent,
  "id" | "createdAt" | "completedAt" | "certificateId"
> & {
  password?: string;
};
export type UpdateStudentInput = Partial<CreateStudentInput>;

