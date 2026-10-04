"use client";

import { useEffect } from "react";

export function NativeMobileInit() {
  useEffect(() => {
    async function initNativePlugins() {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) {
          return;
        }

        // 1. Configure Native Status Bar
        try {
          const { StatusBar, Style } = await import("@capacitor/status-bar");
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#0f5132" });
          await StatusBar.setOverlaysWebView({ overlay: false });
        } catch (e) {
          console.warn("StatusBar setup warning:", e);
        }

        // 2. Hide Splash Screen cleanly
        try {
          const { SplashScreen } = await import("@capacitor/splash-screen");
          await SplashScreen.hide({ fadeOutDuration: 400 });
        } catch (e) {
          console.warn("SplashScreen setup warning:", e);
        }

        // 3. Configure Android Hardware Back Button
        try {
          const { App } = await import("@capacitor/app");
          App.addListener("backButton", ({ canGoBack }) => {
            if (canGoBack) {
              window.history.back();
            } else {
              // If at root of portal, minimize app
              App.minimizeApp();
            }
          });
        } catch (e) {
          console.warn("App backButton warning:", e);
        }
      } catch (err) {
        // Non-native environment
      }
    }

    void initNativePlugins();
  }, []);

  return null;
}
