import type { ReactNode } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="container-shell py-8">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-[2rem] border border-border bg-surface px-6 py-4 panel-shadow">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Admin area
            </p>
            <h1 className="font-display text-3xl font-semibold text-primary">
              Academy dashboard
            </h1>
            <p className="mt-1 text-sm text-muted">{session.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-primary/20 px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5"
            >
              Back to website
            </Link>
            <form action="/api/admin/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <AdminSidebar />
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
