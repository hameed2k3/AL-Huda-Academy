import type { ReactNode } from "react";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <AdminShell adminEmail={session.email}>
      {children}
    </AdminShell>
  );
}
