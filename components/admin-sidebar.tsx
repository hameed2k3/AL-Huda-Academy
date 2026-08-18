import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-[2rem] border border-border bg-surface p-6 panel-shadow">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
        Admin area
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-primary">
        Academy operations
      </h2>
      <div className="mt-8 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/6 hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
