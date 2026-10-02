import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import {
  listPrayers,
  getStudentAssignedDuas,
  getStudentAssignedDhikrs,
  getStudentHistoryDays,
  getStudentDaySummary,
  getStudentStreak,
} from "@/lib/ibadah-repository";
import { toAdminStudent, toAdminCourse, toAdminCertificate } from "@/lib/admin-repository";

export async function getStudentDetailForAdmin(studentId: string) {
  const db = await getMongoDb();
  const students = db.collection("students");
  const courses = db.collection("courses");
  const certificates = db.collection("certificates");

  const studentDoc = await students.findOne({ _id: new ObjectId(studentId) });
  if (!studentDoc) return null;

  const student = toAdminStudent(studentDoc as any);

  let course = null;
  if (student.courseId) {
    const courseDoc = await courses.findOne({ _id: new ObjectId(student.courseId) });
    if (courseDoc) course = toAdminCourse(courseDoc as any);
  }

  let certificate = null;
  if (student.certificateId) {
    const certDoc = await certificates.findOne({ _id: new ObjectId(student.certificateId) });
    if (certDoc) certificate = toAdminCertificate(certDoc as any);
  }
  if (!certificate) {
    const certDoc = await certificates.findOne({ studentId });
    if (certDoc) certificate = toAdminCertificate(certDoc as any);
  }

  const today = new Date().toISOString().slice(0, 10);
  const [todaySummary, streak, history, assignedDuas, assignedDhikrs, allPrayers] =
    await Promise.all([
      getStudentDaySummary(studentId, today),
      getStudentStreak(studentId),
      getStudentHistoryDays(studentId, 14),
      getStudentAssignedDuas(studentId),
      getStudentAssignedDhikrs(studentId),
      listPrayers(),
    ]);

  return {
    student,
    course,
    certificate,
    todaySummary,
    streak,
    history,
    assignedDuas,
    assignedDhikrs,
    allPrayers,
  };
}
