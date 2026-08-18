import Link from "next/link";
import { academy, navItems } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/92 backdrop-blur">
      <div className="container-shell flex h-[4.5rem] items-center justify-between gap-6 py-4">
        <Link href="/" className="min-w-0">
          <div className="font-display text-3xl font-semibold text-primary">
            {academy.shortName}
          </div>
          <div className="-mt-1 text-xs uppercase tracking-[0.28em] text-muted">
            Quran Academy
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/verify?certificate=AHQA-2026-0001"
            className="hidden rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5 sm:inline-flex"
          >
            Try verification
          </Link>
          <a
            href={academy.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
