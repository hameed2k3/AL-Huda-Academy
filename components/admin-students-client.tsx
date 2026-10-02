"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");

  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesStatus =
          statusFilter === "all" ? true : student.status === statusFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          student.fullName.toLowerCase().includes(q) ||
          student.email.toLowerCase().includes(q) ||
          student.phone.includes(q) ||
          (student.guardianName && student.guardianName.toLowerCase().includes(q));

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [students, statusFilter, searchQuery]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
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
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* 1. Header & Controls Bar */}
      <section className="rounded-3xl border border-border bg-surface p-4 sm:p-6 panel-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Student Directory
              </p>
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-primary">
              Students ({students.length})
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Manage enrollments, assign Ibadah curriculum, and issue certificates.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm && !editingId) {
                setShowForm(false);
              } else {
                setForm(emptyForm);
                setEditingId(null);
                setShowForm(true);
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-primary-strong active:scale-95 cursor-pointer shrink-0"
          >
            <span>{showForm && !editingId ? "✕ Close Form" : "+ Enroll New Student"}</span>
          </button>
        </div>

        {/* Search & Filter Strip */}
        <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-primary focus:bg-surface transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-muted hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                statusFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-surface-muted text-muted hover:text-foreground"
              }`}
            >
              All ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                statusFilter === "active"
                  ? "bg-primary text-white"
                  : "bg-surface-muted text-muted hover:text-foreground"
              }`}
            >
              Active ({students.filter((s) => s.status === "active").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                statusFilter === "completed"
                  ? "bg-primary text-white"
                  : "bg-surface-muted text-muted hover:text-foreground"
              }`}
            >
              Completed ({students.filter((s) => s.status === "completed").length})
            </button>
          </div>
        </div>
      </section>

      {/* 2. Enroll / Edit Student Form Drawer */}
      {showForm && (
        <section className="rounded-3xl border border-primary/20 bg-emerald-50/20 p-4 sm:p-6 panel-shadow">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-bold text-base sm:text-lg text-primary">
              {editingId ? "Edit Student Details" : "Enroll New Student"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-muted hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field
              label="Student Full Name *"
              value={form.fullName}
              placeholder="e.g. Zayd Ibrahim"
              onChange={(value) => setForm((c) => ({ ...c, fullName: value }))}
            />
            <Field
              label="Guardian Name"
              value={form.guardianName}
              placeholder="e.g. Ibrahim Mansoor"
              onChange={(value) => setForm((c) => ({ ...c, guardianName: value }))}
            />
            <Field
              label="Email Address *"
              value={form.email}
              placeholder="student@example.com"
              onChange={(value) => setForm((c) => ({ ...c, email: value }))}
            />
            <Field
              label="Phone Number"
              value={form.phone}
              placeholder="+91 9000000000"
              onChange={(value) => setForm((c) => ({ ...c, phone: value }))}
            />
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">
                Assigned Course
              </label>
              <select
                value={form.courseId}
                onChange={(e) => setForm((c) => ({ ...c, courseId: e.target.value }))}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-primary"
              >
                <option value="">Select a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Assigned Instructor"
              value={form.instructorName}
              placeholder="Ustadha Maryam Siddiqui"
              onChange={(value) => setForm((c) => ({ ...c, instructorName: value }))}
            />
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void submit()}
              className="rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-primary-strong cursor-pointer"
            >
              {editingId ? "Save Changes" : "Create Student Account"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm font-medium text-muted hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {/* 3. Responsive Student List Cards */}
      <section className="space-y-3">
        {loading && (
          <div className="rounded-3xl border border-border bg-surface p-8 text-center text-sm text-muted">
            Loading student directory...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-center text-xs text-rose-700">
            {error}
          </div>
        )}

        {!loading && filteredStudents.length === 0 && (
          <div className="rounded-3xl border border-border bg-surface p-8 text-center text-sm text-muted">
            No students found matching your criteria.
          </div>
        )}

        {filteredStudents.map((student) => {
          const course = courses.find((c) => c.id === student.courseId);
          const certificate = certificates.find(
            (c) => c.studentId === student.id || c.id === student.certificateId,
          );

          return (
            <div
              key={student.id}
              className="rounded-2xl sm:rounded-3xl border border-border bg-surface p-4 sm:p-5 panel-shadow hover:border-primary/30 transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              {/* Left Student Info */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base shrink-0">
                  {student.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base sm:text-lg text-foreground leading-tight">
                      {student.fullName}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        student.status === "completed"
                          ? "bg-accent/20 text-amber-900 border border-accent/30"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted mt-1">
                    {student.email} • {student.phone} • Guardian: <strong>{student.guardianName || "N/A"}</strong>
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-muted">
                    <span className="inline-flex items-center gap-1 font-medium text-foreground">
                      📖 {course?.title ?? "No Course Assigned"}
                    </span>
                    <span className="text-muted">• Enrolled: {student.createdAt}</span>
                    {certificate && (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        🎓 {certificate.certificateNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
                <Link
                  href={`/admin/students/${student.id}`}
                  className="rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition cursor-pointer"
                >
                  ⚡ Assign Ibadah & Stats →
                </Link>

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
                    setShowForm(true);
                  }}
                  className="rounded-full border border-border bg-surface-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface transition cursor-pointer"
                >
                  Edit
                </button>

                {student.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => void completeCourseForStudent(student.id)}
                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer"
                  >
                    Complete
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void reopenStudentCourse(student.id)}
                    className="rounded-full border border-accent/40 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-50 transition cursor-pointer"
                  >
                    Reopen
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete student record for ${student.fullName}?`)) {
                      void deleteStudent(student.id);
                    }
                  }}
                  className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-primary">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-primary transition"
      />
    </div>
  );
}
