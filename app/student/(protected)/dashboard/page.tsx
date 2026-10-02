import { redirect } from "next/navigation";
import { requireStudentSession } from "@/lib/student-auth";
import { getStudentDashboardData } from "@/lib/student-dashboard-data";
import { StudentDashboardClient } from "@/components/student-dashboard-client";

export const metadata = {
  title: "Daily Ibadah Tracker | Al-Huda Student Portal",
};

export default async function StudentDashboardPage() {
  const session = await requireStudentSession();
  const data = await getStudentDashboardData(session.studentId);

  if (!data) {
    redirect("/student/login");
  }

  return <StudentDashboardClient initialData={data} />;
}
