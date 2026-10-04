import { Capacitor } from "@capacitor/core";

export type PrayerAlarmConfig = {
  id: number;
  title: string;
  body: string;
  hour: number;
  minute: number;
};

export const DEFAULT_PRAYER_ALARMS: PrayerAlarmConfig[] = [
  {
    id: 101,
    title: "🕌 Fajr Prayer Time",
    body: "Rise and pray Fajr. 'Indeed, prayer has been decreed upon the believers at specified times.'",
    hour: 5,
    minute: 15,
  },
  {
    id: 102,
    title: "🤲 Morning Adhkar Reminder",
    body: "Recite your morning protection Duas and Ayat al-Kursi to start your day with Barakah.",
    hour: 6,
    minute: 30,
  },
  {
    id: 103,
    title: "🕌 Dhuhr Prayer Time",
    body: "Time for Dhuhr Salah. Take a break to remember Allah.",
    hour: 12,
    minute: 30,
  },
  {
    id: 104,
    title: "🕌 Asr Prayer Time",
    body: "Time for Asr Salah. Guard strictly your afternoon prayer.",
    hour: 16,
    minute: 15,
  },
  {
    id: 105,
    title: "🕌 Maghrib Prayer & Evening Adhkar",
    body: "Sunset has arrived. Pray Maghrib and complete your evening Dhikrs.",
    hour: 18,
    minute: 25,
  },
  {
    id: 106,
    title: "🕌 Isha Prayer Time",
    body: "Complete your 5 daily prayers with Isha Salah before rest.",
    hour: 19,
    minute: 45,
  },
];

export async function checkLocalAlarmPermissions(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const status = await LocalNotifications.checkPermissions();
    if (status.display === "granted") return true;
    const req = await LocalNotifications.requestPermissions();
    return req.display === "granted";
  } catch {
    return false;
  }
}

export async function scheduleAllPrayerAlarms(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const granted = await checkLocalAlarmPermissions();
    if (!granted) return false;

    // Cancel existing alarms before scheduling
    const existing = await LocalNotifications.getPending();
    if (existing.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: existing.notifications.map((n) => ({ id: n.id })),
      });
    }

    const notifications = DEFAULT_PRAYER_ALARMS.map((alarm) => ({
      id: alarm.id,
      title: alarm.title,
      body: alarm.body,
      schedule: {
        on: {
          hour: alarm.hour,
          minute: alarm.minute,
        },
        repeats: true,
        allowWhileIdle: true,
      },
      sound: "beep.wav",
      smallIcon: "res://ic_stat_icon",
      iconColor: "#0f5132",
    }));

    await LocalNotifications.schedule({ notifications });
    localStorage.setItem("al_huda_prayer_alarms_enabled", "true");
    return true;
  } catch (err) {
    console.error("Failed to schedule local prayer alarms:", err);
    return false;
  }
}

export async function cancelAllPrayerAlarms(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const existing = await LocalNotifications.getPending();
    if (existing.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: existing.notifications.map((n) => ({ id: n.id })),
      });
    }
    localStorage.setItem("al_huda_prayer_alarms_enabled", "false");
  } catch (err) {
    console.error("Failed to cancel local alarms:", err);
  }
}

export async function sendTestPrayerNotification(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const granted = await checkLocalAlarmPermissions();
    if (!granted) return false;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999,
          title: "🕌 Test Prayer Alarm — Al-Huda Academy",
          body: "Prayer alarms and on-device reminders are working perfectly on your phone!",
          schedule: { at: new Date(Date.now() + 2000) },
          smallIcon: "res://ic_stat_icon",
          iconColor: "#0f5132",
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
}
