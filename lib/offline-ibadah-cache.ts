import type { DuaItem, DhikrItem, PrayerItem, DayCompletionSummary } from "@/lib/ibadah-types";

const CACHE_KEY = "al_huda_offline_ibadah_cache";
const SYNC_QUEUE_KEY = "al_huda_offline_sync_queue";

export type OfflineIbadahPayload = {
  studentId: string;
  studentName: string;
  todayDate: string;
  prayers: PrayerItem[];
  assignedDuas: DuaItem[];
  assignedDhikrs: DhikrItem[];
  summary: DayCompletionSummary;
  cachedAt: number;
};

export type OfflineToggleItem = {
  type: "prayer" | "dua" | "dhikr";
  itemId: string;
  date: string;
  timestamp: number;
};

export function saveOfflineIbadahCache(payload: OfflineIbadahPayload) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("Failed to cache ibadah for offline:", e);
  }
}

export function getOfflineIbadahCache(): OfflineIbadahPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OfflineIbadahPayload;
  } catch {
    return null;
  }
}

export function queueOfflineToggle(item: OfflineToggleItem) {
  if (typeof window === "undefined") return;
  try {
    const queueRaw = localStorage.getItem(SYNC_QUEUE_KEY);
    const queue: OfflineToggleItem[] = queueRaw ? JSON.parse(queueRaw) : [];
    queue.push(item);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.warn("Failed to queue offline toggle:", e);
  }
}

export async function flushOfflineSyncQueue(): Promise<number> {
  if (typeof window === "undefined" || !navigator.onLine) return 0;
  try {
    const queueRaw = localStorage.getItem(SYNC_QUEUE_KEY);
    if (!queueRaw) return 0;
    const queue: OfflineToggleItem[] = JSON.parse(queueRaw);
    if (queue.length === 0) return 0;

    let syncedCount = 0;
    for (const item of queue) {
      try {
        await fetch("/api/student/ibadah/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: item.type,
            itemId: item.itemId,
            date: item.date,
          }),
        });
        syncedCount++;
      } catch {
        // Stop if connection breaks mid-sync
        break;
      }
    }

    if (syncedCount === queue.length) {
      localStorage.removeItem(SYNC_QUEUE_KEY);
    } else {
      // Keep unsynced remainder
      const remainder = queue.slice(syncedCount);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remainder));
    }

    return syncedCount;
  } catch {
    return 0;
  }
}
