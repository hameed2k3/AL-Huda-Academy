"use client";

import { useState } from "react";
import Link from "next/link";
import type { StudentDashboardData } from "@/lib/student-dashboard-data";
import type { DayCompletionSummary } from "@/lib/ibadah-types";

type DashboardClientProps = {
  initialData: StudentDashboardData;
};

export function StudentDashboardClient({ initialData }: DashboardClientProps) {
  const [summary, setSummary] = useState<DayCompletionSummary>(initialData.todaySummary);
  const [completedPrayers, setCompletedPrayers] = useState<string[]>(
    initialData.prayerCompletions.map((p) => p.prayerId),
  );
  const [completedDuas, setCompletedDuas] = useState<string[]>(
    initialData.duaCompletions.map((d) => d.duaId),
  );
  const [completedDhikrs, setCompletedDhikrs] = useState<string[]>(
    initialData.dhikrCompletions.map((d) => d.dhikrId),
  );
  const [activeFilter, setActiveFilter] = useState<"all" | "prayers" | "duas" | "dhikrs">("all");
  const [toggling, setToggling] = useState<string | null>(null);

  // Local Tasbih count state for interactive Dhikr counting
  const [dhikrCounts, setDhikrCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const d of initialData.assignedDhikrs) {
      const isDone = initialData.dhikrCompletions.some((c) => c.dhikrId === d.id);
      initial[d.id] = isDone ? d.recommendedCount : 0;
    }
    return initial;
  });

  const { student, course, certificate, streak, prayers, assignedDuas, assignedDhikrs, todayDate } =
    initialData;

  async function handleToggle(type: "prayer" | "dua" | "dhikr", itemId: string) {
    const key = `${type}-${itemId}`;
    if (toggling) return;
    setToggling(key);

    try {
      const res = await fetch("/api/student/ibadah/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          itemId,
          date: todayDate,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to update.");

      const isCompleted = json.data.completed;
      setSummary(json.data.summary);

      if (type === "prayer") {
        setCompletedPrayers((prev) =>
          isCompleted ? [...prev, itemId] : prev.filter((id) => id !== itemId),
        );
      } else if (type === "dua") {
        setCompletedDuas((prev) =>
          isCompleted ? [...prev, itemId] : prev.filter((id) => id !== itemId),
        );
      } else if (type === "dhikr") {
        setCompletedDhikrs((prev) =>
          isCompleted ? [...prev, itemId] : prev.filter((id) => id !== itemId),
        );
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating activity");
    } finally {
      setToggling(null);
    }
  }

  function handleIncrementTasbih(dhikrId: string, targetCount: number) {
    const current = dhikrCounts[dhikrId] || 0;
    const next = current + 1;
    setDhikrCounts((prev) => ({ ...prev, [dhikrId]: next }));

    // Auto complete when target is reached
    if (next >= targetCount && !completedDhikrs.includes(dhikrId)) {
      handleToggle("dhikr", dhikrId);
    }
  }

  function handleResetTasbih(dhikrId: string) {
    setDhikrCounts((prev) => ({ ...prev, [dhikrId]: 0 }));
    if (completedDhikrs.includes(dhikrId)) {
      handleToggle("dhikr", dhikrId);
    }
  }

  const formattedToday = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const prayerIcons: Record<string, string> = {
    Fajr: "🌅",
    Dhuhr: "☀️",
    Asr: "🌤️",
    Maghrib: "🌇",
    Isha: "🌙",
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* 1. Mobile-First Hero Banner with Circular Progress Ring */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-strong via-primary to-[#0e482f] p-5 sm:p-7 text-white shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <span>📅 {formattedToday}</span>
              <span className="opacity-40">•</span>
              <span className="text-accent font-bold">🔥 {streak} Day Streak</span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight">
              Assalamu Alaikum, {student.fullName.split(" ")[0]} 🌿
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-white/80 max-w-md">
              {summary.percentage === 100
                ? "Masha'Allah! You have completed all your daily Ibadah goals."
                : `You've completed ${summary.totalCompleted} of ${summary.totalTasks} goals today. Keep going!`}
            </p>
          </div>

          {/* Radial Progress Gauge */}
          <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-md border border-white/10">
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-accent transition-all duration-700 ease-out"
                  strokeDasharray={`${summary.percentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-white">
                {summary.percentage}%
              </span>
            </div>
            <div className="text-left pr-2">
              <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                Daily Completion
              </p>
              <p className="text-sm font-bold text-white">
                {summary.totalCompleted} / {summary.totalTasks} Done
              </p>
            </div>
          </div>
        </div>

        {/* Mini stats breakdown strip */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-black/15 rounded-xl py-2 px-1">
            <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Salah</p>
            <p className="font-bold text-accent mt-0.5">
              {summary.prayersCompleted} / {summary.prayersTotal}
            </p>
          </div>
          <div className="bg-black/15 rounded-xl py-2 px-1">
            <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Duas</p>
            <p className="font-bold text-accent mt-0.5">
              {summary.duasCompleted} / {summary.duasTotal}
            </p>
          </div>
          <div className="bg-black/15 rounded-xl py-2 px-1">
            <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Dhikrs</p>
            <p className="font-bold text-accent mt-0.5">
              {summary.dhikrsCompleted} / {summary.dhikrsTotal}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Mobile Category Filter Chips (Sticky Touch Navigation) */}
      <div className="sticky top-2 z-20 flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition shadow-xs cursor-pointer ${
            activeFilter === "all"
              ? "bg-primary text-white"
              : "bg-surface border border-border text-foreground hover:bg-surface-muted"
          }`}
        >
          🌟 All Goals ({summary.totalTasks})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("prayers")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition shadow-xs cursor-pointer ${
            activeFilter === "prayers"
              ? "bg-primary text-white"
              : "bg-surface border border-border text-foreground hover:bg-surface-muted"
          }`}
        >
          🕌 Salah ({summary.prayersCompleted}/5)
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("duas")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition shadow-xs cursor-pointer ${
            activeFilter === "duas"
              ? "bg-primary text-white"
              : "bg-surface border border-border text-foreground hover:bg-surface-muted"
          }`}
        >
          🤲 Duas ({summary.duasCompleted}/{assignedDuas.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("dhikrs")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition shadow-xs cursor-pointer ${
            activeFilter === "dhikrs"
              ? "bg-primary text-white"
              : "bg-surface border border-border text-foreground hover:bg-surface-muted"
          }`}
        >
          📿 Tasbih ({summary.dhikrsCompleted}/{assignedDhikrs.length})
        </button>
      </div>

      {/* 3. Five Daily Prayers Timeline Strip */}
      {(activeFilter === "all" || activeFilter === "prayers") && (
        <section className="rounded-3xl border border-border bg-surface p-4 sm:p-6 panel-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-primary flex items-center gap-2">
                <span>🕌</span> Daily Salah (Five Prayers)
              </h3>
              <p className="text-xs text-muted">Tap each prayer when completed</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {summary.prayersCompleted} / 5
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {prayers.map((prayer) => {
              const isDone = completedPrayers.includes(prayer.id);
              const isProcessing = toggling === `prayer-${prayer.id}`;
              const icon = prayerIcons[prayer.name] || "🕌";

              return (
                <button
                  key={prayer.id}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleToggle("prayer", prayer.id)}
                  className={`relative flex flex-col items-center justify-between rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 cursor-pointer min-h-[90px] active:scale-95 ${
                    isDone
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-surface-muted/60 text-foreground hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg">{icon}</span>
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isDone ? "bg-white text-primary" : "border border-border text-muted"
                      }`}
                    >
                      {isDone ? "✓" : ""}
                    </span>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs font-bold uppercase tracking-wider">{prayer.name}</p>
                    <p className="text-[10px] opacity-75 mt-0.5">
                      {isProcessing ? "Saving..." : isDone ? "Done" : "Tap to complete"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Today's Assigned Duas Deck */}
      {(activeFilter === "all" || activeFilter === "duas") && (
        <section className="rounded-3xl border border-border bg-surface p-4 sm:p-6 panel-shadow space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-primary flex items-center gap-2">
                <span>🤲</span> Assigned Daily Duas
              </h3>
              <p className="text-xs text-muted">Recite and practice with correct pronunciation</p>
            </div>
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-amber-800">
              {summary.duasCompleted} / {assignedDuas.length}
            </span>
          </div>

          {assignedDuas.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted bg-surface-muted/50 rounded-2xl">
              No Duas currently assigned for your course level.
            </div>
          ) : (
            <div className="space-y-3">
              {assignedDuas.map((dua) => {
                const isDone = completedDuas.includes(dua.id);
                const isProcessing = toggling === `dua-${dua.id}`;

                return (
                  <div
                    key={dua.id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                      isDone
                        ? "border-emerald-500/30 bg-emerald-50/40"
                        : "border-border bg-surface hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                          {dua.category}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-foreground mt-1">
                          {dua.title}
                        </h4>
                      </div>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleToggle("dua", dua.id)}
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
                          isDone
                            ? "bg-emerald-600 text-white"
                            : "border border-border bg-surface-muted text-foreground hover:bg-primary hover:text-white"
                        }`}
                      >
                        {isProcessing ? "..." : isDone ? "✓ Completed" : "Mark Read"}
                      </button>
                    </div>

                    {/* Arabic Text Display */}
                    <div className="my-3 rounded-xl bg-amber-50/50 border border-amber-200/40 p-3 sm:p-4 text-right">
                      <p className="font-arabic text-lg sm:text-2xl leading-loose text-primary-strong">
                        {dua.arabicText}
                      </p>
                    </div>

                    {/* Transliteration & Meaning */}
                    <div className="space-y-1 text-xs">
                      <p className="italic text-foreground/80">
                        <strong>Pronunciation:</strong> {dua.transliteration}
                      </p>
                      <p className="text-muted">
                        <strong>Meaning:</strong> {dua.translation}
                      </p>
                      {dua.reference && (
                        <p className="text-[10px] text-accent font-medium pt-1">
                          Ref: {dua.reference}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 5. Interactive Digital Tasbih (Dhikr Counter) */}
      {(activeFilter === "all" || activeFilter === "dhikrs") && (
        <section className="rounded-3xl border border-border bg-surface p-4 sm:p-6 panel-shadow space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-primary flex items-center gap-2">
                <span>📿</span> Interactive Tasbih Counter (Dhikr)
              </h3>
              <p className="text-xs text-muted">Tap the bead counter on your phone to count repetitions</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {summary.dhikrsCompleted} / {assignedDhikrs.length}
            </span>
          </div>

          {assignedDhikrs.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted bg-surface-muted/50 rounded-2xl">
              No Dhikrs currently assigned.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {assignedDhikrs.map((dhikr) => {
                const count = dhikrCounts[dhikr.id] || 0;
                const isDone = completedDhikrs.includes(dhikr.id);
                const progressPct = Math.min(100, Math.round((count / dhikr.recommendedCount) * 100));

                return (
                  <div
                    key={dhikr.id}
                    className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                      isDone
                        ? "border-emerald-500/30 bg-emerald-50/30"
                        : "border-border bg-surface hover:border-primary/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800">
                          {dhikr.category}
                        </span>
                        <span className="text-xs font-bold text-primary">
                          Goal: {dhikr.recommendedCount}x
                        </span>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base text-foreground mt-2">
                        {dhikr.title}
                      </h4>

                      <div className="my-3 rounded-xl bg-amber-50/50 border border-amber-200/40 p-3 text-right">
                        <p className="font-arabic text-lg sm:text-xl leading-relaxed text-primary-strong">
                          {dhikr.arabicText}
                        </p>
                      </div>

                      <p className="text-xs text-muted italic line-clamp-2">
                        {dhikr.translation}
                      </p>
                    </div>

                    {/* Interactive Tasbih Counter Action */}
                    <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-bold text-muted mb-1">
                          <span>{count} / {dhikr.recommendedCount}</span>
                          <span>{progressPct}%</span>
                        </div>
                        <div className="w-full bg-surface-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleResetTasbih(dhikr.id)}
                          className="rounded-full p-2 text-xs text-muted hover:bg-surface-muted transition"
                          title="Reset count"
                        >
                          ↺
                        </button>
                        <button
                          type="button"
                          onClick={() => handleIncrementTasbih(dhikr.id, dhikr.recommendedCount)}
                          className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-primary text-white hover:bg-primary-strong"
                          }`}
                        >
                          {isDone ? "✓ Done" : "+1 Count"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 6. Quick Course & Certificate Link */}
      {course && (
        <section className="rounded-3xl border border-border bg-surface p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <p className="text-xs text-muted font-medium">Currently Enrolled</p>
              <h4 className="text-sm font-bold text-foreground">{course.title}</h4>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/student/courses"
              className="rounded-full border border-border bg-surface-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-primary hover:text-white transition"
            >
              View Curriculum
            </Link>
            {certificate && (
              <Link
                href="/student/certificates"
                className="rounded-full bg-accent/20 border border-accent/30 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-accent hover:text-white transition"
              >
                🎓 Certificate
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
