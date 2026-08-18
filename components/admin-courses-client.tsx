"use client";

import { useState } from "react";
import { useAcademyData } from "@/hooks/use-academy-data";

const emptyCourse = {
  title: "",
  duration: "",
  description: "",
  certificateAvailable: true,
};

export function AdminCoursesClient() {
  const {
    courses,
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    resetDemoData,
  } = useAcademyData();
  const [form, setForm] = useState(emptyCourse);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function submit() {
    if (editingId) {
      await updateCourse(editingId, form);
    } else {
      await createCourse(form);
    }

    setForm(emptyCourse);
    setEditingId(null);
  }

  return (
    <div className="space-y-6">
      <section className="panel-shadow rounded-[2rem] border border-border bg-surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Course management
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-primary">
          Create and maintain the academy course catalog.
        </h2>
        <div className="mt-8 grid gap-4">
          <Field
            label="Course title"
            value={form.title}
            onChange={(value) => setForm((current) => ({ ...current, title: value }))}
          />
          <Field
            label="Duration"
            value={form.duration}
            onChange={(value) => setForm((current) => ({ ...current, duration: value }))}
          />
          <div>
            <label className="mb-2 block text-sm font-semibold text-primary">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.certificateAvailable}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  certificateAvailable: event.target.checked,
                }))
              }
            />
            Certificate available for this course
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void submit()}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
          >
            {editingId ? "Update course" : "Create course"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyCourse);
              }}
              className="rounded-full border border-primary/20 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
            >
              Cancel edit
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => void resetDemoData()}
            className="rounded-full border border-accent/40 px-6 py-3 text-sm font-medium text-accent transition hover:bg-accent/5"
          >
            Reset demo data
          </button>
        </div>
      </section>

      <section className="panel-shadow overflow-hidden rounded-[2rem] border border-border bg-surface">
        <div className="border-b border-border px-6 py-5">
          <h2 className="font-display text-3xl font-semibold text-primary">
            Course list
          </h2>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            <div className="px-6 py-6 text-sm text-muted">Loading courses...</div>
          ) : null}
          {error ? (
            <div className="px-6 py-6 text-sm text-rose-700">{error}</div>
          ) : null}
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-4 px-6 py-5 xl:flex-row xl:items-center xl:justify-between"
            >
              <div className="max-w-3xl">
                <p className="text-lg font-semibold text-foreground">{course.title}</p>
                <p className="mt-1 text-sm text-muted">{course.duration}</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {course.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex rounded-full bg-primary/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {course.certificateAvailable ? "Certificate ready" : "No certificate"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(course.id);
                    setForm({
                      title: course.title,
                      duration: course.duration,
                      description: course.description,
                      certificateAvailable: course.certificateAvailable,
                    });
                  }}
                  className="rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void deleteCourse(course.id)}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
