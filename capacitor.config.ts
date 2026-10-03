import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.alhuda.academy",
  appName: "Al-Huda Quran Academy",
  webDir: "public",
  server: {
    // Portal-Direct Entry point for Mobile App
    url: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/student/login`
      : "https://al-huda-quran-academy.vercel.app/student/login",
    cleartext: false,
    androidScheme: "https",
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
