"use client";

import { useEffect, useState } from "react";
import {
  checkLocalAlarmPermissions,
  scheduleAllPrayerAlarms,
  cancelAllPrayerAlarms,
  sendTestPrayerNotification,
  DEFAULT_PRAYER_ALARMS,
} from "@/lib/mobile-prayer-alarms";

export function PrayerAlarmsCard() {
  const [isSupported, setIsSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (Capacitor.isNativePlatform()) {
          setIsSupported(true);
          const isEnabled = localStorage.getItem("al_huda_prayer_alarms_enabled") === "true";
          setEnabled(isEnabled);
        }
      } catch {
        setIsSupported(false);
      }
    }
    void checkStatus();
  }, []);

  async function handleToggle() {
    setLoading(true);
    setMessage(null);
    try {
      if (!enabled) {
        const hasPerms = await checkLocalAlarmPermissions();
        if (!hasPerms) {
          setMessage("Notification permission was not granted. Please enable notifications in your phone settings.");
          setLoading(false);
          return;
        }
        const success = await scheduleAllPrayerAlarms();
        if (success) {
          setEnabled(true);
          setMessage("✓ 5 Daily Prayer Alarms & Morning Adhkar scheduled on this phone!");
        } else {
          setMessage("Could not schedule alarms. Please check permissions.");
        }
      } else {
        await cancelAllPrayerAlarms();
        setEnabled(false);
        setMessage("Alarms disabled on this device.");
      }
    } catch (err) {
      setMessage("Error updating prayer alarms.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTest() {
    const sent = await sendTestPrayerNotification();
    if (sent) {
      setMessage("✓ Test notification triggered! Check your notification bar in 2 seconds.");
    } else {
      setMessage("Please enable notification permissions first.");
    }
  }

  // Render on both native and web with responsive view
  return (
    <div className="panel-shadow rounded-3xl border border-border bg-surface p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-lg">
            🔔
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-primary">
              Daily Salah & Adhkar Alarms
            </h3>
            <p className="text-xs text-muted">
              {isSupported
                ? "On-device native notification reminders for all 5 daily prayers."
                : "Scheduled daily reminders for Fajr, Dhuhr, Asr, Maghrib, and Isha."}
            </p>
          </div>
        </div>

        {isSupported && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggle}
              disabled={loading}
              className={`rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                enabled
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-surface-muted border border-border text-foreground hover:bg-surface"
              }`}
            >
              {loading ? "..." : enabled ? "✓ Alarms Active" : "+ Turn On Alarms"}
            </button>
            {enabled && (
              <button
                type="button"
                onClick={handleTest}
                className="rounded-full border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-bold text-accent hover:bg-accent/20 transition cursor-pointer"
              >
                Test Sound
              </button>
            )}
          </div>
        )}
      </div>

      {message && (
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 text-xs font-medium text-primary">
          {message}
        </div>
      )}

      {/* Grid of prayer alarms */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {DEFAULT_PRAYER_ALARMS.map((alarm) => {
          const timeStr = `${String(alarm.hour).padStart(2, "0")}:${String(alarm.minute).padStart(2, "0")}`;
          return (
            <div
              key={alarm.id}
              className="rounded-2xl border border-border bg-surface-muted/60 p-3 text-center"
            >
              <span className="text-[11px] font-bold text-primary block leading-tight">
                {alarm.title.replace("Time", "").trim()}
              </span>
              <span className="mt-1 inline-block font-mono text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                ⏰ {timeStr}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
