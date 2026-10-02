import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import {
  listPrayers,
  getStudentPrayerCompletions,
  getStudentAssignedDuas,
  getStudentDuaCompletions,
  getStudentAssignedDhikrs,
  getStudentDhikrCompletions,
  getStudentDaySummary,
  getStudentStreak,
  getStudentHistoryDays,
} from "@/lib/ibadah-repository";
import { toAdminCourse, toAdminCertificate } from "@/lib/admin-repository";
import type { AdminCourse, AdminCertificate, AdminStudent } from "@/lib/admin-types";
import type {
  PrayerItem,
  PrayerCompletion,
  DuaItem,
  DuaCompletion,
  DhikrItem,
  DhikrCompletion,
  DayCompletionSummary,
} from "@/lib/ibadah-types";

export type StudentDashboardData = {
  student: AdminStudent;
  course: AdminCourse | null;
  certificate: AdminCertificate | null;
  todaySummary: DayCompletionSummary;
  streak: number;
  prayers: PrayerItem[];
  prayerCompletions: PrayerCompletion[];
  assignedDuas: DuaItem[];
  duaCompletions: DuaCompletion[];
  assignedDhikrs: DhikrItem[];
  dhikrCompletions: DhikrCompletion[];
  history: DayCompletionSummary[];
  todayDate: string;
};

export async function getStudentDashboardData(studentId: string): Promise<StudentDashboardData | null> {
  const db = await getMongoDb();
  const students = db.collection("students");
  const courses = db.collection("courses");
  const certificates = db.collection("certificates");

  const studentDoc = await students.findOne({ _id: new ObjectId(studentId) });
  if (!studentDoc) return null;

  const student: AdminStudent = {
    id: studentDoc._id.toString(),
    fullName: studentDoc.fullName,
    guardianName: studentDoc.guardianName,
    email: studentDoc.email,
    phone: studentDoc.phone,
    courseId: studentDoc.courseId,
    status: studentDoc.status,
    createdAt: studentDoc.createdAt,
    completedAt: studentDoc.completedAt,
    certificateId: studentDoc.certificateId,
    instructorName: studentDoc.instructorName,
  };

  let course: AdminCourse | null = null;
  if (student.courseId) {
    const courseDoc = await courses.findOne({ _id: new ObjectId(student.courseId) });
    if (courseDoc) course = toAdminCourse(courseDoc as any);
  }

  let certificate: AdminCertificate | null = null;
  if (student.certificateId) {
    const certDoc = await certificates.findOne({ _id: new ObjectId(student.certificateId) });
    if (certDoc) certificate = toAdminCertificate(certDoc as any);
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const [
    streak,
    prayers,
    prayerCompletions,
    assignedDuas,
    duaCompletions,
    assignedDhikrs,
    dhikrCompletions,
    history,
  ] = await Promise.all([
    getStudentStreak(studentId),
    listPrayers(),
    getStudentPrayerCompletions(studentId, todayStr),
    getStudentAssignedDuas(studentId),
    getStudentDuaCompletions(studentId, todayStr),
    getStudentAssignedDhikrs(studentId),
    getStudentDhikrCompletions(studentId, todayStr),
    getStudentHistoryDays(studentId, 7),
  ]);

  const prayersTotal = prayers.length;
  const prayersCompleted = prayerCompletions.length;
  const duasTotal = assignedDuas.length;
  const duasCompleted = duaCompletions.length;
  const dhikrsTotal = assignedDhikrs.length;
  const dhikrsCompleted = dhikrCompletions.length;
  const totalTasks = prayersTotal + duasTotal + dhikrsTotal;
  const totalCompleted = prayersCompleted + duasCompleted + dhikrsCompleted;
  const percentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const todaySummary: DayCompletionSummary = {
    date: todayStr,
    prayersTotal,
    prayersCompleted,
    duasTotal,
    duasCompleted,
    dhikrsTotal,
    dhikrsCompleted,
    totalTasks,
    totalCompleted,
    percentage,
  };

  return {
    student,
    course,
    certificate,
    todaySummary,
    streak,
    prayers,
    prayerCompletions,
    assignedDuas,
    duaCompletions,
    assignedDhikrs,
    dhikrCompletions,
    history,
    todayDate: todayStr,
  };
}
