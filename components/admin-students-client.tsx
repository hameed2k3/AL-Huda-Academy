"use client";

import { useMemo, useState } from "react";
import { useAcademyData } from "@/hooks/use-academy-data";

type StudentFormState = {
  fullName: string;
  guardianName: string;
  email: string;
  phone: string;
  courseId: string;
  status: "active" | "completed";
  instructorName: string;
};

const emptyForm: StudentFormState = {
  fullName: "",
  guardianName: "",
  email: "",
  phone: "",
  courseId: "",
  status: "active" as const,
  instructorName: "Ustadha Maryam Siddiqui",
};

export function AdminStudentsClient() {
  const {
    students,
    courses,
    certificates,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    completeCourseForStudent,
    reopenStudentCourse,
  } = useAcademyData();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortedStudents = useMemo(
    () => [...students].sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [students],
  );

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function submit() {
    const payload = {
      fullName: form.fullName,
      guardianName: form.guardianName,
      email: form.email,
      phone: form.phone,
      courseId: form.courseId || null,
      status: form.status,
      instructorName: form.instructorName,
    };

    if (editingId) {
      await updateStudent(editingId, payload);
    } else {
      await createStudent(payload);
    }

    resetForm();
  }

  return (
    <div className="space-y-6">
      <section className="panel-shadow rounded-[2rem] border border-border bg-surface p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Student management
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary">
              Create, edit, and complete student records.
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Field
            label="Student name"
            value={form.fullName}
            onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
          />
          <Field
            label="Guardian name"
            value={form.guardianName}
            onChange={(value) =>
              setForm((current) => ({ ...current, guardianName: value }))
            }
          />
          <Field
            label="Email"
            value={form.email}
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
          />
          <Field
            label="Phone"
            value={form.phone}
            onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
          />
          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">
              Assigned course
            </label>
            <select
              value={form.courseId}
              onChange={(event) =>
                setForm((current) => ({ ...current, courseId: event.target.value }))
              }
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
            >
              <option value="">No course assigned</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Instructor"
            value={form.instructorName}
            onChange={(value) =>
              setForm((current) => ({ ...current, instructorName: value }))
            }
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void submit()}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
          >
            {editingId ? "Update student" : "Create student"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-primary/20 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </section>

      <section className="panel-shadow overflow-hidden rounded-[2rem] border border-border bg-surface">
        <div className="border-b border-border px-6 py-5">
          <h2 className="font-display text-3xl font-semibold text-primary">
            Student records
          </h2>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            <div className="px-6 py-6 text-sm text-muted">Loading students...</div>
          ) : null}
          {error ? (
            <div className="px-6 py-6 text-sm text-rose-700">{error}</div>
          ) : null}
          {sortedStudents.map((student) => {
            const course = courses.find((item) => item.id === student.courseId);
            const certificate = certificates.find(
              (item) => item.id === student.certificateId,
            );

            return (
              <div
                key={student.id}
                className="flex flex-col gap-5 px-6 py-5 xl:flex-row xl:items-center xl:justify-between"
              >
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {student.fullName}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {student.email} • {student.phone}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Course: {course?.title ?? "Not assigned"}
                  </p>
                  {certificate ? (
                    <p className="mt-1 text-sm text-primary">
                      Certificate: {certificate.certificateNumber}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex rounded-full bg-primary/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {student.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(student.id);
                      setForm({
                        fullName: student.fullName,
                        guardianName: student.guardianName,
                        email: student.email,
                        phone: student.phone,
                        courseId: student.courseId ?? "",
                        status: student.status,
                        instructorName: student.instructorName,
                      });
                    }}
                    className="rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
                  >
                    Edit
                  </button>
                  {student.status === "active" ? (
                    <button
                      type="button"
                      onClick={() => void completeCourseForStudent(student.id)}
                      className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
                    >
                      Complete course
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void reopenStudentCourse(student.id)}
                      className="rounded-full border border-accent/40 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent/5"
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void deleteStudent(student.id)}
                    className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          {!sortedStudents.length ? (
            <div className="px-6 py-6 text-sm text-muted">No students found.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-primary">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
      />
    </div>
  );
}
