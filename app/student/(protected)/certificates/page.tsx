import Link from "next/link";
import { requireStudentSession } from "@/lib/student-auth";
import { getStudentDashboardData } from "@/lib/student-dashboard-data";

export const metadata = {
  title: "My Certificates | Al-Huda Student Portal",
};

export default async function StudentCertificatesPage() {
  const session = await requireStudentSession();
  const data = await getStudentDashboardData(session.studentId);
  const certificate = data?.certificate;
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
          className="rounded-full border border-border bg-surface px-5 py-2 text-xs font-medium text-foreground hover:bg-surface-muted transition"
        >
          📖 Enrolled Course
        </Link>
        <Link
          href="/student/certificates"
          className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs"
        >
          🎓 Certificates
        </Link>
      </div>

      <div className="panel-shadow rounded-[2.5rem] border border-border bg-surface p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Credentials & Achievements
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-primary">
          Course Certificates
        </h1>
        <p className="mt-1 text-sm text-muted">
          Official QR-verifiable certificates issued upon successful course completion.
        </p>

        {certificate ? (
          <div className="mt-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Verified Certificate Issued ✓
                </span>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-primary">
                  {certificate.courseTitle}
                </h2>
                <p className="text-xs text-muted mt-1">
                  Recipient: <strong className="text-foreground">{certificate.studentName}</strong> • Grade:{" "}
                  <strong className="text-primary">{certificate.grade}</strong>
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Certificate ID</p>
                <p className="font-mono text-sm font-bold text-accent mt-0.5">
                  {certificate.certificateNumber}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-3">
              <Link
                href={`/verify/${certificate.certificateNumber}`}
                target="_blank"
                className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-strong shadow-xs"
              >
                View Public Verification Page ↗
              </Link>
              <Link
                href={`/api/certificates/${certificate.certificateNumber}/pdf`}
                target="_blank"
                className="rounded-full border border-primary/20 bg-surface px-6 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/5"
              >
                Download Official PDF ⬇
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] bg-surface-muted p-8 text-center">
            <p className="text-lg font-semibold text-primary">Course in progress</p>
            <p className="mt-2 text-xs text-muted max-w-md mx-auto">
              Once your instructor reviews your recitation and marks your enrollment complete, your certificate with QR verification will automatically become available here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
