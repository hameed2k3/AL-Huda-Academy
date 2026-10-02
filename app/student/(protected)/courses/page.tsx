import Link from "next/link";
import { requireStudentSession } from "@/lib/student-auth";
import { getStudentDashboardData } from "@/lib/student-dashboard-data";

export const metadata = {
  title: "My Courses | Al-Huda Student Portal",
};

export default async function StudentCoursesPage() {
  const session = await requireStudentSession();
  const data = await getStudentDashboardData(session.studentId);
  const course = data?.course;
  const student = data?.student;

  return (
    <div className="space-y-6">
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-2">
        <Link
          href="/student/dashboard"
          className="rounded-full border border-border bg-surface px-5 py-2 text-xs font-medium text-foreground hover:bg-surface-muted transition"
        >
          🌿 Today's Ibadah
        </Link>
        <Link
          href="/student/history"
          className="rounded-full border border-border bg-surface px-5 py-2 text-xs font-medium text-foreground hover:bg-surface-muted transition"
        >
          📊 History & Progress
        </Link>
        <Link
          href="/student/courses"
          className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs"
        >
          📖 Enrolled Course
        </Link>
        <Link
          href="/student/certificates"
          className="rounded-full border border-border bg-surface px-5 py-2 text-xs font-medium text-foreground hover:bg-surface-muted transition"
        >
          🎓 Certificates
        </Link>
      </div>

      <div className="panel-shadow rounded-[2.5rem] border border-border bg-surface p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Academic Program
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-primary">
          Enrolled Course
        </h1>
        <p className="mt-1 text-sm text-muted">
          Your current Quranic curriculum and instructor details.
        </p>

        {course ? (
          <div className="mt-8 rounded-[2rem] border border-border bg-surface-muted/60 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  Duration: {course.duration}
                </span>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-primary">
                  {course.title}
                </h2>
              </div>
              <span
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                  student?.status === "completed"
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {student?.status === "completed" ? "Completed ✓" : "In Progress ⏳"}
              </span>
            </div>

            <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
              {course.description}
            </p>

            <div className="mt-6 pt-6 border-t border-border grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Instructor</p>
                <p className="mt-1 font-semibold text-foreground text-sm">{student?.instructorName || "Academy Ustadha"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Enrolled Date</p>
                <p className="mt-1 font-semibold text-foreground text-sm">{student?.createdAt}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] bg-surface-muted p-8 text-center text-sm text-muted">
            You are not currently enrolled in any course. Please reach out to academy administration.
          </div>
        )}
      </div>
    </div>
  );
}
