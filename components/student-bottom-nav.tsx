"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, BookOpen, GraduationCap } from "lucide-react";

const NAV_ITEMS = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/history", label: "History", icon: History },
  { href: "/student/courses", label: "Courses", icon: BookOpen },
  { href: "/student/certificates", label: "Certificates", icon: GraduationCap },
];

export function StudentBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/80 bg-surface/95 backdrop-blur-xl px-2 pt-2 pb-safe panel-shadow">
      <div className="flex items-center justify-around">

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/student/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold scale-105"
                  : "text-muted hover:text-foreground font-medium"
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 w-8 h-1 bg-primary rounded-full animate-in fade-in zoom-in duration-200" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? "text-primary stroke-[2.2px]" : "stroke-[1.75px]"}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
