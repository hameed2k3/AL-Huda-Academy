"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, User, ChevronRight } from "lucide-react";

interface AdminHeaderProps {
  adminEmail: string;
  onToggleMobileMenu: () => void;
}

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/students": "Students",
  "/admin/duas": "Duas Management",
  "/admin/dhikrs": "Dhikrs Management",
  "/admin/courses": "Courses",
  "/admin/certificates": "Certificates",
  "/admin/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  // exact match first
  if (BREADCRUMB_MAP[pathname]) return BREADCRUMB_MAP[pathname];
  // prefix match for nested routes (e.g. /admin/students/[id])
  for (const [key, label] of Object.entries(BREADCRUMB_MAP)) {
    if (pathname.startsWith(key + "/")) return label;
  }
  return "Admin";
}

export function AdminHeader({ adminEmail, onToggleMobileMenu }: AdminHeaderProps) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pageTitle = getPageTitle(pathname);

  // Short email display
  const initials = adminEmail ? adminEmail.slice(0, 2).toUpperCase() : "AD";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 font-poppins"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile brand (hidden on desktop — sidebar has it) */}
        <span className="lg:hidden font-montserrat font-bold text-sm tracking-wide" style={{ color: "#0f5132" }}>
          AL-HUDA
        </span>

        {/* Desktop breadcrumb */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-poppins">
          <span className="text-slate-400">Admin</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold" style={{ color: "#0f5132" }}>
            {pageTitle}
          </span>
        </nav>
      </div>

      {/* Right: role badge + avatar */}
      <div className="flex items-center gap-3 relative">
        {/* Role badge — desktop only */}
        <span
          className="hidden xl:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold font-montserrat uppercase tracking-wider border"
          style={{
            background: "#fdf8ec",
            color: "#c9a227",
            borderColor: "#f0d98c",
          }}
        >
          Administrator
        </span>

        {/* Avatar button */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-montserrat transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1"
            style={{ background: "#0f5132" }}
            title={adminEmail}
          >
            {initials}
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2.5 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2.5 font-poppins text-xs animate-admin-dropdown"
              style={{ boxShadow: "0 12px 32px -8px rgba(0,0,0,0.12)" }}
            >
              {/* Profile card */}
              <div
                className="p-3 rounded-xl border mb-1.5 space-y-1"
                style={{ background: "#f6f5f2", borderColor: "#e5ddd1" }}
              >
                <div className="font-bold text-slate-900 font-montserrat text-xs truncate">
                  {adminEmail}
                </div>
                <span
                  className="inline-block mt-1 px-2.5 py-0.5 rounded-full border font-bold text-[10px] font-montserrat uppercase"
                  style={{
                    background: "#fdf8ec",
                    color: "#c9a227",
                    borderColor: "#f0d98c",
                  }}
                >
                  Administrator
                </span>
              </div>

              {/* Profile link */}
              <Link
                href="/admin/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </Link>

              <div className="border-t border-slate-100 my-1" />

              {/* Logout */}
              <form action="/api/admin/auth/logout" method="post">
                <button
                  type="submit"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold font-montserrat"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log Out</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
