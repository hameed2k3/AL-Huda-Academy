"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DuaItem, DhikrItem, DayCompletionSummary, PrayerItem } from "@/lib/ibadah-types";
import type { AdminStudent, AdminCourse, AdminCertificate } from "@/lib/admin-types";

type StudentDetailProps = {
  data: {
    student: AdminStudent;
    course: AdminCourse | null;
    certificate: AdminCertificate | null;
    todaySummary: DayCompletionSummary;
    streak: number;
    history: DayCompletionSummary[];
    assignedDuas: DuaItem[];
    assignedDhikrs: DhikrItem[];
    allPrayers: PrayerItem[];
  };
};

export function AdminStudentDetailClient({ data }: StudentDetailProps) {
  const { student, course, certificate, todaySummary, streak, history, allPrayers } = data;
  const [activeTab, setActiveTab] = useState<"overview" | "assignments" | "history">("overview");

  // Assignment states
  const [allDuas, setAllDuas] = useState<DuaItem[]>([]);
  const [allDhikrs, setAllDhikrs] = useState<DhikrItem[]>([]);
  const [selectedDuaIds, setSelectedDuaIds] = useState<string[]>(
    data.assignedDuas.map((d) => d.id),
  );
  const [selectedDhikrIds, setSelectedDhikrIds] = useState<string[]>(
    data.assignedDhikrs.map((d) => d.id),
  );
  const [savingAssignments, setSavingAssignments] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadAllIbadah() {
      try {
        const [dRes, dhRes] = await Promise.all([
          fetch("/api/admin/duas").then((r) => r.json()),
          fetch("/api/admin/dhikrs").then((r) => r.json()),
        ]);
        if (dRes.ok) setAllDuas(dRes.data);
        if (dhRes.ok) setAllDhikrs(dhRes.data);
      } catch (err) {
        console.error("Failed to load ibadah pool:", err);
      }
    }
    void loadAllIbadah();
  }, []);

  async function handleSaveAssignments() {
    setSavingAssignments(true);
    setSavedSuccess(false);
    try {
      const res = await fetch(`/api/admin/students/${student.id}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duaIds: selectedDuaIds,
          dhikrIds: selectedDhikrIds,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save assignments");
    } finally {
      setSavingAssignments(false);
    }
  }

  function toggleDua(id: string) {
    setSelectedDuaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function toggleDhikr(id: string) {
    setSelectedDhikrIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* 1. Header Profile Banner */}
      <div className="panel-shadow rounded-3xl border border-border bg-surface p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/admin/students"
                className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-primary transition"
              >
                ← Back to Students
              </Link>
              <span className="text-border">•</span>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                  student.status === "completed"
                    ? "bg-accent/20 text-amber-900 border border-accent/30"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}
              >
                {student.status}
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-primary">
              {student.fullName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              {student.email} • {student.phone} • Guardian: <strong>{student.guardianName || "N/A"}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-center min-w-[100px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Active Streak</p>
              <p className="font-display text-xl sm:text-2xl font-bold text-accent">🔥 {streak} Days</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-center min-w-[100px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Today's Progress</p>
              <p className="font-display text-xl sm:text-2xl font-bold text-primary">{todaySummary.percentage}%</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === "overview"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:bg-surface-muted hover:text-primary"
            }`}
          >
            📋 Overview & Progress
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("assignments")}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === "assignments"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:bg-surface-muted hover:text-primary"
            }`}
          >
            🤲 Manage Duas & Dhikrs ({selectedDuaIds.length + selectedDhikrIds.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === "history"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:bg-surface-muted hover:text-primary"
            }`}
          >
            📊 14-Day History Logs
          </button>
        </div>
      </div>

      {/* 2. Tab: Overview & Course */}
      {activeTab === "overview" && (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Card 1: Today's Live Ibadah Status */}
          <div className="panel-shadow rounded-3xl border border-border bg-surface p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
                <span>🕌</span> Today's Ibadah Activity
              </h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {todaySummary.totalCompleted} / {todaySummary.totalTasks} Tasks
              </span>
            </div>

            {/* Salah Progress Strip */}
            <div>
              <p className="text-xs font-semibold text-muted mb-2">Five Daily Prayers</p>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {allPrayers.map((prayer) => (
                  <div
                    key={prayer.id}
                    className="rounded-xl border border-border bg-surface-muted/60 p-2 text-center"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      {prayer.name}
                    </p>
                    <p className="text-xs mt-1">
                      {todaySummary.prayersCompleted > 0 ? "✓" : "○"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dua & Dhikr metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-surface-muted p-3">
                <p className="text-[11px] font-medium text-muted">Assigned Duas</p>
                <p className="text-base font-bold text-primary mt-0.5">
                  {todaySummary.duasCompleted} / {todaySummary.duasTotal} Recited
                </p>
              </div>
              <div className="rounded-2xl bg-surface-muted p-3">
                <p className="text-[11px] font-medium text-muted">Assigned Dhikrs</p>
                <p className="text-base font-bold text-primary mt-0.5">
                  {todaySummary.dhikrsCompleted} / {todaySummary.dhikrsTotal} Recited
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Certificate & Official Documents */}
          <div className="panel-shadow rounded-3xl border border-border bg-surface p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
                <span>🎓</span> Official Certificate
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  certificate
                    ? "bg-emerald-100 text-emerald-800"
                    : student.status === "completed"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-surface-muted text-muted"
                }`}
              >
                {certificate ? "Issued" : student.status === "completed" ? "Ready to Issue" : "In Progress"}
              </span>
            </div>

            {certificate ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Certificate Number
                    </p>
                    <p className="text-base sm:text-lg font-bold text-primary mt-0.5">
                      {certificate.certificateNumber}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-600 text-white text-xs font-bold px-3 py-1">
                    {certificate.grade}
                  </span>
                </div>

                <div className="text-xs text-muted flex flex-wrap gap-4 pt-1">
                  <span>Course: <strong className="text-foreground">{certificate.courseTitle}</strong></span>
                  <span>Issued: <strong className="text-foreground">{certificate.issueDate}</strong></span>
                </div>

                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  <Link
                    href={`/verify/${certificate.certificateNumber}`}
                    target="_blank"
                    className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-strong transition"
                  >
                    View QR Verification Page ↗
                  </Link>
                  <a
                    href={`/api/certificates/${certificate.certificateNumber}/download`}
                    target="_blank"
                    className="rounded-full border border-primary/20 bg-surface px-4 py-2 text-xs font-bold text-primary hover:bg-primary/5 transition"
                  >
                    Download PDF Certificate ⬇
                  </a>
                </div>
              </div>
            ) : student.status === "completed" ? (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-3 text-xs">
                <p className="font-bold text-amber-900 text-sm">
                  ✓ Student has completed the course!
                </p>
                <p className="text-muted">
                  Completed on <strong>{student.completedAt || "Recently"}</strong>. Official certificate is ready.
                </p>
                <a
                  href="/admin/certificates"
                  className="inline-block rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-strong transition"
                >
                  Go to Certificates Manager →
                </a>
              </div>
            ) : (
              <div className="rounded-2xl bg-surface-muted p-4 text-xs text-muted">
                Student is currently actively learning. Once marked complete, their certificate with QR verification will appear here automatically.
              </div>
            )}
          </div>

          {/* Card 3: Assigned Course & Academic Track */}
          <div className="panel-shadow rounded-3xl border border-border bg-surface p-5 sm:p-6 space-y-3">
            <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
              <span>📖</span> Enrolled Course
            </h3>
            {course ? (
              <div className="space-y-3">
                <div className="rounded-2xl bg-surface-muted p-4">
                  <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                    {course.duration}
                  </span>
                  <p className="text-base font-bold text-primary mt-1.5">{course.title}</p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{course.description}</p>
                </div>
                <div className="text-xs text-muted space-y-1">
                  <p>Instructor: <strong className="text-foreground">{student.instructorName}</strong></p>
                  <p>Enrolled since: <strong className="text-foreground">{student.createdAt}</strong></p>
                  {student.completedAt && (
                    <p>Completed on: <strong className="text-emerald-700">{student.completedAt}</strong></p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted">No course currently assigned to this student.</p>
            )}
          </div>

          {/* Card 4: Guardian & Personal Profile Info */}
          <div className="panel-shadow rounded-3xl border border-border bg-surface p-5 sm:p-6 space-y-3">
            <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
              <span>👤</span> Contact & Guardian Profile
            </h3>
            <div className="rounded-2xl bg-surface-muted p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted">Student Name</span>
                <strong className="text-foreground">{student.fullName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted">Guardian Name</span>
                <strong className="text-foreground">{student.guardianName || "Not Provided"}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted">Email</span>
                <strong className="text-foreground">{student.email}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Phone Contact</span>
                <strong className="text-foreground">{student.phone}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Tab: Assignments (Duas & Dhikrs) */}
      {activeTab === "assignments" && (
        <div className="panel-shadow rounded-3xl border border-border bg-surface p-5 sm:p-7 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-primary">
                Assigned Duas & Dhikrs for {student.fullName}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Toggle the checkmark to assign or remove items from the student's daily portal checklist.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveAssignments}
              disabled={savingAssignments}
              className="rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-primary-strong disabled:opacity-50 cursor-pointer"
            >
              {savingAssignments ? "Saving..." : "Save Assignments"}
            </button>
          </div>

          {savedSuccess && (
            <div className="rounded-2xl bg-emerald-100 border border-emerald-300 p-3 text-xs font-bold text-emerald-800">
              ✓ Assignments updated successfully!
            </div>
          )}

          {/* Duas Selector */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
              Daily Duas ({selectedDuaIds.length} Selected)
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {allDuas.map((dua) => {
                const isSelected = selectedDuaIds.includes(dua.id);
                return (
                  <div
                    key={dua.id}
                    onClick={() => toggleDua(dua.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-border bg-surface-muted/40 hover:border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {dua.category}
                        </span>
                        <h5 className="font-bold text-sm text-foreground mt-1">{dua.title}</h5>
                      </div>
                      <span
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? "bg-primary text-white" : "border border-border text-muted"
                        }`}
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                    </div>
                    <p className="font-arabic text-sm text-right text-primary-strong mt-2">
                      {dua.arabicText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dhikrs Selector */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
              Daily Dhikrs ({selectedDhikrIds.length} Selected)
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {allDhikrs.map((dhikr) => {
                const isSelected = selectedDhikrIds.includes(dhikr.id);
                return (
                  <div
                    key={dhikr.id}
                    onClick={() => toggleDhikr(dhikr.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-border bg-surface-muted/40 hover:border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                          {dhikr.recommendedCount}x Repetitions
                        </span>
                        <h5 className="font-bold text-sm text-foreground mt-1">{dhikr.title}</h5>
                      </div>
                      <span
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? "bg-primary text-white" : "border border-border text-muted"
                        }`}
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                    </div>
                    <p className="font-arabic text-sm text-right text-primary-strong mt-2">
                      {dhikr.arabicText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Tab: History */}
      {activeTab === "history" && (
        <div className="panel-shadow rounded-3xl border border-border bg-surface p-5 sm:p-7 space-y-4">
          <div className="pb-3 border-b border-border">
            <h3 className="text-lg sm:text-xl font-bold text-primary">
              14-Day Ibadah History Log
            </h3>
            <p className="text-xs text-muted">Daily breakdown of prayers and recitations submitted by the student.</p>
          </div>

          <div className="space-y-2.5">
            {history.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between rounded-2xl border border-border bg-surface-muted/50 p-3.5 text-xs"
              >
                <div>
                  <p className="font-bold text-foreground">{day.date}</p>
                  <p className="text-muted text-[11px]">
                    Prayers: {day.prayersCompleted}/5 • Duas: {day.duasCompleted}/{day.duasTotal} • Dhikrs: {day.dhikrsCompleted}/{day.dhikrsTotal}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      day.percentage === 100
                        ? "bg-emerald-100 text-emerald-800"
                        : day.percentage > 50
                        ? "bg-amber-100 text-amber-800"
                        : "bg-surface text-muted"
                    }`}
                  >
                    {day.percentage}% Done
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
