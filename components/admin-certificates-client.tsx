"use client";

import Link from "next/link";
import { CertificateDownloadButton } from "@/components/certificate-download-button";
import { useAcademyData } from "@/hooks/use-academy-data";

export function AdminCertificatesClient() {
  const { certificates, students, loading, error, completeCourseForStudent } =
    useAcademyData();

  const completableStudents = students.filter(
    (student) => student.status === "active" && student.courseId,
  );

  return (
    <div className="space-y-6">
      <div className="panel-shadow rounded-[2rem] border border-border bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Completion and certification
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-primary">
          Complete a student course and instantly generate the certificate record.
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {completableStudents.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => void completeCourseForStudent(student.id)}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
            >
              Complete {student.fullName}
            </button>
          ))}
          {!completableStudents.length ? (
            <p className="text-sm text-muted">
              No active student is waiting for completion right now.
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5">
        {loading ? (
          <div className="panel-shadow rounded-[2rem] border border-border bg-surface p-6 text-sm text-muted">
            Loading certificates...
          </div>
        ) : null}
        {error ? (
          <div className="panel-shadow rounded-[2rem] border border-rose-200 bg-surface p-6 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        {certificates.map((certificate) => (
          <article
            key={certificate.id}
            className="panel-shadow rounded-[2rem] border border-border bg-surface p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-display text-3xl font-semibold text-primary">
                  {certificate.studentName}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {certificate.courseTitle} • {certificate.certificateNumber}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Completion: {certificate.completionDate}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/verify?certificate=${certificate.certificateNumber}`}
                  className="rounded-full border border-primary/20 px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5"
                >
                  Open verification
                </Link>
                <CertificateDownloadButton
                  certificate={certificate}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
                />
              </div>
            </div>
          </article>
        ))}
        {!certificates.length ? (
          <div className="panel-shadow rounded-[2rem] border border-border bg-surface p-6 text-sm text-muted">
            No certificates generated yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
