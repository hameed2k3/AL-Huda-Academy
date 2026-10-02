"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";

interface AdminShellProps {
  adminEmail: string;
  children: React.ReactNode;
}

export function AdminShell({ adminEmail, children }: AdminShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen font-poppins" style={{ background: "#f6f5f2" }}>
      {/* Fixed Top Header */}
      <AdminHeader
        adminEmail={adminEmail}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* Fixed Left Sidebar */}
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main content — offset for sidebar + header */}
      <div className="lg:pl-64 pt-16 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
          {/* Master white canvas — ADMS PageLayout pattern */}
          <div
            className="w-full bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm min-h-[calc(100vh-7rem)] animate-admin-page"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 16px -4px rgba(15,81,50,0.07)" }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
