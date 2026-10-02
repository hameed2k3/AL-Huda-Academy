import { requireStudentSession } from "@/lib/student-auth";
import { getStudentHistoryDays, getStudentStreak } from "@/lib/ibadah-repository";
import { StudentHistoryClient } from "@/components/student-history-client";

export const metadata = {
  title: "Ibadah History & Progress | Al-Huda Student Portal",
};

export default async function StudentHistoryPage() {
  const session = await requireStudentSession();
  const [history, streak] = await Promise.all([
    getStudentHistoryDays(session.studentId, 14),
    getStudentStreak(session.studentId),
  ]);

  return <StudentHistoryClient history={history} streak={streak} />;
}
