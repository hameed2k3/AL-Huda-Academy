"use client";

import { useAcademyData } from "@/hooks/use-academy-data";

export function AdminDashboardClient() {
  const { students, certificates, courses, loading, error } = useAcademyData();

  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-[2rem] border border-border bg-surface"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-surface p-6 text-sm text-rose-700 panel-shadow">
        {error}
      </div>
    );
  }

  const activeStudents = students.filter((student) => student.status === "active");
  const completedStudents = students.filter(
    (student) => student.status === "completed",
  );
  const recentCertificates = [...certificates]
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
    .slice(0, 6);

  const stats = [
    {
      label: "Total students",
      value: String(students.length),
      note: `${activeStudents.length} active learners`,
    },
    {
      label: "Courses",
      value: String(courses.length),
      note: "Managed from admin",
    },
    {
      label: "Completed students",
      value: String(completedStudents.length),
      note: "Eligible for certification",
    },
    {
      label: "Certificates",
      value: String(certificates.length),
      note: "Generated from real admin records",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="panel-shadow rounded-[2rem] border border-border bg-surface p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {stat.label}
            </p>
            <h2 className="mt-4 font-display text-5xl font-semibold text-primary">
              {stat.value}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">{stat.note}</p>
          </article>
        ))}
      </div>

      <section className="panel-shadow overflow-hidden rounded-[2rem] border border-border bg-surface">
        <div className="border-b border-border px-6 py-5">
          <h2 className="font-display text-3xl font-semibold text-primary">
            Recent certificates
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-background">
              <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Issue date</th>
                <th className="px-6 py-4">Certificate</th>
              </tr>
            </thead>
            <tbody>
              {recentCertificates.map((certificate) => (
                <tr key={certificate.id} className="border-t border-border">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {certificate.studentName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {certificate.courseTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {certificate.issueDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary">
                    {certificate.certificateNumber}
                  </td>
                </tr>
              ))}
              {!recentCertificates.length ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-sm text-muted">
                    No certificates have been generated yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
