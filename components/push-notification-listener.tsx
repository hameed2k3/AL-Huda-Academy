"use client";

import { useEffect } from "react";

export function PushNotificationListener() {
  useEffect(() => {
    async function initPush() {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) {
          return;
        }

        const { PushNotifications } = await import("@capacitor/push-notifications");

        const permStatus = await PushNotifications.checkPermissions();
        let granted = permStatus.receive === "granted";

        if (!granted) {
          const reqStatus = await PushNotifications.requestPermissions();
          granted = reqStatus.receive === "granted";
        }

        if (granted) {
          await PushNotifications.register();

          await PushNotifications.addListener("registration", async (token) => {
            try {
              await fetch("/api/student/push-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  token: token.value,
                  platform: Capacitor.getPlatform(),
                }),
              });
            } catch (err) {
              console.error("Failed to register push token with server:", err);
            }
          });

          await PushNotifications.addListener("pushNotificationReceived", (notification) => {
            console.log("Push notification received:", notification);
          });
        }
      } catch (err) {
        // Silently handle if not in mobile runtime
      }
    }

    void initPush();
  }, []);

  return null;
}
