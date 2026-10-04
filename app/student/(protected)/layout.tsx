import type { ReactNode } from "react";
import Link from "next/link";
import { requireStudentSession } from "@/lib/student-auth";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { PushNotificationListener } from "@/components/push-notification-listener";
import { StudentChangePasswordModal } from "@/components/student-change-password-modal";
import { NativeMobileInit } from "@/components/native-mobile-init";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireStudentSession();

  return (
    <div className="min-h-screen bg-surface-muted pb-24 md:pb-12 pt-safe">
      <NativeMobileInit />
      <PushNotificationListener />
      <div className="container-shell py-4 sm:py-8">

        {/* Top Header Card */}
        <header className="mb-4 sm:mb-6 flex items-center justify-between gap-3 rounded-2xl sm:rounded-3xl border border-border bg-surface px-4 py-3 sm:px-6 sm:py-4 panel-shadow">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm sm:text-base shrink-0">
              {session.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Student Portal
                </p>
              </div>
              <h1 className="font-display text-base sm:text-xl font-bold text-primary leading-tight">
                {session.fullName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StudentChangePasswordModal />
            <Link
              href="/"
              className="hidden sm:inline-flex rounded-full border border-primary/20 px-3.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/5"
            >
              Academy Home
            </Link>
            <form action="/api/student/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-full bg-surface-muted border border-border px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-foreground transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        </header>


        {/* Main Content Area */}
        <main>{children}</main>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <StudentBottomNav />
    </div>
  );
}
