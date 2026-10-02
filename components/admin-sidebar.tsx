"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  BookOpen,
  Heart,
  GraduationCap,
  Award,
  Settings,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/duas", label: "Duas Management", icon: BookOpen },
  { href: "/admin/dhikrs", label: "Dhikrs Management", icon: Heart },
  { href: "/admin/courses", label: "Courses", icon: GraduationCap },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose?: () => void;
}) {
  return (
    <div className="h-full flex flex-col font-poppins">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
        <Link
          href="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5"
        >
          {/* Islamic star mark */}
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "#0f5132" }}
          >
            ★
          </span>
          <span
            className="font-montserrat font-bold text-sm tracking-wide leading-tight"
            style={{ color: "#0f5132" }}
          >
            AL-HUDA
            <br />
            <span style={{ color: "#c9a227" }} className="text-[11px] font-semibold tracking-widest">
              ACADEMY
            </span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-2">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em] font-montserrat"
          style={{ color: "#c9a227" }}
        >
          Admin Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto admin-scroll px-3 pb-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-montserrat transition-all duration-200 ${
                isActive
                  ? "font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
              }`}
              style={
                isActive
                  ? {
                      background: "#dceee4",
                      color: "#0f5132",
                    }
                  : {}
              }
            >
              {/* Active left border indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                  style={{ background: "#0f5132" }}
                />
              )}
              <Icon
                className="w-4 h-4 shrink-0"
                style={{ color: isActive ? "#0f5132" : "#94a3b8" }}
              />
              <span className="truncate flex-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 font-poppins transition-colors"
        >
          <span>← Back to website</span>
        </Link>
      </div>
    </div>
  );
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop fixed left sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile slide-over drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <aside className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-white border-r border-slate-200 shadow-2xl z-50 flex flex-col animate-admin-sidebar">
            <SidebarContent pathname={pathname} onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
