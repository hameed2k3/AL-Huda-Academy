"use client";

import { useState } from "react";
import Link from "next/link";
import type { DayCompletionSummary } from "@/lib/ibadah-types";

type HistoryClientProps = {
  history: DayCompletionSummary[];
  streak: number;
};

export function StudentHistoryClient({ history, streak }: HistoryClientProps) {
  const [selectedDay, setSelectedDay] = useState<DayCompletionSummary>(history[0] || null);

  const avgCompletion =
    history.length > 0
      ? Math.round(
          history.reduce((acc, curr) => acc + curr.percentage, 0) / history.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Desktop Navigation Tab */}
      <div className="hidden md:flex items-center gap-2">
        <Link
          href="/student/dashboard"
          className="rounded-full border border-border bg-surface px-5 py-2 text-xs font-medium text-foreground hover:bg-surface-muted transition"
        >
          🌿 Today's Ibadah
        </Link>
        <Link
          href="/student/history"
          className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs"
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
          className="rounded-full border border-border bg-surface px-5 py-2 text-xs font-medium text-foreground hover:bg-surface-muted transition"
        >
          🎓 Certificates
        </Link>
      </div>

      {/* Summary KPI header */}
      <div className="panel-shadow rounded-[2.5rem] border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Consistency & Analytics
            </p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-primary">
              Progress History
            </h1>
            <p className="mt-1 text-sm text-muted">
              Review your consistency, prayer completions, and recitation milestones.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-border bg-surface-muted px-5 py-3.5 text-center min-w-[120px]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Streak</p>
              <p className="font-display text-2xl font-bold text-accent">🔥 {streak} Days</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-3.5 text-center min-w-[120px]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">14-Day Average</p>
              <p className="font-display text-2xl font-bold text-primary">{avgCompletion}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Grid & Detail Inspector */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Daily Breakdown List */}
        <section className="panel-shadow rounded-[2rem] border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-primary mb-4">
            Daily Activity Log
          </h2>

          <div className="space-y-3">
            {history.map((day) => {
              const isSelected = selectedDay?.date === day.date;
              return (
                <div
                  key={day.date}
                  onClick={() => setSelectedDay(day)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-surface-muted/40 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        Prayers: {day.prayersCompleted}/{day.prayersTotal} • Duas: {day.duasCompleted}/{day.duasTotal} • Dhikr: {day.dhikrsCompleted}/{day.dhikrsTotal}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-surface-muted rounded-full h-2.5 overflow-hidden border border-border">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{ width: `${day.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary w-9 text-right">
                        {day.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Selected Day Breakdown Card */}
        {selectedDay && (
          <section className="panel-shadow rounded-[2rem] border border-border bg-surface p-6 sm:p-8 h-fit space-y-6">
            <div>
              <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                Inspection
              </span>
              <h3 className="mt-2 font-display text-2xl font-semibold text-primary">
                {new Date(selectedDay.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <p className="text-xs text-muted mt-1">
                Historical record snapshot for this date.
              </p>
            </div>

            <div className="rounded-2xl bg-surface-muted/80 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">Completion Rate</span>
                <span className="font-display text-xl font-bold text-primary">
                  {selectedDay.percentage}%
                </span>
              </div>
              <div className="w-full bg-surface rounded-full h-3 overflow-hidden border border-border">
                <div
                  className="bg-accent h-full rounded-full"
                  style={{ width: `${selectedDay.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted text-center">
                {selectedDay.totalCompleted} of {selectedDay.totalTasks} total goals met
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <span className="text-xs font-semibold text-foreground">Prayers (Salah)</span>
                <span className="text-xs font-bold text-primary">
                  {selectedDay.prayersCompleted} / {selectedDay.prayersTotal} Done
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <span className="text-xs font-semibold text-foreground">Assigned Duas</span>
                <span className="text-xs font-bold text-primary">
                  {selectedDay.duasCompleted} / {selectedDay.duasTotal} Done
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <span className="text-xs font-semibold text-foreground">Assigned Dhikr</span>
                <span className="text-xs font-bold text-primary">
                  {selectedDay.dhikrsCompleted} / {selectedDay.dhikrsTotal} Done
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/40 p-3 text-[11px] text-muted">
              🔒 <em>Note: Historical entries are locked to maintain reliable consistency records.</em>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
